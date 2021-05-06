(async () => {
  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const AmazonService = require('./services/amazon');
  const AuthService = require('./services/auth');
  const models = require('./models');

  require('dotenv').config();

  mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const app = express();
  const port = process.env.PORT;

  app.use(express.json());
  app.use(cors());

  const {
    logger,
    buildAPI,
  } = require('./utils');

  await AmazonService.init();

  /*
   * Methods
   */
  const product = require('./methods/product');
  const auth = require('./methods/auth');

  app.use(buildAPI({
    product,
    auth,
  }, {
    services: {
      amazon: AmazonService,
      auth: AuthService,
    },
    models,
  }));

  const listener = app.listen(port, () => {
    const {
      address,
      port,
    } = listener.address();
    logger(null, `API listening at http://${address}:${port}`);
  });

  process.on('SIGINT', async () => {
    await AmazonService.stop();
    process.exit();
  });
})();
