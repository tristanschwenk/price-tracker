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
    prices: [{
        timestamp: Number,
        value: Number,
    }],
})

const Product = new Model('Product', ProductSchema);

Product.find().then((products) => {
    const product = products[0]
    product.prices.push({
        timestamp : Date.now(),
        value : 1500,
        random : 'bload'
    })

    product.save()
})

