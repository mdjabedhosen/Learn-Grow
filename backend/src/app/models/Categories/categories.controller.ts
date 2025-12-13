import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { categoryServices } from './categories.service';

const createCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.categoryCreateIntoDB(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await categoryServices.updateCategoryIntoDB(_id, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.getAllcategoryFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully',
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await categoryServices.getSingleCategoryFromDB(_id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category fetched successfully',
    data: result,
  });
});

const categoryDelete = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await categoryServices.categoryDeleteFromDB(_id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});
export const categoryControllers = {
  createCategory,
  updateCategory,
  getAllCategory,
  getSingleCategory,
  categoryDelete,
};
