const puppeteer = require('puppeteer')
const readline = require('readline');
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model

mongoose.connect('mongodb+srv://priceTracker:qatJoh-zukrys-medby8@cluster0.xk28e.mongodb.net/priceTracker', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const ProductSchema = new Schema({
    url: String,
    name: String,
    asin: String,
    prices: [{
        timestamp: Number,
        value: Number,
    }],
})

const Product = new Model('Product', ProductSchema);

const userInput = (question) => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};





(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  process.on('SIGINT', async function () {
    await browser.close();
    process.exit();
  });


  while (true) {
    const url = await userInput('URL: ');
    let pageUrl;

    try {
      pageUrl = new URL(url);

      if(!pageUrl.host.match(/(.*\.)?amazon\.\w/)) {
        console.log('Incorrect url (expecting an amazon one)');
        continue;
      }
    } catch (e) {
      console.log('Incorrect url (expecting an amazon one)');
      continue;
    }

    await page.goto(url);

    const asin = (await page.$eval('[name=ASIN]', el => el.value))
          name = (await page.$eval('#productTitle', el => el.textContent)).replace(/\n/g, '')
          price = (await page.$eval('#priceblock_ourprice', el => el.textContent));

    console.log(price);
    const knownProduct = await Product.exists({asin});

    if(!knownProduct) {
      const product = await (new Product({
        asin,
        name,
        url
      })).save();
      console.log(`Product "${name}" added.`);
    }
  }

})();