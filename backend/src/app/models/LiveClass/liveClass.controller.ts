import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/commonResponse';
import { LiveClassServices } from './liveClass.service';

const scheduleClass = catchAsync(async (req, res) => {
    // Attach instructor ID from auth token
    const payload = { ...req.body, instructorId: req.user._id };
    const result = await LiveClassServices.scheduleClass(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Live Class scheduled successfully',
        data: result,
    });
});

const getAllClasses = catchAsync(async (req, res) => {
    const result = await LiveClassServices.getClasses(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Classes retrieved successfully',
        data: result,
    });
});

const getMyClasses = catchAsync(async (req, res) => {
    const result = await LiveClassServices.getMyClasses(req.user._id, req.user.role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My classes retrieved successfully',
        data: result,
    });
});

const updateStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await LiveClassServices.updateClassStatus(id, req.body.status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Class status updated',
        data: result,
    });
});

const deleteClass = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await LiveClassServices.deleteClass(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Class deleted successfully',
        data: result,
    });
});

export const LiveClassControllers = {
    scheduleClass,
    getAllClasses,
    getMyClasses,
    updateStatus,
    deleteClass,
};
