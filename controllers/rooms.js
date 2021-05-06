const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Rooms = require("../models/rooms");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.roomsById = (req, res, next, id) => {
  Rooms.findById(id)
  .exec((err, rooms) => {
    if (err || !rooms) {
      return res.status(400).json({
        error: "Room not found",
      });
    }
    req.rooms = rooms;
    next();
  });
};

exports.read = (req, res) => {
  req.rooms.photo = undefined;
  return res.json(req.rooms);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    // check for all fields
    const { name, description, price, state, type_bed, bath_private } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !state ||
      !type_bed ||
      !bath_private
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let rooms = new Rooms(fields);

    // 1kb = 1000
    // 1mb = 1000000

    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      rooms.photo.data = fs.readFileSync(files.photo.path);
      rooms.photo.contentType = files.photo.type;
    }

    rooms.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let rooms = req.rooms;
  rooms.remove((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Room deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  Rooms.findOneAndUpdate(
    { _id: req.rooms._id },
    { $set: req.body },
    { new: true },
    (err, rooms) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }

      res.json(rooms);
    }
  );
};

exports.photo = (req, res, next) => {
  if (req.rooms.photo.data) {
    res.set("Content-Type", req.rooms.photo.contentType);
    return res.send(req.rooms.photo.data);
  }
  next();
};

exports.changeStateAvailable = (req, res, next) => {
  Rooms.findOneAndUpdate(
    { _id: req.rooms._id },
    { state: "available" },
    { upsert: true },
    (error, statusupdate) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update room state",
        });
      }
      if (req.body.noresponse) {
        next();
      } else {
        res.json(statusupdate);
      }
    }
  );
};
exports.changeStateNoAvailable = (req, res, next) => {
  Rooms.findOneAndUpdate(
    { _id: req.rooms._id },
    { state: "Noavailable" },
    { upsert: true },
    (error, statusupdate) => {
      if (error) {
        return res.status(400).json({
          error: "Could not update room state",
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

  Rooms.find()
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, rooms) => {
      if (err) {
        return res.status(400).json({
          error: "room not found",
        });
      }
      res.json(rooms);
    });
};
