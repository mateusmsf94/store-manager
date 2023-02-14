const productService = require('../services/product.service');

const createProduct = async (req, res, next) => {
  try {
    const newProductName = req.body;
    const newProduct = await productService.addProduct(newProductName);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct };
