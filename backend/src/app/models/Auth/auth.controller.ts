import httpStatus from 'http-status-codes';
import config from '../../config/config';
import catchAsync from '../../utils/catchAsync';
import commonRes from '../../utils/commonResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, token, user } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login Successfully!',
    data: { user, token },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Change Successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const phone = req.body.phone;

  const result = await AuthServices.forgetPassword(phone);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP is Generate Successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is reset Successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await AuthServices.getMeFromDB(email);

  commonRes(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User Information is retrived succesfully`,
    data: result,
  });
});

export const authControllers = {
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  getMe,
};
