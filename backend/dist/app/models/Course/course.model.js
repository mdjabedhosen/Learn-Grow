"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const lessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'pdf', 'quiz'], required: true },
    contentUrl: { type: String, required: true },
    duration: { type: Number },
    isFreePreview: { type: Boolean, default: false },
});
const moduleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    orderIndex: { type: Number, required: true },
    lessons: [lessonSchema],
});
const courseSchema = new mongoose_1.Schema({
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
    instructorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    modules: [moduleSchema],
    isPublished: { type: Boolean, default: false },
    totalDuration: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
}, {
    timestamps: true,
});
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
