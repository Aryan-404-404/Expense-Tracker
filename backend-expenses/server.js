const express  = require("express") 
const dotenv = require("dotenv").config();
const cors = require("cors")
const port = process.env.PORT || 5000
const app = express()
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
connectDB()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())

app.use('/user', require("./routes/userRoutes"))
app.use('/trans', require("./routes/transactionRoutes"))
app.use('/chat',require("./routes/chatRoutes"))
app.use(require("./middlewares/errorHandler"))

app.get('/', (req, res)=>{
    res.send("Expense manager")
})
app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
})