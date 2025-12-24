import { configDotenv } from 'dotenv'
configDotenv()

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        pass: process.env.EMAIL_PASS,
        user: process.env.EMAIL_USER
    }
})

export const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    }
    await transporter.sendMail(mailOptions)
    console.log(`mail sent to ${to}`);
}