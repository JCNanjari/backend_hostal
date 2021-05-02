const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { guestById, addBookingToUserHistory, list } = require("../controllers/guest");
const { roomsById, changeStateAvailable } = require("../controllers/rooms");
const { bookingById } = require("../controllers/booking");
const {
    create,
    passengerById,
    updatecheckout,
    listpassenger
    
} = require("../controllers/passenger");


router.post(
    "/passenger/create/:guestId",
    requireSignin,
    isAuth,
    isAdmin,
    create
);

router.post(
    "/passenger/checkout/:passengerId/:roomId/:guestId",
    requireSignin,
    isAuth,
    isAdmin,
    changeStateAvailable,
    updatecheckout
);

router.get("/passenger/list/:guestId", requireSignin, isAuth, isAdmin,listpassenger);


router.param("guestId", guestById);
router.param("roomId", roomsById);
router.param("passengerId", passengerById);


module.exports = router;