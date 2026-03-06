import { Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { User } from '../models/User'
import { z } from 'zod'
import { AuthRequest } from '../middleware/auth'

const generateToken = (id: string, email: string): string => {
    const options: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'] }
    return jwt.sign({ id, email }, process.env.JWT_SECRET as string, options)
}

const SignupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const signup = async (req: Request, res: Response): Promise<void> => {
    const parsed = SignupSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ success: false, message: parsed.error.errors[0].message })
        return
    }

    const { name, email, password } = parsed.data

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        res.status(400).json({ success: false, message: 'An account with this email already exists.' })
        return
    }

    const user = await User.create({ name, email, passwordHash: password })
    const token = generateToken(String(user._id), user.email)

    res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
    })
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const parsed = LoginSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ success: false, message: parsed.error.errors[0].message })
        return
    }

    const { email, password } = parsed.data

    const user = await User.findOne({ email })
    if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' })
        return
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' })
        return
    }

    const token = generateToken(String(user._id), user.email)

    res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
    })
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await User.findById(req.user?.id).select('-passwordHash')
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' })
        return
    }
    res.json({ success: true, user })
}
