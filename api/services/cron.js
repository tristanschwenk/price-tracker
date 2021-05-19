const mongoose = require('mongoose');
const utils = require('../utils');
const Service = require('./service');
const APIError = require('../utils/ApiError');
const AmazonService = require('./amazon');
const {
  Product
} = require('../models')

require('dotenv').config()

class CronService extends Service {

  constructor() {
    super();
    let self = this;
    this.delay = 24 * 60 * 60 * 1000;
    this.running = false;
    this.serviceName = "Cron Service";
  }

  async init(delay) {
    this.logger('Cron ready.');
    if (delay) this.delay = delay;
    this.start();
    return true;
  }

  start() {
    this.running = true;
    this._task();
  }

  stop() {
    this.running = false;
  }

  async _task() {
    if (!this.running) return;

    const products = await Product.find({});

    for (let product of products) {
      const {asin, name, price, timestamp, image} = await AmazonService.scanProduct(product.url, true);

      product = {
        ...product.toObject(),
        asin, name, image,
        prices: [
          ...product.prices,
          {
            timestamp,
            value: price
          }
        ]
      }
      await Product.findByIdAndUpdate(product._id, product);
    }

    setTimeout(() => {
      this._task();
    }, this.delay);

  }

}

class CronServiceError extends APIError {}

CronServiceError.invalidURL = new CronServiceError('Invalid URL');

module.exports = new CronService();