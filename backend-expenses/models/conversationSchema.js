const mongoose = require("mongoose")

const conversationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    messages: [{
        role: {
            type: String,
            enum: ["system", "user", "assistant"],
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 2000
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

conversationSchema.pre('save', function (next) {
    if (this.messages.length > 20) {
        this.messages = this.messages.slice(-20)
    }
    next();
})
conversationSchema.index({ lastActive: 1}, {expireAfterSeconds: 2592000 })

conversationSchema.methods.addMessage = function (role, content) {
    this.messages.push({ role, content })
    this.lastActive = new Date();
    return this.save()
}

module.exports = mongoose.model("Conversation", conversationSchema);