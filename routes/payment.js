const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { guestById } = require("../controllers/guest");
const { bookingById,changeStatePayment } = require("../controllers/booking");

router.post("/payment/create/:bookingId/:guestId",
    requireSignin,
    isAuth,
    isAdmin,
    changeStatePayment
      
);
router.param("bookingId", bookingById);
router.param("guestId",guestById);

module.exports = router;


