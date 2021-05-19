const puppeteer = require('puppeteer');
const utils = require('../utils');
const Service = require('./service');
const APIError = require('../utils/ApiError');
require('dotenv').config()

const AmazonSelector = {
  DOMAIN_REGEX: /(.*\.)?amazon\.\w/,
  ASIN: '[name=ASIN]',
  NAME: '#productTitle',
  PRICE: '#priceblock_ourprice',
  IMAGE: '#landingImage',
}

class AmazonService extends Service {

  constructor() {
    super();
    let self=this;
    this.serviceName = "Amazon Service";
    this.readCacheFile('amazon.json');
    this.browser = null;
  }

  async stop() {
    await this.browser.close();
  }

  async init() {
    this.logger('Launching browser...');

    this.browser = await puppeteer.launch();

    this.logger('Browser ready.');

    return true;
  }

  async scanProduct(url, silent = false) {
    if(!this.checkUrl(url)) return AmazonServiceError.invalidURL;

    if (!silent) this.logger("Importing...", {url});
    const page = await this.browser.newPage();

    await page.goto(url);

    const asin = (await page.$eval(AmazonSelector.ASIN, (el) => el.value));
    const name = (await page.$eval(AmazonSelector.NAME, (el) => el.textContent)).replace(/\n/g, '');
    const price = parseFloat((await page.$eval(AmazonSelector.PRICE, (el) => el.textContent)).replace(',', '.'));
    const image = (await page.$eval(AmazonSelector.IMAGE, (el) => el.src));
    const timestamp = Date.now();

    if (!silent) this.logger("Import ended", {asin});

    return {
      asin, name, price, timestamp, image
    };
  }

  checkUrl(url) {
    try {
      const pageUrl = new URL(url);

      if (!pageUrl.host.match(AmazonSelector.DOMAIN_REGEX)) {
        return false;
      }
    } catch (e) {
      this.logger(e);
      return false;
    }

    return true;
  }
}

class AmazonServiceError extends APIError {}

AmazonServiceError.invalidURL = new AmazonServiceError('Invalid URL');

module.exports = new AmazonService();