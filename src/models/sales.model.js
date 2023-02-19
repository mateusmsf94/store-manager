const camelize = require('camelize');
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
    'SELECT id FROM products',
  );
  console.log(result);
  const ids = result.map((row) => row.id);
  console.log(ids);
  return ids;
};

const findSales = async () => {
  const [allSales] = await connection.execute(
    `SELECT sales_products.sale_id,
      sales.date,
      sales_products.product_id,
      sales_products.quantity
    FROM sales_products
    JOIN sales
    ON sales_products.sale_id = sales.id
    ORDER BY
      sale_id ASC,
      product_id ASC`,
  );

  return camelize(allSales);
};

const findSaleById = async (id) => {
  const [sale] = await connection.execute(
    `SELECT sales_products.sale_id,
      sales.date,
      sales_products.product_id,
      sales_products.quantity
    FROM sales_products
    JOIN sales
    ON sales_products.sale_id = sales.id
    WHERE sales_products.sale_id = ?
    ORDER BY
      sale_id ASC,
      product_id ASC`,
    [id],
  );

  return camelize(sale);
};

module.exports = { createId, createSale, findAllIds, findSales, findSaleById };
