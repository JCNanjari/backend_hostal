const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Booking  = require("../models/booking");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.bookingById = (req, res, next, id) => {
    Booking.findById(id).exec((err, booking) => {
        if (err || !booking) {
            return res.status(400).json({
                error: "Booking not found"
            });
        }
        req.booking = booking;
        next();
    });
};

exports.create = (req, res) => {   
    const booking = new Booking(req.body);   
    booking.save((err, dataBooking) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }      
        res.json(booking); 
    });   
};

exports.listBookingsUser = (req, res) => {
    Booking.find({user: req.profile._id})
        .populate("rooms", "_id name state")
        .sort("-created")
        .exec((err, booking) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
           res.json(booking);
        });
};


exports.listBookingsAllUser = (req, res) => {
    Booking.find()
        .populate("users", "_id name email")
        .sort("-created")
        .exec((err, booking) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(error)
                });
            }
           res.json(booking);
        });
};



exports.getStatusValues = (req, res) => {
    Booking.find({rooms: req.rooms._id})
    .populate("user", "_id name email")
    .sort("-created")
    .exec((err, booking) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
       res.json(booking);
    });
};

exports.updateBookingStatus = (req, res) => {
    Booking.updateOne(
        { _id: req.body.bookingId },
        { $set: { status: req.body.status } },
        (err, booking) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(booking);
        }
    );
};

exports.changeStatePayment = (req, res, next) => {

    Booking.findOneAndUpdate(
        {_id: req.booking._id},
        {status:"paid"},
        {upsert:true},
        (error, statusupdate) => {
            if (error) {
                return res.status(400).json({
                    error: "Could not update booking state"
                });
            }
            if(req.body.result){
               res.json(statusupdate);

            }else{next()}          
                   
        }
    );
}