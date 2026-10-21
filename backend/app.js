const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NOT_FOUND } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

const allowedOrigins = [
  'https://around-rtuttmann.networkoutpost.com',
  'https://www.around-rtuttmann.networkoutpost.com',
  'http://localhost:5173',
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// rotas públicas
app.post('/signup', createUser);
app.post('/signin', login);

// daqui para baixo, tudo exige token
app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Recurso requisitado não encontrado' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
