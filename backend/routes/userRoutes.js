const express = require("express");
const { registerUser, loginUser, showAllUsers } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", showAllUsers);

module.exports = router;
