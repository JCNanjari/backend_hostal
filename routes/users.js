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

router.get("/user/byid/:userId", requireSignin, isAuth, read);
router.put("/user/update/:userId", requireSignin, isAuth,  update);
router.get("/user/list/all", requireSignin, isAuth, list);
router.delete("/user/delete/:userId", requireSignin, isAuth,  remove);

router.param("userId", userById);

module.exports = router;
