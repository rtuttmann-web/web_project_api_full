const jwt = require('jsonwebtoken');
const { UNAUTHORIZED } = require('../utils/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

const handleAuthError = (res) => res
  .status(UNAUTHORIZED)
  .send({ message: 'Autorização necessária' });

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
};
