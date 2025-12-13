"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveClass = void 0;
const mongoose_1 = require("mongoose");
const liveClassSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    instructorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    platform: { type: String, enum: ['zoom', 'meet'], required: true },
    meetingLink: { type: String, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled',
    },
}, {
    timestamps: true,
});
exports.LiveClass = (0, mongoose_1.model)('LiveClass', liveClassSchema);
