import jwt from 'jsonwebtoken'

export const protectedRoute = (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(400).json("token not provided")
        }
        const token = authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if (!decoded) {
            return res.status(401).json("Invalid Token")
        }
        req.user = decoded
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json("Unauthorized: invalid or expired token")
    }
}