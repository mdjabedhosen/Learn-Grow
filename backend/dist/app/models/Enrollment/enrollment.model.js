"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = void 0;
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    studentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0 },
    completedLessons: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' }],
    isCompleted: { type: Boolean, default: false },
    enrolledAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
// Prevent duplicate enrollment
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
exports.Enrollment = (0, mongoose_1.model)('Enrollment', enrollmentSchema);
