const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { guestById, addBookingToUserHistory } = require("../controllers/guest");
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
    "/booking/create/:roomsId/:guestId",
    requireSignin,
    isAuth,
    isAdmin,
    changeStateNoAvailable,
    addBookingToUserHistory,
    create
);


router.get("/booking/list/:guestId", requireSignin, isAuth, isAdmin, listBookingsAllUser);
router.get("/booking/my/:guestId", requireSignin, isAuth, listBookingsUser);


router.get(
    "/booking/statusroom/:roomsId/:guestId",
    requireSignin,
    isAuth,
    isAdmin,
    getStatusValues
);
router.put(
    "/order/:orderId/status/:guestId",
    requireSignin,
    isAuth,
    isAdmin,
    updateBookingStatus
);

router.param("guestId",guestById);
router.param("bookingById", bookingById);
router.param("roomsId", roomsById);

module.exports = router;