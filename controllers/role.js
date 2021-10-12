const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const Role = require("../models/role");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("express-jwt");

exports.create = (req, res) => {
  //console.log("req.body", req.body);
  const role = new Role(req.body);

  Role.save((err, role) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ role });
  });
};

exports.roleById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
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
};

exports.remove = (req, res) => {
  const user = req.profile._id;

  User.deleteOne({ _id: user }, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "user deleted successfully",
    });
  });
};

exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not authorized to perform this action",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
      console.log(User);
    }
  );
};

exports.list = (req, res) => {
  User.find({}, function (err, user) {
    if (err) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    res.json(user);
  });
};
