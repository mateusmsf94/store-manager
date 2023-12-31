const nameCheck = (req, res, next) => {
  if (!Object.prototype.hasOwnProperty.call(req.body, 'name')) {
    return res.status(400).json({ message: '"name" is required' });
  }
  return next();
};

const minLength = (req, res, next) => {
  const { name } = req.body; 
  if (name.length < 5) {
    return res.status(422).json({ message: '"name" length must be at least 5 characters long' });
  }
  return next();
};

module.exports = { nameCheck, minLength };