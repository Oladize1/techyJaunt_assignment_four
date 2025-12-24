# TechyJaunt Assignment Four

This project is a **simple backend API** for a blog system built with **Node.js, Express, and MongoDB**.

Users can:
- Register
- Verify their account with OTP
- Login
- Create posts
- View posts
- Update or delete only their own posts

Admins can update or delete any post.

---

## What This Project Does

- A user creates an account
- The user verifies their email using an OTP
- The user logs in and gets a token
- The token is used to access protected routes
- Logged-in users can create posts
- Users can only edit or delete posts they created
- Admin users can manage all posts

---

## Tools Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (for login)
- bcrypt (for password hashing)
- Nodemailer (for sending OTP)

---

## API Documentation

All endpoints are documented in Postman:

https://documenter.getpostman.com/view/23438119/2sBXVZoEAc

---

## How To Run This Project

```bash
git clone https://github.com/Oladize1/techyJaunt_assignment_four.git
cd techyJaunt_assignment_four


npm install

Create a .env file in the root folder and add:

PORT=3000
MONGO_URI= "you mongodb connection string"
JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS="your_email_app_password (Use Gmail App Password, not your normal email password.)"

npm run dev
OR
npm start


