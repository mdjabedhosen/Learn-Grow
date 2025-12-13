"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveClassServices = void 0;
const liveClass_model_1 = require("./liveClass.model");
const scheduleClass = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield liveClass_model_1.LiveClass.create(payload);
    return result;
});
const getClasses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield liveClass_model_1.LiveClass.find(query)
        .populate('courseId', 'title')
        .populate('instructorId', 'student_name');
    return result;
});
const getMyClasses = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {};
    if (role === 'instructor') {
        query = { instructorId: userId };
    }
    // For students, we need to find enrolled courses first (Implemented in next steps)
    const result = yield liveClass_model_1.LiveClass.find(query)
        .populate('courseId', 'title')
        .sort({ date: 1 });
    return result;
});
const updateClassStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield liveClass_model_1.LiveClass.findByIdAndUpdate(id, { status }, { new: true });
    return result;
});
const deleteClass = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield liveClass_model_1.LiveClass.findByIdAndDelete(id);
    return result;
});
exports.LiveClassServices = {
    scheduleClass,
    getClasses,
    getMyClasses,
    updateClassStatus,
    deleteClass,
};
