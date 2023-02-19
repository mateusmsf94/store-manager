const { expect } = require("chai");
const sinon = require("sinon");
const { addSale, getSales, getSaleById } = require("../../../src/services/sales.service");
const { salesModel } = require("../../../src/models");

describe("addSale function", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should add sale when products are valid", async () => {
    const sales = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
    ];
    const findAllIdsStub = sinon
      .stub(salesModel, "findAllIds")
      .resolves([1, 2]);
    const createIdStub = sinon.stub(salesModel, "createId").resolves(1);
    const createSaleStub = sinon
      .stub(salesModel, "createSale")
      .resolves({ id: 1, itemsSold: sales });

    const result = await addSale(sales);

    expect(findAllIdsStub.calledOnce).to.be.true;
    expect(createIdStub.calledOnce).to.be.true;
    expect(createSaleStub.calledOnceWithExactly(1, sales)).to.be.true;
    expect(result).to.deep.equal({ id: 1, itemsSold: sales });
  });

  it("should throw error when product is not found", async () => {
    const sales = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 3 },
      { productId: 3, quantity: 1 },
    ];
    const findAllIdsStub = sinon
      .stub(salesModel, "findAllIds")
      .resolves([1, 2]);
    const createIdStub = sinon.stub(salesModel, "createId").resolves(1);
    const createSaleStub = sinon
      .stub(salesModel, "createSale")
      .resolves({ id: 1, itemsSold: sales });

    try {
      await addSale(sales);
      expect.fail("Expected addSale to throw error");
    } catch (error) {
      expect(error.name).to.equal("ProductIdRequired");
      expect(error.message).to.equal("Product not found");
      expect(findAllIdsStub.calledOnce).to.be.true;
      expect(createIdStub.called).to.be.false;
      expect(createSaleStub.called).to.be.false;
    }
  });

  describe("getSales", () => {
    it("should return the sales retrieved from the salesModel", async () => {
      const expectedSales = [
        { sale_id: 1, date: "2022-01-01", product_id: 1, quantity: 10 },
        { sale_id: 1, date: "2022-01-01", product_id: 2, quantity: 5 },
        { sale_id: 2, date: "2022-01-02", product_id: 3, quantity: 8 },
      ];

      const findSalesStub = sinon.stub(salesModel, "findSales");
      findSalesStub.resolves(expectedSales);

      const actualSales = await getSales();

      expect(actualSales).to.deep.equal(expectedSales);

      findSalesStub.restore();
    });

    it("should throw an error if an error occurs while retrieving sales from the salesModel", async () => {
      const expectedError = new Error();
      expectedError.name = "SalesNotFound";
      expectedError.message = "Sales not found";

      const expectedResult = [];

      const findSalesStub = sinon.stub(salesModel, "findSales");
      findSalesStub.resolves(expectedResult);

      try {
        await getSales();
        expect.fail("Sales not found");
      } catch (err) {
        expect(err.message).to.equal(expectedError.message);
      }

      findSalesStub.restore();
    });
  });

  describe("getSaleById", () => {
    it("should return the sale retrieved from the salesModel", async () => {
      const expectedSale = [
        {
          date: "2021-09-09T04:54:29.000Z",
          productId: 1,
          quantity: 2,
        },
        {
          date: "2021-09-09T04:54:54.000Z",
          productId: 2,
          quantity: 2,
        },
      ];

      const findSaleByIdStub = sinon.stub(salesModel, "findSaleById");
      findSaleByIdStub.resolves(expectedSale);

      const actualSale = await getSaleById(1);

      expect(actualSale).to.deep.equal(expectedSale);
      
      findSaleByIdStub.restore();
    });

    it("should throw an error if an error occurs while retrieving sale from the salesModel", async () => {
      const expectedResult = []
      const expectedError = new Error();
      expectedError.name = "SaleNotFound";
      expectedError.message = "Sale not found";

      const findSaleByIdStub = sinon.stub(salesModel, "findSaleById");
      findSaleByIdStub.resolves(expectedResult);

      try {
        await getSaleById(999);
        expect.fail("Expected error to be thrown");
      } catch (err) {
        expect(err.message).to.equal(expectedError.message);
      }

      findSaleByIdStub.restore();

    });

  });
  
});
