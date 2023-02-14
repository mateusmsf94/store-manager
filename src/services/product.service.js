const { productModel } = require('../models');

const addProduct = async (product) => {
  const productId = await productModel.createProduct(product);
  console.log(productId);
  return productId;
};

module.exports = { addProduct };
