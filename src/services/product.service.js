const { productModel } = require('../models');

const addProduct = async (product) => {
  const { name } = product;

  if (!name) {
    const error = new Error('"name" is required');
    error.name = 'NameRequired';
    throw error;
  }

  if (name.length < 5) {
    const error = new Error('"name" length must be at least 5 characters long');
    error.name = 'MinLength';
    throw error;
  }

  const productId = await productModel.createProduct(product);
  console.log(productId);
  return productId;
};

const listProducts = async () => {
  const products = await productModel.findAll();
  return products;
};

const updateProduct = async (id, { name }) => {
  const productIds = await productModel.findAll();
  const ids = productIds.map((product) => product.id);
  if (!ids.includes(Number(id))) {
    const error = new Error();
    error.name = 'ProductNotFound';
    error.message = 'Product not found';
    throw error;
  }

  const updatedProduct = await productModel.updateProduct(id, { name });
  return updatedProduct;
};

module.exports = { addProduct, listProducts, updateProduct };
