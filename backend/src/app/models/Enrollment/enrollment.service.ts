import { Enrollment } from './enrollment.model';

const enrollStudent = async (studentId: string, courseId: string) => {
    const result = await Enrollment.create({ studentId, courseId });
    return result;
};

const getMyEnrollments = async (studentId: string) => {
    const result = await Enrollment.find({ studentId }).populate('courseId');
    return result;
};

const checkEnrollment = async (studentId: string, courseId: string) => {
    const result = await Enrollment.findOne({ studentId, courseId });
    return result;
};

export const EnrollmentServices = {
    enrollStudent,
    getMyEnrollments,
    checkEnrollment,
};
