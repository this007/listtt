// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   problemList: [
//     {
//       number: {
//         type: String,
//         required: true,
//       },
//       problem: {
//         type: String,
//         required: true,
//       },
//       problemLink: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
const mongoose = require('mongoose');
const Problem = require('./Problem');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  problemList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
