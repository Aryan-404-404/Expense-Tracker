const mongoose = require("mongoose")
const Transaction = require("../models/transactionSchema")
const asyncHandler = require("express-async-handler")

const createTransaction = asyncHandler(async (req, res) => {
    const { type, amount, category, description, date } = req.body;
    if (!type || !amount || !category) {
        res.status(400);
        throw new Error("All fields are mandatory!")
    }
    const transDate = new Date(date);
    const newTransaction = new Transaction({
        userId: req.user._id,
        type,
        amount,
        category,
        description,
        date,
    })
    const savedTransaction = await newTransaction.save()
    await savedTransaction.populate('userId')
    console.log(savedTransaction);
    res.status(201).json(savedTransaction)
})

const getTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.find({ userId: req.user._id }).populate('userId', 'userName email').sort({ createdAt: -1 });
    if (transaction.length === 0) {
        res.status(404)
        throw new Error("No transactions")
    }
    res.status(200).json(transaction)
})

const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id).populate('userId', 'userName email');
    if (!transaction) {
        res.status(404)
        throw new Error("Transaction not found!")
    }
    res.status(200).json(transaction)
})

const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
        res.status(404)
        throw new Error("Transaction not found!")
    }
    if (transaction.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized to delete this transaction");
    }
    await transaction.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully" });
})

const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
        res.status(404)
        throw new Error("Transaction not found!")
    }
    const updatedTransaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
    await updatedTransaction.populate("userId")
    res.status(200).json(updatedTransaction)
})

const getStats = asyncHandler(async (req, res) => {
    console.log("User ID:", req.user._id);
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await Transaction.find({ userId: req.user._id });
    const monthTransactions = await Transaction.find({
        userId: req.user._id,
        date: { $gte: startOfMonth, $lte: endOfMonth }
    })
    if (transactions.length === 0) {
        console.log("No transactions found");
        return res.status(200).json({
            incomeSum: 0,
            expenseSum: 0,
            balance: 0,
            saving: 0
        });
    }
    let incomeSum = 0;
    let expenseSum = 0;
    transactions.forEach(t => {
        if (t.type === "income") {
            incomeSum += t.amount;
        }
        else {
            expenseSum += t.amount;
        }
    });

    let monthIncome = 0;
    let monthExpense = 0;
    let categoryMap = {}
    monthTransactions.forEach(t => {
        if (t.type === 'income') {
            monthIncome += t.amount;
        }
        else {
            monthExpense += t.amount;
            if (!categoryMap[t.category]) {
                categoryMap[t.category] = 0;
            }
            categoryMap[t.category] += t.amount;
        }

    })
    const categories = Object.entries(categoryMap).map(([cat, amount]) => ({
        cat,
        amount,
        expensePercentage: monthExpense > 0 ? parseFloat((amount / monthExpense) * 100).toFixed(1) : 0
    })).sort((a, b) => b.amount - a.amount)
    const balance = incomeSum - expenseSum;
    const saving = balance;
    res.send({ incomeSum, expenseSum, balance, saving, categories });
})

const getChartData = asyncHandler(async (req, res) => {
    const { range } = req.query;
    const filter = { userId: req.user._id }
    if (range === "7d") {
        let sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filter.date = { $gte: sevenDaysAgo }
    }
    else if (range === "30d") {
        let thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filter.date = { $gte: thirtyDaysAgo }
    } else {
        console.log("Showing all time transactions");
    }
    const transactions = await Transaction.find(filter).sort({ date: -1 })
    let balance = 0;
    let balanceData = {}
    let trendData = {}
    transactions.forEach(e => {
        const day = e.date.toISOString().split("T")[0];

        if (!balanceData[day]) balanceData[day] = { date: day, balance };
        if (e.type === "income") balance += e.amount;
        if (e.type === "expense") balance -= e.amount;
        balanceData[day].balance = balance;

        if (!trendData[day]) trendData[day] = { date: day, income: 0, expense: 0 }
        if (e.type === "income") trendData[day].income += e.amount
        if (e.type === "expense") trendData[day].expense += e.amount
    });

    const balanceArray = Object.values(balanceData).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )
    const trendArray = Object.values(trendData).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )
    res.send({ balanceData: balanceArray, trendData: trendArray, recentTransactions: transactions })
})

const getCategoryState = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ userId: req.user._id });
    if (transactions.length == 0) {
        res.status(200).json([])
        return
    }
    let categorytotal = {}
    transactions.forEach(t => {
        if (!categorytotal[t.category]) {
            categorytotal[t.category] = {
                total: 0,
                type: t.type
            }
        }
        categorytotal[t.category].total += t.amount
    });
    const sorted = Object.entries(categorytotal)
        .map(([category, data]) => ({ category, total: data.total, type: data.type }))
        .sort((a, b) => b.total - a.total)
    res.json(sorted)
})

module.exports = { createTransaction, getTransaction, getTransactionById, deleteTransaction, updateTransaction, getStats, getChartData, getCategoryState }