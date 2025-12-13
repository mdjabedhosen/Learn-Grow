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
exports.EnrollmentServices = void 0;
const enrollment_model_1 = require("./enrollment.model");
const enrollStudent = (studentId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield enrollment_model_1.Enrollment.create({ studentId, courseId });
    return result;
});
const getMyEnrollments = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield enrollment_model_1.Enrollment.find({ studentId }).populate('courseId');
    return result;
});
const checkEnrollment = (studentId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield enrollment_model_1.Enrollment.findOne({ studentId, courseId });
    return result;
});
exports.EnrollmentServices = {
    enrollStudent,
    getMyEnrollments,
    checkEnrollment,
};
