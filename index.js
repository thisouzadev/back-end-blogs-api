const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/route');
const err = require('./src/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.use(err);

app.listen(3000, () => console.log('ouvindo porta 3000!'));
// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});
module.exports = app;