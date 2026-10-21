const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const throwUserNotFound = () => {
  throw new NotFoundError('ID de usuário não encontrado');
};

const handleUserError = (err, next) => {
  if (err.code === 11000) {
    return next(new ConflictError('Este e-mail já está cadastrado'));
  }
  if (err.name === 'ValidationError') {
    return next(new BadRequestError('Dados inválidos para o usuário'));
  }
  if (err.name === 'CastError') {
    return next(new BadRequestError('ID de usuário inválido'));
  }
  return next(err);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, next));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
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
    .catch((err) => handleUserError(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('E-mail ou senha incorretos')));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, next));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(throwUserNotFound)
    .then((user) => res.send(user))
    .catch((err) => handleUserError(err, next));
};
