const express = require("express")
const router = express.Router()
const validateToken = require("../middlewares/validateToken")
const {getTransaction, createTransaction, updateTransaction, deleteTransaction, getStats, getChartData, getCategoryState} = require("../controllers/transactionController")

router.get('/transactions', validateToken, getTransaction);
router.post('/transactions', validateToken, createTransaction);
router.put('/transactions/:id', validateToken, updateTransaction);
router.delete('/transactions/:id', validateToken, deleteTransaction);
router.get('/stats', validateToken, getStats)
router.get('/chart', validateToken, getChartData)
router.get('/cat', validateToken, getCategoryState)

module.exports = router;