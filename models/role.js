const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const passengerSchema = new mongoose.Schema(
    {
      
        id_user: {type:ObjectId,ref:"Users"},
       
        name: {
            type: String,
            required: true,
            maxlength: 32
        }
    },  
    { timestamps: true} 
);

module.exports = mongoose.model("Role", passengerSchema);
