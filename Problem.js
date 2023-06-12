const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  problemLink: {
    type: String,
    required: true,
  },
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
