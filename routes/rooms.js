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
const { userById } = require("../controllers/users");
const { updateBookingStatus } = require("../controllers/booking");



router.get("/rooms/:roomsId", read);
router.post("/rooms/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put("/rooms/:roomsId/:userId",requireSignin,isAuth,isAdmin,update);
router.delete("/rooms/:roomsId/:userId",requireSignin,isAuth,isAdmin,remove);
router.get("/rooms", list);


//CHANGE STATE FOR AVAILABLE ROOM
router.post("/rooms/status/available/:roomsId/:userId",
requireSignin,
isAuth,
isAdmin,
changeStateAvailable
);

router.param("roomsId", roomsById);
router.param("userId", userById);
router.get("/rooms/photo/:roomsId", photo);

module.exports = router;