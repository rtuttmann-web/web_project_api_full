const mongoose = require('mongoose');

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[\w\-._~:/?%#[\]@!$&'()*+,;=]*)?#?$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
      message: 'Link de avatar inválido',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
module.exports.urlRegex = urlRegex;
