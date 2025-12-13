import httpStatus from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { UserServices } from './userRegistration.service';

const sendOTP = catchAsync(async (req, res) => {
  console.log('📱 Send OTP Request:', req.body);
  try {
    const result = await UserServices.sendSMS(req.body);
    console.log('✅ OTP Sent Successfully:', result);
    commonRes(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP Send Successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('❌ Send OTP Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo
    });
    throw error;
  }
});

const ReSendOTP = catchAsync(async (req, res) => {
  const result = await UserServices.ReSendSMS(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP Send Successfully',
    data: result,
  });
});

const verifySMS = catchAsync(async (req, res) => {
  const result = await UserServices.verifySMS(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Phone number verify successfully',
    data: result,
  });
});

const createUsers = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration completed successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Retrieved Successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.getSingleUserFromDB(id);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Information Retrieved Successfully',
    data: result,
  });
});

const updateUsers = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserFromDB(id, req.file, req.body);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await UserServices.getMeFromDB(email);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Your Information Retrieved Successfully`,
    data: result,
  });
});

export const userControllers = {
  createUsers,
  getSingleUser,
  getAllUsers,
  updateUsers,
  getMe,
  sendOTP,
  verifySMS,
  ReSendOTP,
};
