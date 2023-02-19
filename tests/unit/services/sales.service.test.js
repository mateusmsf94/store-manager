const { expect } = require('chai');
const sinon = require('sinon');
const { addSale, getSales } = require('../../../src/services/sales.service');
const { salesModel } = require('../../../src/models');


describe('addSale function', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should add sale when products are valid', async () => {
    const sales = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 }
    ];
    const findAllIdsStub = sinon.stub(salesModel, 'findAllIds').resolves([1, 2]);
    const createIdStub = sinon.stub(salesModel, 'createId').resolves(1);
    const createSaleStub = sinon.stub(salesModel, 'createSale').resolves({ id: 1, itemsSold: sales });

    const result = await addSale(sales);

    expect(findAllIdsStub.calledOnce).to.be.true;
    expect(createIdStub.calledOnce).to.be.true;
    expect(createSaleStub.calledOnceWithExactly(1, sales)).to.be.true;
    expect(result).to.deep.equal({ id: 1, itemsSold: sales });
  });

  it('should throw error when product is not found', async () => {
    const sales = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
      { productId: 3, quantity: 1 }
    ];
    const findAllIdsStub = sinon.stub(salesModel, 'findAllIds').resolves([1, 2]);
    const createIdStub = sinon.stub(salesModel, 'createId').resolves(1);
    const createSaleStub = sinon.stub(salesModel, 'createSale').resolves({ id: 1, itemsSold: sales });

    try {
      await addSale(sales);
      expect.fail('Expected addSale to throw error');
    } catch (error) {
      expect(error.name).to.equal('ProductIdRequired');
      expect(error.message).to.equal('Product not found');
      expect(findAllIdsStub.calledOnce).to.be.true;
      expect(createIdStub.called).to.be.false;
      expect(createSaleStub.called).to.be.false;
    }
  });

  describe('getSales', () => {
  it('should return the sales retrieved from the salesModel', async () => {
    const expectedSales = [
      { sale_id: 1, date: '2022-01-01', product_id: 1, quantity: 10 },
      { sale_id: 1, date: '2022-01-01', product_id: 2, quantity: 5 },
      { sale_id: 2, date: '2022-01-02', product_id: 3, quantity: 8 },
    ];

    const findSalesStub = sinon.stub(salesModel, 'findSales');
    findSalesStub.resolves(expectedSales);

    const actualSales = await getSales();

    expect(actualSales).to.deep.equal(expectedSales);

    findSalesStub.restore();
  });

  it('should throw an error if an error occurs while retrieving sales from the salesModel', async () => {
    const expectedError = new Error('Could not retrieve sales from the salesModel');
    
    const findSalesStub = sinon.stub(salesModel, 'findSales');
    findSalesStub.rejects(expectedError);

    try {
      await getSales();
      expect.fail('Expected error to be thrown');
    } catch (err) {
      expect(err).to.equal(expectedError);
    }

    findSalesStub.restore();
    });
  });
  
});
