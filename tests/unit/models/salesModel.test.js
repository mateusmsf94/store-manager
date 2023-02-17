const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../src/models/connection');
const { createId, createSale, findAllIds } = require('../../../src/models/sales.model');

describe('Sales module', () => {
  describe('createId', () => {
    it('should insert a row in the sales table and return the insert ID', async () => {
      const stub = sinon.stub(connection, 'execute').resolves([{ insertId: 1 }]);
      const id = await createId();
      expect(id).to.equal(1);
      stub.restore();
    });
  });

  describe('createSale', () => {
    it('should insert rows in the sales_products table and return the sale object', async () => {
      const stub = sinon.stub(connection, 'execute').resolves({});
      const id = 1;
      const sales = [        { productId: 1, quantity: 2 },        { productId: 2, quantity: 3 },      ];
      const result = await createSale(id, sales);
      expect(result).to.deep.equal({ id, itemsSold: sales });
      expect(stub.calledTwice).to.be.true;
      expect(stub.getCall(0).args[0]).to.equal(
        'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)'
      );
      expect(stub.getCall(0).args[1]).to.deep.equal([id, sales[0].productId, sales[0].quantity]);
      expect(stub.getCall(1).args[0]).to.equal(
        'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)'
      );
      expect(stub.getCall(1).args[1]).to.deep.equal([id, sales[1].productId, sales[1].quantity]);
      stub.restore();
    });
  });

  describe('findAllIds', () => {
    it('should return an array of IDs of all sales in the sales table', async () => {
      const stub = sinon.stub(connection, 'execute').resolves([{ id: 1 }, { id: 2 }]);
      const ids = await findAllIds();
      expect(ids).to.deep.equal([1, 2]);
      stub.restore();
    });
  });
});
