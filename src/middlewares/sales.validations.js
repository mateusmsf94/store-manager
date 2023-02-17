const quantityCheck = (req, res, next) => {
  const sales = req.body;
  if (sales.every((obj) => !Object.prototype.hasOwnProperty.call(obj, 'quantity'))) {
    return res.status(400).json({ message: '"quantity" is required' });
  }
  return next();
};

const productIdCheck = (req, res, next) => {
  const sales = req.body;
  console.log(sales);
  if (sales.every((obj) => !Object.prototype.hasOwnProperty.call(obj, 'productId'))) {
    return res.status(400).json({ message: '"productId" is required' });
  }
  return next();
};

const quantityIsPositive = (req, res, next) => {
  const sales = req.body;
  if (sales.some((sale) => sale.quantity <= 0)) {
    return res.status(422).json({ message: '"quantity" must be greater than or equal to 1' });
  }
  return next();
};

module.exports = {
  quantityCheck,
  productIdCheck,
  quantityIsPositive,
};