const express = require('express');

const app = express();

const {productsModel} = require('./models')

// não remova esse endpoint, é para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.get('/products', async (req, res) => {
  const allProducts = await productsModel.findAll()
  res.send(allProducts)
})

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = await productsModel.findById(id)
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  } 
  res.send(product)
})
// não remova essa exportação, é para o avaliador funcionar
// você pode registrar suas rotas normalmente, como o exemplo acima
// você deve usar o arquivo index.js para executar sua aplicação 
module.exports = app
