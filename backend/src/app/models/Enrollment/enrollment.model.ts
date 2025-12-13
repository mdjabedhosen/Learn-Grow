import { Schema, model } from 'mongoose';
import { IEnrollment } from './enrollment.interface';

const enrollmentSchema = new Schema<IEnrollment>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        progress: { type: Number, default: 0 },
        completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
        isCompleted: { type: Boolean, default: false },
        enrolledAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    },
);

// Prevent duplicate enrollment
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export const Enrollment = model<IEnrollment>('Enrollment', enrollmentSchema);
