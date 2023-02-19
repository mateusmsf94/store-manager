const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../src/models/connection');
const { createId, createSale, findSales } = require('../../../src/models/sales.model');

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

  describe('findSales', () => {
    it('should return all sales from the database', async () => {
      const expectedSales = [
        { sale_id: 1, date: '2022-01-01', product_id: 1, quantity: 10 },
        { sale_id: 1, date: '2022-01-01', product_id: 2, quantity: 5 },
        { sale_id: 2, date: '2022-01-02', product_id: 3, quantity: 8 },
      ];

      const executeStub = sinon.stub(connection, 'execute');
      executeStub.resolves([expectedSales]);

      const actualSales = await findSales();

      expect(actualSales).to.deep.equal(expectedSales);

      executeStub.restore();
    });

  }); 
});
