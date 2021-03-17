const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, addBookingToUserHistory, list } = require("../controllers/users");
const { roomsById, changeStateAvailable } = require("../controllers/rooms");
const { bookingById } = require("../controllers/booking");
const {
    create,
    passengerById,
    updatecheckout,
    listpassenger
    
} = require("../controllers/passenger");


router.post(
    "/passenger/create/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    create
);

router.post(
    "/passenger/checkout/:passengerId/:roomId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    changeStateAvailable,
    updatecheckout
);

router.get("/passenger/list/:userId", requireSignin, isAuth, isAdmin,listpassenger);


router.param("userId", userById);
router.param("roomId", roomsById);
router.param("passengerId", passengerById);


module.exports = router;