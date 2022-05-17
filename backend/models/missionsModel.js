const mongoose = require("mongoose");

const MissionsModel = mongoose.model(
  "missions",
  {
    // id: {
    //   type: Int,
    //   required: true
    // },
    country: {
      type: String,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    rovers: {
      type: String,
      required: true
    }
  }
);

module.exports = { MissionsModel };