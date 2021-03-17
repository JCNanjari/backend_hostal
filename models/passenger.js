const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const passengerSchema = new mongoose.Schema(
    {
        rooms: {type:ObjectId,ref:"Rooms"},
        user: {type:ObjectId,ref:"Users"},
        booking: {type:ObjectId,ref:"Booking"},
        date_checkin:{
            type: Date
        },
        date_checkout: {
            type: Date
        }
    },  
    { timestamps: true} 
);

module.exports = mongoose.model("Passenger", passengerSchema);
