const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");
const { userById } = require("../controllers/users");

const {
  guestById,
  guestforId,
  update,
  //remove,
  listbyrooms,
  create,
  listHistory,
} = require("../controllers/guest");

router.post("/guest/create",create);
//router.get("/guest/list/:guesId", guestforId);
router.put("/guest/userId/:userId/:guesId", requireSignin,isAuth, update);
router.get("/guest/list/:userId/:guesId", requireSignin, isAuth, listbyrooms);
//router.delete("/guest/remove/:guesId", requireSignin, isAuth, isAdmin, remove);
router.get("/guest/history/:userId/:guesId", requireSignin, isAuth, listHistory);

router.param("guestId", guestById);
router.param("userId", userById);

module.exports = router;
