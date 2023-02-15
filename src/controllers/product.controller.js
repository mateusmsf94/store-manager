const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const newProductName = req.body;
    const newProduct = await productService.addProduct(newProductName);
    res.status(201).json(newProduct);
  } catch (err) {
    if (err.name === 'NameRequired') {
      console.log(err.message);
      return res.status(400).json({ message: err.message });
    }

    if (err.name === 'MinLength') {
      return res.status(422).json({ message: err.message });
    }
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productService.listProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving products from database');
  }
};

module.exports = { createProduct, listProducts };
