const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Passenger  = require("../models/passenger");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.passengerById = (req, res, next, id) => {
    Passenger.findById(id).exec((err, passenger) => {
        if (err || !passenger) {
            return res.status(400).json({
                error: "Passenger not found"
            });
        }
        req.passenger = passenger;
        next();
    });
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        // check for all fields
        const {
            rooms,
            booking,
            guest
        } = fields;

        if (
            !rooms ||
            !booking ||
            !guest       
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }
        let passenger = new Passenger(fields);
        passenger.date_checkin = Date();       
        passenger.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
       
};


exports.updatecheckout = (req,res)=>{

    Passenger.findOneAndUpdate(
        {_id: req.passenger._id},
        { $set: {date_checkout: Date() }},
        { new: true},
        (err, passenger) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to perform this action"
                });
            }
           
            res.json(passenger);
        }
    );

};
exports.listpassenger = (req, res) =>{
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    let status = req.query.status ?  req.query.status: null;
     
         Passenger.find({date_checkout:status})
         .populate ("user", "name run dv phonenumber")
         .populate("rooms","name description")
         .populate("booking", "amount status")          
         .sort([[sortBy, order]])
         .limit(limit)
         .exec((err, passenger) => {
            if (err) {
                return res.status(400).json({
                    error: "guest no found"
                });
            }
            res.json(passenger);
            
        });
};



