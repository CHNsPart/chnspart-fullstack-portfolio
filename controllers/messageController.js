const Message = require('../models/message');

// Create a new message
const createMessage = async (data) => {
  return await Message.create(data);
};

// Retrieve all messages
const getMessages = async () => {
  return await Message.find();
};

// Update a message by ID
const updateMessage = async (id, data) => {
  return await Message.findByIdAndUpdate(id, data, { new: true });
};

// Delete a message by ID
const deleteMessage = async (id) => {
  return await Message.findByIdAndDelete(id);
};

// Add a getMessageById method to your controller
const getMessageById = async (messageId) => {
  const message = await Message.findById(messageId);
  return message;
};

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
  getMessageById
};
