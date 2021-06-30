const express = require('express');

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/register", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:id", UserController.getUser);

router.patch("/:id", checkAuth, UserController.updateUser);

router.delete("/:id", checkAuth, UserController.deleteUser);

module.exports = router;
