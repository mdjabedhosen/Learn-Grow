import { Schema, model } from 'mongoose';
import { ILiveClass } from './liveClass.interface';

const liveClassSchema = new Schema<ILiveClass>(
    {
        title: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        duration: { type: Number, default: 60 },
        platform: { type: String, enum: ['zoom', 'meet'], required: true },
        meetingLink: { type: String, required: true },
        status: {
            type: String,
            enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
            default: 'scheduled',
        },
    },
    {
        timestamps: true,
    },
);

export const LiveClass = model<ILiveClass>('LiveClass', liveClassSchema);
