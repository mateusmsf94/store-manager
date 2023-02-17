const chai = require('chai');
const sinon = require('sinon');
const { addProduct, listProducts } = require('../../../src/services/product.service');
const { productModel } = require('../../../src/models');

const expect = chai.expect;

describe('addProduct', () => {
  it('deve lançar um erro se o nome não for fornecido', async () => {
    const product = {};

    try {
      await addProduct(product);
    } catch (error) {
      expect(error.name).to.equal('NameRequired');
      expect(error.message).to.equal('"name" is required');
    }
  });

  it('deve gerar um erro se o nome tiver menos de 5 caracteres', async () => {
    const product = { name: 'test' };

    try {
      await addProduct(product);
    } catch (error) {
      expect(error.name).to.equal('MinLength');
      expect(error.message).to.equal('"name" length must be at least 5 characters long');
    }
  });

  it('deve inserir um novo produto e retornar o ID do produto', async () => {
    const insertedId = 1;
    const product = { name: 'Test Product' };

    const stub = sinon.stub(productModel, 'createProduct').resolves(insertedId);

    const result = await addProduct(product);

    expect(stub.calledOnce).to.be.true;
    expect(result).to.equal(insertedId);

    stub.restore();
  });
    
    it('deve retornar uma lista de produtos', async () => {
    const expectedProducts = [
      { id: 1, name: 'Product A' },
      { id: 2, name: 'Product B' },
    ];

    sinon.stub(productModel, 'findAll').resolves(expectedProducts);

    const result = await listProducts();

    expect(result).to.be.an('array');
    expect(result).to.deep.equal(expectedProducts);
  });
});
