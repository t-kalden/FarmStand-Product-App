const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand') 
.then(() => {
    console.log("MONGO CONNECTION OPEN");
})
.catch(err => {
    console.log("MONGO CONNECTION ERROR");
    console.log(err);
})

app.set('views', path.join(__dirname), 'views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetables', 'dairy'];

///route to display all products from mongoDB 
app.get('/products', async (req, res) => {
    const products = await Product.find({});
    res.render('views/products/index.ejs', {products});
})

//route to render form to add new product to mongoDB
app.get('/products/new', (req,res) => {
    res.render('views/products/new.ejs', {categories});
})

//adding NEW product to mongoDB
app.post('/products', async (req,res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
})

//find product by id from mongoDB
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('views/products/show.ejs', {product});
})

//find and edit product  by id in mongo db
app.get('/products/:id/edit', async (req, res) =>{
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('views/products/edit.ejs', {product});
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async(req,res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
})
app.listen(3000, ()=> {
    console.log("APP IS LISTENING ON PORT 3000");
}) 