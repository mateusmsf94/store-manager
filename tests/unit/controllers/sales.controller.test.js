const { expect } = require('chai');
const sinon = require('sinon');
const salesService = require('../../../src/services/sales.service');
const { createSale } = require('../../../src/controllers/sales.controller');

describe('Sales controller', () => {
  describe('createSale', () => {
    let req, res, addSaleStub;

    beforeEach(() => {
      req = { body: [] };
      res = {
        status: sinon.stub().returns({
          json: sinon.stub(),
        }),
      };
      addSaleStub = sinon.stub(salesService, 'addSale');
    });

    afterEach(() => {
      addSaleStub.restore();
    });

    it('should create a new sale', async () => {
      const newSale = { id: 1, itemsSold: [] };
      addSaleStub.resolves(newSale);

      await createSale(req, res);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.status().json.calledOnceWith(newSale)).to.be.true;
    });

    it('should return a 404 error if the product ID is not found', async () => {
      const error = new Error('Product not found');
      error.name = 'ProductIdRequired';
      addSaleStub.rejects(error);

      await createSale(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.status().json.calledOnceWith({ message: error.message })).to.be.true;
    });

    it('should return a 422 error if the quantity is not provided', async () => {
      const error = new Error('Quantity is required');
      error.name = 'QuantityRequired';
      addSaleStub.rejects(error);

      await createSale(req, res);

      expect(res.status.calledOnceWith(422)).to.be.true;
      expect(res.status().json.calledOnceWith({ message: error.message })).to.be.true;
    });
  });
});
