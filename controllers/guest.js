const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Guest = require("../models/guest");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  //console.log("req.body", req.body);
  const guest = new Guest(req.body);
  
  guest.save((err, guest) => {
    
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ guest });
  
  });
};

exports.guestById = (req, res, next, id) => {
  Guest.findById(id).exec((err, guest) => {
    if (err || !guest) {
      return res.status(400).json({
        error: "Guest not found",
      });
    }
    req.profile = guest;
    next();
  });
};


exports.remove = (req, res) => {
  let guest = req.body.guest;
  Guest.deleteOne({ _id: guest }, (err, guest) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "guest deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  Guest.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, guest) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }
      guest.hashed_password = undefined;
      guest.salt = undefined;
      res.json(guest);
    }
  );
};

exports.addBookingToUserHistory = (req, res, next) => {
  let history = [];

  history.push({
    rooms: req.rooms._id,
    rooms_name: req.rooms.name,
    rooms_price: req.rooms.price,
    rooms_date: Date(),
  });

  User.findOneAndUpdate(
    { _id: req.body.user },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update user bookings history",
        });
      }
      next();
    }
  );
};

exports.listbyrooms = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  User.find()

    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, rooms) => {
      if (err) {
        return res.status(400).json({
          error: "Guest not found",
        });
      }
      res.json(rooms);
    });
};

exports.listHistory = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;

  User.find({ _id: req.profile._id })
    .populate("history.booking", "_id name")
    .sort([[sortBy, order]])
    .limit(limit)

    .exec((err, rooms) => {
      if (err) {
        return res.status(400).json({
          error: "Guest not found",
        });
      }
      res.json(rooms[0].history);
    });
};
