const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/users");
const { bookingById,changeStatePayment } = require("../controllers/booking");

router.post("/payment/create/:bookingId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    changeStatePayment
      
);
router.param("bookingId", bookingById);
router.param("userId",userById);

module.exports = router;


