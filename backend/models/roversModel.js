const mongoose = require("mongoose");

const RoversModel = mongoose.model(
  "rovers",
  {
    // id: {
    //   type: Int,
    //   required: true
    // },
    name: {
      type: String,
      required: true
    },
    launch_date: {
      type: Date,
      required: true
    },
    construction_date: {
      type: Date,
      required: true
    },
    rover_constructor: {
        type: String,
        required: true
    },
    image: {
      type: String,
      required: true
    }
  }
);

module.exports = { RoversModel };