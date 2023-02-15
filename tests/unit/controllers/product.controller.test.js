const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const {
  createProduct,
  listProducts,
} = require("../../../src/controllers/product.controller");
const productService = require("../../../src/services/product.service");

const { expect } = chai;
chai.use(sinonChai);

describe("Product Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("deve retornar status 201 e novo produto quando o nome for válido", async () => {
    const newProduct = { name: "Test Product" };
    const insertedProduct = { id: 1, name: "Test Product" };
    const req = { body: newProduct };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returns(insertedProduct),
    };
    sinon.stub(productService, "addProduct").resolves(insertedProduct);

    await createProduct(req, res);

    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith(insertedProduct);
  });

  it("deve retornar 400 status e mensagem de erro quando o nome está faltando", async () => {
    const newProduct = { name: "" };
    const req = { body: newProduct };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returns({ message: '"name" is required' }),
    };

    try {
      await createProduct(req, res);
    } catch (err) {
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({
        message: '"name" is required',
      });
    }
  });

  it("deve retornar status 422 e mensagem de erro quando o comprimento do nome for menor que 5", async () => {
    const newProduct = { name: "test" };
    const req = { body: newProduct };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon
        .stub()
        .returns({
          message: '"name" length must be at least 5 characters long',
        }),
    };

    try {
      await createProduct(req, res);
    } catch (err) {
      expect(err.name).to.be.equal('MinLength')
      expect(res.status).to.have.been.calledWith(422);
      expect(res.json).to.have.been.calledWith({
        message: '"name" length must be at least 5 characters long',
      });
    }
  });
  it("deve devolver todos os produtos", async () => {
    const products = [{ id: 1, name: "Test Product" }];
    const req = {};
    const res = {
      json: sinon.stub().returns(products),
    };
    sinon.stub(productService, "listProducts").resolves(products);

    await listProducts(req, res);

    expect(res.json).to.have.been.calledWith(products);
  });

  it("deve retornar 500 status e mensagem de erro quando falha ao recuperar produtos do banco de dados", async () => {
    const req = {};
    const res = {
      json: sinon.stub().returnsThis(),
      status: sinon.stub().returnsThis(),
      send: sinon.stub().returns("Error retrieving products from database"),
    };
    sinon
      .stub(productService, "listProducts")
      .rejects(new Error("Database Error"));

    try {
      await listProducts(req, res);
    } catch (err) {
      expect(res.status).to.have.been.calledWith(500);
      expect(res.send).to.have.been.calledWith(
        "Error retrieving products from database"
      );
    }
  });
});
