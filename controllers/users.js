const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const User = require("../models/users");
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
};

exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.remove = (req, res) => {
    let user = req.body.user;
    User.deleteOne({_id:user},
        (err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "user deleted successfully"
        });
    });
};



exports.update = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        { $set: req.body},
        { new: true},
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "You are not authorized to perform this action"
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    );
};

exports.addBookingToUserHistory = (req, res, next) => {
    let history = []; 
    
        history.push({
            rooms: req.rooms._id,
            rooms_name: req.rooms.name,
            rooms_price: req.rooms.price,
            rooms_date: Date()
        });
          
        User.findOneAndUpdate(
            { _id: req.body.user },   
            { $push: { history: history } },
            { new: true },
            (error, data) => {
                if (error) {
                    return res.status(400).json({
                        error: "Could not update user bookings history"
                    });
                }             
                next();
            }
        );   
};

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    User.find()
        
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, rooms) => {
            if (err) {
                return res.status(400).json({
                    error: "user not found"
                });
            }
            res.json(rooms);
        });
};


exports.listHistory = (req,res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;

    User.find({_id : req.profile._id})
    .populate("history.booking","_id name")
    .sort([[sortBy, order]])
    .limit(limit)
   
    .exec((err, rooms) => {
        if (err) {
            return res.status(400).json({
                error: "user not found"
            });
        }
        res.json(rooms[0].history);
    });
};

