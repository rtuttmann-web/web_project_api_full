const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('../utils/errors');

const throwCardNotFound = () => {
  const error = new Error('Cartão não encontrado');
  error.statusCode = NOT_FOUND;
  throw error;
};

const handleCardError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).send({ message: 'Dados inválidos para o cartão' });
  }
  if (err.name === 'CastError') {
    return res.status(BAD_REQUEST).send({ message: 'ID de cartão inválido' });
  }
  if (err.statusCode === NOT_FOUND) {
    return res.status(NOT_FOUND).send({ message: err.message });
  }
  return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleCardError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleCardError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(throwCardNotFound)
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, res));
};

module.exports.likeCard = (req, res) => {
  const { _id: userId } = req.user;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(throwCardNotFound)
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  const { _id: userId } = req.user;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(throwCardNotFound)
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, res));
};
