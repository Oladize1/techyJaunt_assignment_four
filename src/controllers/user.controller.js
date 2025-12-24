import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import {User} from '../models/User.js'

import { sendMail } from '../config/email.js';

export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json("All fields are required")
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json('Invalid Credentials')
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpired = Date.now() + (5 * 60 * 1000)
        if(!user.isVerified){
            user.otp = otp
            user.otpExpired = otpExpired
            await user.save()
            await sendMail(email, 'Verification OTP', otp)
            return res.status(401).json("User Not verified, check your email for OTP")
        }
        const passwordCheck = await bcrypt.compare(password, user.password)
        if (!passwordCheck) {
            return res.status(401).json("Invalid credentials")
        }
        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET ,{expiresIn: '1d'})
        return res.status(200).json({message: 'User log in successfully', token})
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}

export const register = async (req, res) => {
    try {
        const {name, email, password} = req.body
        if (!name || !email || !password) {
            return res.status(400).json("All fields are required")
        }
        if (name.length < 3) {
            return res.status(400).json("Name characters must be greater than or equal to 3")
        }
        const user = await User.findOne({email})
        if (user) {
            return res.status(409).json("User already exist")
        }
        if (password.length < 6) {
            return res.status(400).json('password must be greater than or equal to 6')
        }
        const hashedPassword = await bcrypt.hash(password, 10)        
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()
        return res.status(201).json('user register successfully')
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}


export const verifyOtp = async (req, res) => {
    try {
        const {otp, email} = req.body
        if (!otp || !email) {
            return res.status(404).json('All field Required')
        }

        const user = await User.findOne({otp, email})
        if (!user) {
            return res.status(401).json("Invalid credentials")
        }
        if (user.otpExpired < Date.now()) {
            return res.status(400).json("Otp Expired")
        }
        user.isVerified = true
        user.otp = null
        user.otpExpired = null
        await user.save()
        return res.status(200).json("User Verified Successfully")
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const {role} = req.user
        if (role !== 'admin') {
            return res.status(403).json('Unauthorized to perform this action')
        }
        const users = await User.find()
        if (!users || users.length < 1) {
            return res.status(404).json("No user at the moment")
        }
        return res.status(200).json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error")
    }
}