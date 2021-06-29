const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const User = require("../models/users");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("express-jwt");

exports.userById = (req, res, next, id) => {
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
  const user = req.profile._id

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




/* 
var path = req.url;
  var data = req.headers.authorization; //descripter data

  jwt.verify(data, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      err = {
        name: "TokenExpiredError",
        message: "JWT Expired",
        expiredAt: err.expiredAt
      };
      return res.status(403).json(returnJsonError(403, err, path));
    } else {
      req.complaintjwt = decoded;
      next();
    }
  }); */