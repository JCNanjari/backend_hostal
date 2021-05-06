const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      require: true,
    },

    name: {
      type: String,
      trim: true,
      require: true,
      maxlength: 32,
    },
    run: {
      type: Number,
      require: true,
    },
    temperature: {
      type: Number,
      require: true,
    },
    place_of_origin: {
      type: String,
      trim: true,
      require: true,
    },
    phonenumber: {
      type: Number,
      require: true,
    },
    Direccion: {
      type: String,
      trim: true,
      require: true,
    },
    patent: {
      type: String,
      
    },
    about: {
      type: String,
      trim: true,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("guest", userSchema);
