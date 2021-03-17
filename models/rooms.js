const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const roomsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },     
        state: {
            type: String,
            default: "available"
        },       
        photo: {
            data: Buffer,
            contentType: String
        },
        type_bed:{
            type: String,
            default: "single",
            enum: ["fullsize", "single", "double"]
        },
        bath_private:{
            type: Boolean
        }
        
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rooms", roomsSchema);