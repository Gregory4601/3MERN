const mongoose = require("mongoose");

const UsersModel = mongoose.model(
  "users",
  {
    // id: {
    //   type: Int,
    //   required: true
    // },
    email: {
      type: String,
      required: true
    },
    pseudo: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false,
      // required: true
    }
  }
);

module.exports = { UsersModel };