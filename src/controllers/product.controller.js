const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const newProductName = req.body;
    const newProduct = await productService.addProduct(newProductName);
    res.status(201).json(newProduct);
  } catch (err) {
    if (err.name === 'NameRequired') {
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
    res.status(500).send('Error retrieving products from database');
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedProduct = await productService.updateProduct(id, { name });
    res.json(updatedProduct);
  } catch (err) {
    if (err.name === 'ProductNotFound') {
      return res.status(404).json({ message: err.message });
    }
  }
};

module.exports = { createProduct, listProducts, updateProduct };
