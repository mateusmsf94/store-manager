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

const getSales = async () => {
  const sales = await salesModel.findSales();
  if (!sales) {
    const error = new Error();
    error.name = 'SalesNotFound';
    error.message = 'Sale not found';
    throw error;
  }
  return sales;
};

// function to remove saleId property from the array of objects
const removeSaleId = (sales) => {
  const newSales = sales.map((sale) => {
    const { saleId, ...rest } = sale;
    return rest;
  });

  return newSales;
};

const getSaleById = async (id) => {
  const sale = await salesModel.findSaleById(id);
  if (!sale || sale.length === 0) {
    const error = new Error();
    error.name = 'SaleNotFound';
    error.message = 'Sale not found';
    throw error;
  }
  const treatedSale = removeSaleId(sale);
  return treatedSale;
};

module.exports = { addSale, getSales, getSaleById };
