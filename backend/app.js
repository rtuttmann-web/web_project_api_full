const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6ac3a0ce3f6497fbf7c1d3c6',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Recurso requisitado não encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
