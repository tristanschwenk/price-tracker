(async () => {
  const express = require('express');
  const mongoose = require('mongoose');
  const AmazonService = require('./services/amazon');
  const models = require('./models');

  require('dotenv').config();

  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const app = express();
  const port = process.env.PORT;

  app.use(express.json());

  const {
    logger,
    buildAPI,
  } = require('./utils');

  await AmazonService.init();

  /*
   * Methods
   */
  const product = require('./methods/product');

  app.use(buildAPI({
    product,
  }, {
    services: {
      amazon: AmazonService
    },
    models
  }))

  const listener = app.listen(port, () => {
    const {
      address,
      port
    } = listener.address();
    logger(null, `API listening at http://${address}:${port}`);
  });

  process.on('SIGINT', async () => {
    await AmazonService.stop();
    process.exit();
  });
})();