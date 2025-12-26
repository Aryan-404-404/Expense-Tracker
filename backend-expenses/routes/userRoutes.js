const express = require("express")
const router = express.Router()
const {info, register, login, logout} = require("../controllers/userController")
const validateToken = require("../middlewares/validateToken")

router.get('/info',validateToken, info);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router