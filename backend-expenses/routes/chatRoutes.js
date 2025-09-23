const asyncHandler = require("express-async-handler")
const express = require("express")
const { GoogleGenerativeAI } = require('@google/generative-ai');
const validateToken = require("../middlewares/validateToken")

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/', validateToken, asyncHandler(async (req, res) => {
    const userId = req.cookies.userId;
    const { message, context } = req.body

    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Please provide a message"
        });
    }
    try {
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL })

        let financialInfo = "";
        if (context) {
            const { income, expenses, balance, savings } = context;
            financialInfo = `
            USER'S FINANCIAL DATA:
            💰 Income: $${income}
            💸 Expenses: $${expenses}
            💰 Balance: $${balance}
            💎 Savings: $${savings}
            
            ANALYSIS:
            - Savings Rate: ${income > 0 ? ((savings / income) * 100).toFixed(1) : 0}%
            - Expense Ratio: ${income > 0 ? ((expenses / income) * 100).toFixed(1) : 0}%
            - Financial Health: ${balance > 0 ? 'Positive' : 'Needs Attention'}
            
            Give PERSONALIZED advice based on these real numbers!
            `;
        }

        const prompt = `
            You are MoneyMate, a friendly personal finance advisor chatbot.
            ${financialInfo}
            
            User Question: ${message}
            
            Rules:
            - Use the financial data above to give SPECIFIC advice
            - Keep responses short (2-3 sentences max)  
            - Use emojis to make it friendly
            - Focus on ONE actionable tip
            - Be encouraging, not judgmental
            - If no financial data, give general advice
            
            Examples of GOOD responses:
            - "Your savings rate is only 5% - try to bump it to 20%! Start by cutting that $200 entertainment budget by half 🎯"
            - "Great job saving $400/month! 💪 Consider investing some of it for long-term growth 📈"
            - "Your expenses are 90% of income - that's risky! Try meal prepping to cut food costs by $150/month 🍱" `

        const result = await model.generateContent(prompt)
        const response = await result.response
        const answer = response.text()

        res.status(200).json({
            success: true,
            answer: answer
        })
    }
    catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            success: false,
            answer: "Sorry, I'm having trouble right now. Please try again later."
        });
    }
}))

module.exports = router

