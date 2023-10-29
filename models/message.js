const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  message: String,
  status: {
    type: String,
    enum: ['new', 'pending', 'contacted'],
    default: 'new'
  }
});

module.exports = mongoose.model('Message', messageSchema);
