const User = require("../models/users");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const { errorHandler } = require("../helpers/dbErrorHandler");
const { v1 } = require("uuid");

exports.signup = (req, res) => {
  // console.log("req.body", req.body);
  const user = new User(req.body);
  const identify = `U_${v1().replace(/-/g, "")}`;
  user.identify = identify;
  user.save((err, user) => {
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
  User.findOne({ email }, (err, user) => {
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
    const token = jwt.sign({ identify: user.identify }, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { identify, name, email, role } = user;
    return res.json({ token, user: { identify, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});

exports.revalidToken = ( req,res) => {
  
  const id = req._id;
  const name = req.name;
  const role = req.role;
  
  
  //generate token
  
    const token = jwt.sign(id,name,role, process.env.JWT_SECRET);
 
    res.cookie("t", token, { expire: new Date() + 9999 });
  
    return res.json({
      token, 
      id,
      name,
      role
    })
}

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile.id == req.auth.id;

  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === false) {
    return res.status(403).json({
      error: "Admin resourse! Access denied",
    });
  }
  next();
};
