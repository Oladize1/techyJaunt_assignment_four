import express from 'express'
export const userRouter = express.Router()
import { getAllUsers, login, register, verifyOtp } from '../controllers/user.controller.js'
import { protectedRoute } from '../middlewares/verifyToken.js'

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.put('/verify-otp', verifyOtp)
userRouter.get('/get-all-users', protectedRoute, getAllUsers)