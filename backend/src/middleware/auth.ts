import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
    user?: { id: string; email: string }
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'No token provided. Please log in.' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const secret = process.env.JWT_SECRET as string
        const decoded = jwt.verify(token, secret) as { id: string; email: string }
        req.user = { id: decoded.id, email: decoded.email }
        next()
    } catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' })
    }
}
