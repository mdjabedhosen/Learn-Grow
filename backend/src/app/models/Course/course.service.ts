import httpStatus from 'http-status-codes';
import { Course } from './course.model';
import { ICourse } from './course.interface';
import AppError from '../../errors/appError';

const createCourseIntoDB = async (payload: ICourse) => {
    const result = await Course.create(payload);
    return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    // Can add basic filtering here manually or use a QueryBuilder later
    const result = await Course.find(query).populate('instructorId', 'student_name img email');
    return result;
};

const getSingleCourseFromDB = async (id: string) => {
    const result = await Course.findById(id).populate('instructorId', 'student_name img email');
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
    }
    return result;
};

const updateCourseInDB = async (id: string, payload: Partial<ICourse>) => {
    const result = await Course.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found to update');
    }
    return result;
};

const deleteCourseFromDB = async (id: string) => {
    const result = await Course.findByIdAndDelete(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Course not found to delete');
    }
    return result;
};

export const CourseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseFromDB,
    updateCourseInDB,
    deleteCourseFromDB,
};
