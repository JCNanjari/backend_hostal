const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
//const { userById } = require("../controllers/users");

const {
  guestById,
  read,
  update,
  //remove,
  list,
  listHistory,
} = require("../controllers/guest");

router.get("/guest/:guesId", requireSignin, isAuth, read);
router.put("/guest/:guesId", requireSignin, isAuth, update);
router.get("/guest/list/:guesId", requireSignin, isAuth, isAdmin, list);
//router.delete("/guest/remove/:guesId", requireSignin, isAuth, isAdmin, remove);
router.get("/guest/history/:guesId", requireSignin, isAuth, listHistory);
router.param("guestId", guestById);

module.exports = router;
