const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const {
    userById,
    read,
    update,
    remove,
    list,
} = require("../controllers/users");

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);

router.get("/user/list/:userId", requireSignin, isAuth, isAdmin, list);

router.delete(
    "/user/remove/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);

router.param("userId",userById);

module.exports = router;