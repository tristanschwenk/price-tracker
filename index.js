const puppeteer = require('puppeteer')
const fs = require('fs')

//Get local data 
let rawData = fs.readFileSync('data.json')
let data = JSON.parse(rawData)

console.log(data);

//Amazon request
const pageLink = "https://www.amazon.fr/Sony-WH-1000XM3-Casque-Bluetooth-r%C3%A9duction/dp/B07GDR2LYK?ref_=Oct_s9_apbd_otopr_hd_bw_bkDYQ3&pf_rd_r=YT8QYKNT5J98X5XPH5EM&pf_rd_p=94fc4d5f-c67e-5e77-915a-068d1cdec7a2&pf_rd_s=merchandised-search-10&pf_rd_t=BROWSE&pf_rd_i=682942031";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageLink);
    const productTitle = (await page.$eval('#productTitle', el => el.textContent)).replace(/\n/g, '')
    console.log(productTitle)

    const priceBlock = await page.$eval('#priceblock_ourprice', el => el.textContent)
    console.log(priceBlock);
    await browser.close();


    //Create Product object
    const product = {
      name : productTitle,
      prices : [
        {
          timestamp : new Date (Date.now()).toISOString(),
          price : priceBlock
        }
      ],
      link : pageLink
    }

    //Check if new product or update data
    let hadToPush = true
    data.map(function(el, i) {
      if(el.name == product.name) {
        data[i].prices.push(product.prices[0]);
        hadToPush = false
      }
    })

    if (hadToPush) {
      data.push(product)  
    }
    console.log(data);
    const dataString = JSON.stringify(data)
    fs.writeFileSync('data.json', dataString)
  })();
