const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, addBookingToUserHistory } = require("../controllers/users");
const {
    create,
    listBookingsAllUser,
    listBookingsUser,
    getStatusValues,
    updateBookingStatus,
    bookingById

} = require("../controllers/booking");
const { changeStateNoAvailable,roomsById } = require("../controllers/rooms");

router.post(
    "/booking/create/:roomsId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    changeStateNoAvailable,
    addBookingToUserHistory,
    create
);


router.get("/booking/list/:userId", requireSignin, isAuth, isAdmin, listBookingsAllUser);
router.get("/booking/my/:userId", requireSignin, isAuth, listBookingsUser);


router.get(
    "/booking/statusroom/:roomsId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues
);
router.put(
    "/order/:orderId/status/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    updateBookingStatus
);

router.param("userId", userById);
router.param("bookingById", bookingById);
router.param("roomsId", roomsById);

module.exports = router;