import mongoose, { Schema, Document } from 'mongoose'

export interface IMilestone {
    title: string
    duration: string
    description: string
    tasks: string[]
    completed: boolean
    completedAt?: Date
    category?: string
}

export interface IRoadmap extends Document {
    userId: mongoose.Types.ObjectId
    careerId?: mongoose.Types.ObjectId
    focusArea: string
    status: 'GENERATING' | 'COMPLETED' | 'FAILED'
    milestones: IMilestone[]
    createdAt: Date
    updatedAt: Date
}

const MilestoneSchema = new Schema<IMilestone>(
    {
        title: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String, required: true },
        tasks: { type: [String], default: [] },
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        category: { type: String, default: '' },
    },
    { _id: false }
)

const RoadmapSchema = new Schema<IRoadmap>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        careerId: { type: Schema.Types.ObjectId, ref: 'Career' },
        focusArea: { type: String, required: true },
        status: {
            type: String,
            enum: ['GENERATING', 'COMPLETED', 'FAILED'],
            default: 'GENERATING',
        },
        milestones: { type: [MilestoneSchema], default: [] },
    },
    { timestamps: true }
)

export const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema)
