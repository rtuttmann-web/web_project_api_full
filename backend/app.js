require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { isCelebrateError } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateSignup, validateSignin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { NotFoundError } = require('./utils/errors');

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
app.use(requestLogger); // registra cada requisição em request.log

// teste do PM2 — remover depois da revisão
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('O servidor travará agora');
  }, 0);
});

// rotas públicas
app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);

// rotas protegidas: exigem token
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Recurso requisitado não encontrado'));
});

app.use(errorLogger); // registra cada erro em error.log

// tratamento centralizado de erros (inclui os de validação do celebrate)
app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const [details] = err.details.values();
    return res.status(400).send({ message: details.message });
  }

  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message: statusCode === 500 ? 'Ocorreu um erro no servidor' : message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
