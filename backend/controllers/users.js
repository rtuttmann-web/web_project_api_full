const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('../utils/errors');

const throwUserNotFound = () => {
  const error = new Error('ID de usuário não encontrado');
  error.statusCode = NOT_FOUND;
  throw error;
};

const handleUserError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).send({ message: 'Dados inválidos para o usuário' });
  }
  if (err.name === 'CastError') {
    return res.status(BAD_REQUEST).send({ message: 'ID de usuário inválido' });
  }
  if (err.statusCode === NOT_FOUND) {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleUserError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => handleUserError(err, res));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, res));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id: userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, res));
};
