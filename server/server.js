import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"
import connectDB from "./config/mongodb.js"
import authRouter from "./routes/authroutes.js"

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))
connectDB()

app.listen(port, () => console.log(`Server started on port: ${port}`))

// API ENDPOINTS
app.get('/', (req, res) => res.send("API working"))

app.use('/api/auth', authRouter)