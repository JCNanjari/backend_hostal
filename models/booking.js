const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const BookingSchema = new mongoose.Schema(
  {
    rooms: {type:ObjectId,ref:"Rooms"},
    amount: { type: Number },
    status: {
      type: String,
      default: "processing",
      enum: ["processing", "paid", "cancelled"]    // enum means string objects
    },
    updated: Date,
    user: { type: ObjectId, ref: "Users" }, 
    metod_payment: {type: String}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);