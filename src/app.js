const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());

const productController = require('./controllers/product.controller');
const { productModel } = require('./models');

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

app.post('/products', productController.createProduct);
// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app;
