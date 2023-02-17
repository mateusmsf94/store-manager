const { salesModel } = require('../models');

const saleValidation = async (ids, sales) => {
  sales.forEach((sale) => {
    if (!ids.includes(sale.productId)) {
      const error = new Error();
      error.name = 'ProductIdRequired';
      error.message = 'Product not found';
      throw error;
    }
  });  
};

const addSale = async (sales) => {
  const ids = await salesModel.findAllIds();
  await saleValidation(ids, sales);
  const id = await salesModel.createId();
  const newSale = await salesModel.createSale(id, sales);
  return newSale;
};
module.exports = { addSale };
