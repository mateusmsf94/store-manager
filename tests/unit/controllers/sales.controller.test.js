const { expect } = require("chai");
const sinon = require("sinon");
const salesService = require("../../../src/services/sales.service");
const {
  createSale,
  getSaleById,
  getSales,
} = require("../../../src/controllers/sales.controller");
const chai = require("chai");

describe("Sales controller", () => {
  describe("createSale", () => {
    let req, res, addSaleStub;

    beforeEach(() => {
      req = { body: [] };
      res = {
        status: sinon.stub().returns({
          json: sinon.stub(),
        }),
      };
      addSaleStub = sinon.stub(salesService, "addSale");
    });

    afterEach(() => {
      addSaleStub.restore();
    });

    it("should create a new sale", async () => {
      const newSale = { id: 1, itemsSold: [] };
      addSaleStub.resolves(newSale);

      await createSale(req, res);

      expect(res.status.calledOnceWith(201)).to.be.true;
      expect(res.status().json.calledOnceWith(newSale)).to.be.true;
    });

    it("should return a 404 error if the product ID is not found", async () => {
      const error = new Error("Product not found");
      error.name = "ProductIdRequired";
      addSaleStub.rejects(error);

      await createSale(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.status().json.calledOnceWith({ message: error.message })).to.be
        .true;
    });

    it("should return a 422 error if the quantity is not provided", async () => {
      const error = new Error("Quantity is required");
      error.name = "QuantityRequired";
      addSaleStub.rejects(error);

      await createSale(req, res);

      expect(res.status.calledOnceWith(422)).to.be.true;
      expect(res.status().json.calledOnceWith({ message: error.message })).to.be
        .true;
    });
  });

  describe("getSaleById", async () => {
    it("should return a 200 status code and a sale object if the sale exists", async () => {
      const req = { params: { id: 1 } };
      const res = {
        status: sinon.stub().returns({
          json: sinon.stub(),
        }),
      };

      const getSaleByIdStub = sinon
        .stub(salesService, "getSaleById")
        .resolves({ id: 1, itemsSold: [] });

      await getSaleById(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith({ id: 1, itemsSold: [] })).to.be
        .true;
      sinon.assert.calledWith(getSaleByIdStub, 1);

      getSaleByIdStub.restore();
    });

    it("should return a 404 status code if the sale does not exist", async () => {
      const error = new Error("Sale not found");
      error.name = "SaleNotFound";
      const req = { params: { id: 999 } };
      const res = {
        status: sinon.stub().returns({
          json: sinon.stub(),
        }),
      };

      const getSaleByIdStub = sinon
        .stub(salesService, "getSaleById")
        .rejects(error);

      await getSaleById(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.status().json.calledOnceWith({ message: error.message })).to.be
        .true;
      sinon.assert.calledWith(getSaleByIdStub, 999);

      getSaleByIdStub.restore();
    });
  });

  describe("getSales", () => {
    const req = {};
    const res = {
      status: sinon.stub().returns({
        json: sinon.stub(),
      }),
    };

    it("should return a 200 status code and an array of sales", async () => {
      const getSalesStub = sinon
        .stub(salesService, "getSales")
        .resolves([{ id: 1, itemsSold: [] }]);

      await getSales(req, res);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.status().json.calledOnceWith([{ id: 1, itemsSold: [] }])).to.be
        .true;
      sinon.assert.calledOnce(getSalesStub);

      getSalesStub.restore();
    });

    it("should return a 404 status code if there are no sales", async () => {
      const error = new Error("Sales not found");
      error.name = "SalesNotFound";
      const getSalesStub = sinon.stub(salesService, "getSales").rejects(error);
      const req = {};
      const res = {
        status: sinon.stub().returns({
          json: sinon.stub(),
        }),
      };

      await getSales(req, res);

      expect(res.status.calledOnceWith(404)).to.be.true;
      expect(res.status().json.calledOnceWith({ message: error.message })).to.be
        .true;
      sinon.assert.calledOnce(getSalesStub);

      getSalesStub.restore();
    });
  });
});
