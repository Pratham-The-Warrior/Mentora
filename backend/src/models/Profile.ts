import mongoose, { Schema, Document } from 'mongoose'

export interface IProfile extends Document {
    userId: mongoose.Types.ObjectId
    class: string
    stream: string
    targetExam: string[]
    interests: string[]
    challenges: string[]
    goals: string
    updatedAt: Date
}

const ProfileSchema = new Schema<IProfile>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        class: { type: String, default: '' },
        stream: { type: String, default: '' },
        targetExam: { type: [String], default: [] },
        interests: { type: [String], default: [] },
        challenges: { type: [String], default: [] },
        goals: { type: String, default: '' },
    },
    { timestamps: true }
)

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema)
