import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/commonResponse';
import { EnrollmentServices } from './enrollment.service';

const enroll = catchAsync(async (req, res) => {
    const { courseId } = req.body;
    const result = await EnrollmentServices.enrollStudent(req.user._id, courseId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Enrolled successfully',
        data: result,
    });
});

const getMyEnrollments = catchAsync(async (req, res) => {
    const result = await EnrollmentServices.getMyEnrollments(req.user._id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Enrollments retrieved successfully',
        data: result,
    });
});

export const EnrollmentControllers = {
    enroll,
    getMyEnrollments,
};
