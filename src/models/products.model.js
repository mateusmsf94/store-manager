const connection = require('./connection');

const findAll = async () => {
  const [result] = await connection.execute(
    'SELECT * FROM products',
  );
  if (!result.length) {
    return null;
  }
  return result;
};

const findById = async (id) => {
  const [[result]] = await connection.execute(
    'SELECT * FROM products WHERE id=?',
    [id],
  );  
  return result;
};

module.exports = { findAll, findById };
