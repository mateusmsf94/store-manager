const connection = require('./connection');

const findAll = async () => {
  const [result] = await connection.execute(
    'SELECT * FROM products ORDER BY id ASC;',
  );  
  return result;
};

const findById = async (id) => {
  const [[result]] = await connection.execute(
    'SELECT * FROM products WHERE id=?',
    [id],
  );  
  return result;
};

const createProduct = async (product) => {
  const { name } = product;
  const [result] = await connection.execute(
    'INSERT INTO products (name) VALUES (?);',
    [name],
  );
  return { id: result.insertId, name };
};

module.exports = { findAll, findById, createProduct };
