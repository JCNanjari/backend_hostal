const UserModel = require("../models/users");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");
const { v1 } = require("uuid");

exports.signup = (req, res) => {
  // console.log("req.body", req.body);
  const user = new User(req.body);

  UserModel.save((err, user) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  UserModel.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dont match",
      });
    }
    // generate a signed token with user id and secret
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  function: function _function(err, req, res, next) {
    return res.status(403).json(returnJsonError(403, "Access Denied", path));
  },
});

exports.isAdmin = (req, res, role, next) => {
  


  
};

exports.isAuth = (req, res, next) => {

  
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "Tu peticion no es aceptada",});

  }
  const token = req.headers.authorization.split(" ")[1];
  const payload = jwt.decode(token, process.env.JWT_SECRET);

  req.user = payload.sub;

  next();
};


