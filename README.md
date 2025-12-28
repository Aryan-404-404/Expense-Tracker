# 💰 AI-Powered MERN Expense Tracker

A full-stack financial management application built with the **MERN Stack**. Track your income and expenses, visualize financial data with interactive charts, and get personalized financial advice from an **AI-powered chatbot with conversation memory**.

## 🚀 Live Demo

**[View Live Application](https://expense-tracker-frontend-frqq.onrender.com/)**

---

## ✨ Key Features

### 📊 **Interactive Dashboard**
- Real-time overview of Total Balance, Income, Expenses, and Savings
- Visual trend graphs with customizable time ranges (7 days, 30 days, all-time)
- Monthly category breakdown with percentage analysis
- Recent transaction history at a glance

### 🤖 **AI Financial Assistant (MoneyMate)**
- **Powered by Groq Llama 3.3 70B** for fast, intelligent responses
- **Conversation Memory:** Remembers previous questions and provides contextual advice
- **Personalized Insights:** Analyzes your actual spending patterns and categories
- Category-specific recommendations based on your transaction history
- Natural language understanding for financial queries

### 💬 **Smart Features**
- **Persistent Chat History:** Conversations saved in MongoDB with automatic cleanup
- **Context-Aware Responses:** AI references your financial data (income, expenses, categories)
- **Session Management:** Up to 20 messages stored per conversation with auto-archiving after 30 days

### 📄 **Financial Reports**
- Downloadable PDF "Financial Dashboard Report"
- Analyzes savings rates, expense ratios, and emergency fund status
- Professional formatting with detailed breakdowns

### 💸 **Transaction Management**
- Add, edit, and delete transactions with ease
- Detailed categorization (Food & Dining, Transportation, Bills, Shopping, etc.)
- Filter by date ranges and transaction types
- Sort by amount, date, or category

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** - Component-based UI
- **Tailwind CSS** - Modern, responsive styling
- **Recharts** - Interactive data visualizations
- **Lucide React** - Beautiful icon library

### **Backend**
- **Node.js & Express.js** - RESTful API server
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **AsyncHandler** - Clean error handling

### **Database**
- **MongoDB Atlas** - Cloud database with TTL indexes for auto-cleanup
- Optimized schemas with indexing for fast queries

### **AI Integration**
- **Groq API** - Lightning-fast AI inference
- **Llama 3.3 70B Versatile** - Advanced language model
- Conversation memory with message history persistence

---

## 🏗️ Architecture Highlights

### **Clean Code Principles**
- Separated controllers, routes, and models (MVC pattern)
- Reusable middleware for authentication and error handling
- Schema-level validation and business logic

### **Database Optimization**
- TTL indexes for automatic data lifecycle management
- Message limiting (20 messages per conversation) to prevent unbounded growth
- Efficient querying with proper indexing on `userId` and `lastActive`

### **AI Memory System**
- Stores conversation history in MongoDB
- Sends last 6 messages to AI for context
- Automatic cleanup of inactive conversations after 30 days
- Prevents token overflow while maintaining conversation continuity

---

## ⚡ Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Aryan-404-404/Expense-Tracker.git
    cd Expense-Tracker
    ```

2.  **Install Dependencies**
    ```bash
    # Install server dependencies
    npm install

3.  **Run the App**
    ```bash
    npm run dev
    ```
