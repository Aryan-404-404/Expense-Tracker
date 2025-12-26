const express = require("express")
const router = express.Router();
const validateToken = require("../middlewares/validateToken")
const {handleChat} = require("../controllers/chatController")

router.post('/', validateToken, handleChat)

module.exports = router

