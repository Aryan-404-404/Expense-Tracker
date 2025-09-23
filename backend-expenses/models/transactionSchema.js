const mongoose = require("mongoose")

const transactionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {type: String, enum:["income", "expense"], default:"expense"},
    amount: {type: Number, required: [true, "Please enter the amount"]},
    category: {type: String, required: true},
    description: {type: String},
    date: {type: Date, default: Date.now}
}, {timestamps: true})

module.exports = mongoose.model("Transaction", transactionSchema)