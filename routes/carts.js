const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// receive a POST request to add item to a cart
router.post('/cart/products', async (req,res) => {
    // figure out the cart
    let cart;
    if (!req.session.cartId) {
        // we don't have a cart we need create one,
        // and store the cart in on the req.session.cartId
        // property
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // we have a cart. Let's get it from repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if (existingItem) {
        // increment quantity for existing product
        existingItem.quantity++;
    } else {
        // add new product to the items array
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }
    await cartsRepo.update(cart.id, {
        items: cart.items
    });
    
    res.redirect('/cart');
});

// receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
    if(!req.session.cartId) {
        return res.redirect('/');
    }
    const cart = await cartsRepo.getOne(req.session.cartId);
    for(let item of cart.items) {
        const product = await productsRepo.getOne(item.id);
        item.product = product;
    }

    res.send(cartShowTemplate({ items: cart.items }));

});
// receive a POST request to delete an item from a cart
router.post('/cart/products/delete', async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);
    const items = cart.items.filter(item => item.id !== itemId);
    await cartsRepo.update(req.session.cartId, { items });
    res.redirect('/cart');
});

module.exports = router;