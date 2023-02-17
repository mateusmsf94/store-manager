const connection = require('./connection');

const createId = async () => {
  const [{ insertId }] = await connection.execute(
    'INSERT INTO sales (date) VALUES (NOW())',
  );
  return insertId;
};

const createSale = async (id, sales) => {
  sales.forEach((sale) => {
    connection.execute(
      'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)',
      [id, sale.productId, sale.quantity],
    );
  });

  return { id, itemsSold: sales };
};

const findAllIds = async () => {
  const [result] = await connection.execute(
    'SELECT id FROM sales',
  );
  return result.map((row) => row.id);
};

module.exports = { createId, createSale, findAllIds };
