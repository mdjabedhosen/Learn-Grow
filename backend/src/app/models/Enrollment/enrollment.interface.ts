import { Types } from 'mongoose';

export interface IEnrollment {
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    progress: number;
    completedLessons: Types.ObjectId[];
    isCompleted: boolean;
    enrolledAt: Date;
}
