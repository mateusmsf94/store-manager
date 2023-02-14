const { expect } = require('chai');
const sinon = require('sinon')
const { productsModel } = require('../../../src/models')

const connection = require('../../../src/models/connection')
const { products } = require('./mocks/products.model.mock')

describe('Testes de unidade do model de produtos', function () {
  it('Recuperando a lista produtos', async function () {
    // Arrange
    sinon.stub(connection, 'execute').resolves([products]);
    // Act
    const result = await productsModel.findAll();
    // Assert
    expect(result).to.be.deep.equal(products);
  })

  it('Recuperando um produto a partir do id', async function () {
    //Arrange
    sinon.stub(connection, 'execute').resolves([[products[0]]])
    //Act
    const result = await productsModel.findById(1);
    //Assert
    expect(result).to.be.deep.equal(products[0])
  })

  afterEach(function () {
    sinon.restore();
  })
})