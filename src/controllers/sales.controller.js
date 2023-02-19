const salesService = require('../services/sales.service');

const createSale = async (req, res) => {
  try {
    const newSale = await salesService.addSale(req.body);
    res.status(201).json(newSale);
  } catch (err) {
    if (err.name === 'ProductIdRequired') {
      return res.status(404).json({ message: err.message });
    }

    if (err.name === 'QuantityRequired') {
      return res.status(422).json({ message: err.message });
    }
  }
};

const getSales = async (req, res) => {
  try {
    const sales = await salesService.getSales();
    res.status(200).json(sales);
  } catch (error) {
    if (error.name === 'SalesNotFound') {
      return res.status(404).json({ message: error.message });
    }
  }
};

const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await salesService.getSaleById(id);
    console.log(sale);
    
    res.status(200).json(sale);
  } catch (error) {
    if (error.name === 'SaleNotFound') {
      return res.status(404).json({ message: error.message });
    }
  }
};

module.exports = { createSale, getSales, getSaleById };
