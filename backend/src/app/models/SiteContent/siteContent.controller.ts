import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { SiteContentServices } from './siteContent.service';

const updateContent = catchAsync(async (req, res) => {
    const result = await SiteContentServices.createOrUpdateContent(req.body);

    commonRes(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Content updated successfully',
        data: result,
    });
});

const getContent = catchAsync(async (req, res) => {
    const { page } = req.params;
    const result = await SiteContentServices.getContent(page);

    commonRes(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Content retrieved successfully',
        data: result || {},
    });
});

export const SiteContentControllers = {
    updateContent,
    getContent,
};
