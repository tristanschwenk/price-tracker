/* eslint-disable no-constant-condition */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */

(require('dotenv')).config();

const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const readline = require('readline');


//Get new data

const { Schema, model: Model } = mongoose;

console.log = ((oldConsoleLog) => (
  (data, ...args) => {
    if (process.env.DEBUG) oldConsoleLog(data, ...args);
  }
))(console.log);

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const ProductSchema = new Schema({
  url: String,
  name: String,
  asin: String,
  prices: [{
    timestamp: Number,
    value: String,
  }],
});

const Product = new Model('Product', ProductSchema);

const userInput = (question) => new Promise((resolve) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  });
});

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  process.on('SIGINT', async () => {
    await browser.close();
    process.exit();
  });

  while (true) {
    console.log('/======');
    const url = await userInput('| URL: ');

    let pageUrl;

    try {
      pageUrl = new URL(url);

      if (!pageUrl.host.match(/(.*\.)?amazon\.\w/)) {
        console.log('Incorrect url (expecting an amazon one)');
        console.log('\\======\n');
        continue;
      }
    } catch (e) {
      console.log('Incorrect url (expecting an amazon one)');
      console.log('\\======\n');
      continue;
    }

    console.log('\\======\n');
    await page.goto(url);

    const asin = (await page.$eval('[name=ASIN]', (el) => el.value));
    const name = (await page.$eval('#productTitle', (el) => el.textContent)).replace(/\n/g, '');
    const price = (await page.$eval('#priceblock_ourprice', (el) => el.textContent));

    console.log('/======');
    console.log(`| ASIN: ${asin}`);
    console.log(`| NAME: ${name}`);
    console.log(`| PRICE: ${price}`);
    console.log('|======');

    let product = await Product.findOne({ asin });

    if (!product) {
      product = new Product({
        asin,
        name,
        url,
        prices: [{
          timestamp: Date.now(),
          value: price,
        }],
      });

      await product.save();

      console.log('| Product added.');
      console.log('\\======\n');
    } else {
      product.prices.push({
        timestamp: Date.now(),
        value: price,
      });

      await product.save();

      console.log('| Price pushed to product.');
      console.log('\\======\n');
    }
  }
})();
