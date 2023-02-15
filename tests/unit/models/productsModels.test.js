const { expect } = require('chai');
const sinon = require('sinon')
const { productModel } = require('../../../src/models')

const connection = require('../../../src/models/connection')
const { products } = require('./mocks/products.model.mock')

describe('Testes de unidade do model de produtos', function () {
  it('Recuperando a lista produtos', async function () {
    // Arrange
    sinon.stub(connection, 'execute').resolves([products]);
    // Act
    const result = await productModel.findAll();
    // Assert
    expect(result).to.be.deep.equal(products);
  })

  it('Recuperando um produto a partir do id', async function () {
    //Arrange
    sinon.stub(connection, 'execute').resolves([[products[0]]])
    //Act
    const result = await productModel.findById(1);
    //Assert
    expect(result).to.be.deep.equal(products[0])
  })

  it('cadastrando um novo produto', async () => {
    const insertedId = 1;
    const insertedName = 'Test Product';

    sinon.stub(connection, 'execute').resolves([{ insertId: insertedId }]);
    
    const product = { name: insertedName };
    const result = await productModel.createProduct(product);
    
    expect(result).to.be.an('object');
    expect(result).to.deep.equal({ id: insertedId, name: insertedName });
  });

  afterEach(function () {
    sinon.restore();
  })
})