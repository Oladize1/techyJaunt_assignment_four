import express from "express";
import dotenv from 'dotenv'
dotenv.config()
import morgan from "morgan";

const app = express()

const PORT = process.env.PORT || 3000

import { connectDB } from "./src/config/connectDB.js";
import { userRouter } from "./src/routes/user.route.js";
import { postRouter } from "./src/routes/post.route.js";

app.use(morgan('dev'))
app.use(express.json())


app.use('/api/auth', userRouter)
app.use('/api/post', postRouter)

app.get('/', (req, res)=> {
    res.send("working")
})


const startApp = async() => {
    try {
        await connectDB(process.env.MONGODB_URI)
        app.listen(PORT, () => {
            console.log(`Server listening on PORT ${PORT}`);
        })
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

startApp()