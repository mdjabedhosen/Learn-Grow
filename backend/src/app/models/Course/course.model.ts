import { Schema, model } from 'mongoose';
import { ICourse, IModule, ILesson } from './course.interface';

const lessonSchema = new Schema<ILesson>({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'pdf', 'quiz'], required: true },
    contentUrl: { type: String, required: true },
    duration: { type: Number },
    isFreePreview: { type: Boolean, default: false },
});

const moduleSchema = new Schema<IModule>({
    title: { type: String, required: true },
    orderIndex: { type: Number, required: true },
    lessons: [lessonSchema],
});

const courseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        thumbnail: { type: String, required: true },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        modules: [moduleSchema],
        isPublished: { type: Boolean, default: false },
        totalDuration: { type: Number, default: 0 },
        totalStudents: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

export const Course = model<ICourse>('Course', courseSchema);
