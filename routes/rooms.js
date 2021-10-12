const express = require("express");
const router = express.Router();

const {
    create,
    roomsById,
    read,
    update,
    remove,
    list,
    photo,
    changeStateAvailable, 
} = require("../controllers/rooms");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { guestById } = require("../controllers/guest");
const { updateBookingStatus } = require("../controllers/booking");



router.get("/rooms/:roomsId", read);
router.post("/rooms/create",  create);
router.put("/rooms/:roomsId",requireSignin,isAuth,update);
router.delete("/rooms/:roomsId/",requireSignin,isAuth,remove);
router.get("/rooms", list);


//CHANGE STATE FOR AVAILABLE ROOM
router.post("/rooms/status/available/:roomsId/:guestId",
requireSignin,
isAuth,
changeStateAvailable
);

router.param("roomsId", roomsById);
router.param("guestId", guestById);
router.get("/rooms/photo/:roomsId", photo);

module.exports = router;