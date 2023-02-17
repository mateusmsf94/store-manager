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

module.exports = { createSale };
