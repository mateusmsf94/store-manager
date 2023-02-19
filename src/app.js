const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const { quantityCheck,
  quantityIsPositive, productIdCheck } = require('./middlewares/sales.validations');
const salesController = require('./controllers/sales.controller');
const productController = require('./controllers/product.controller');
const { productModel } = require('./models');
const { nameCheck, minLength } = require('./middlewares/product.validations');

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.get('/products', productController.listProducts);

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  } 
  res.send(product);
});

app.put('/products/:id', nameCheck, minLength, productController.updateProduct);

app.post('/products', productController.createProduct);

app.get('/sales', salesController.getSales);

app.get('/sales/:id', salesController.getSaleById);

app.post('/sales', productIdCheck, quantityCheck, quantityIsPositive, salesController.createSale);
// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app;
