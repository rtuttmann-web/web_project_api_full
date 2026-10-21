const Card = require('../models/card');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../utils/errors');

const throwCardNotFound = () => {
  throw new NotFoundError('Cartão não encontrado');
};

const handleCardError = (err, next) => {
  if (err.name === 'ValidationError') {
    return next(new BadRequestError('Dados inválidos para o cartão'));
  }
  if (err.name === 'CastError') {
    return next(new BadRequestError('ID de cartão inválido'));
  }
  return next(err);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: -1 })
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleCardError(err, next));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(throwCardNotFound)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Você não pode excluir o cartão de outro usuário');
      }
      return card.deleteOne().then(() => res.send(card));
    })
    .catch((err) => handleCardError(err, next));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(throwCardNotFound)
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, next));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(throwCardNotFound)
    .then((card) => res.send(card))
    .catch((err) => handleCardError(err, next));
};
