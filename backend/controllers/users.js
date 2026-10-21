const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const throwUserNotFound = () => {
  const error = new Error('ID de usuário não encontrado');
  error.statusCode = NOT_FOUND;
  throw error;
};

const handleUserError = (err, res) => {
  if (err.code === 11000) {
    return res.status(CONFLICT).send({ message: 'Este e-mail já está cadastrado' });
  }
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

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, res));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!password) {
    return res.status(BAD_REQUEST).send({ message: 'A senha é obrigatória' });
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => handleUserError(err, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
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
