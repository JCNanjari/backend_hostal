const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin,verifyAuth } = require("../controllers/auth");

const {
  userById,
  read,
  update,
  remove,
  list,
} = require("../controllers/users");

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);
router.get("/user/list/all",requireSignin,verifyAuth,list);
router.delete("/user/remove/:userId", requireSignin, isAuth, isAdmin, remove);
router.param("userId", userById);

module.exports = router;
