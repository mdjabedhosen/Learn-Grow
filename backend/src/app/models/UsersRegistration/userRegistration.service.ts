/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status-codes';
import { TUser } from './userRegistration.interface';
import AppError from '../../errors/appError';
import { User } from './userRegistration.model';
import { USER_ROLE } from './user.constent';
import { createToken, TJwtPayload } from '../Auth/auth.utils';
import config from '../../config/config';
import { sendEmail } from '../../utils/sendEmail';
import { sendVerificationCode, verifyCode } from '../../utils/sendSMS';
import bcrypt from 'bcryptjs';

const sendSMS = async (payload: { phone: string }) => {
  const userExistswithPhone = await User.findOne({ phone: payload?.phone });
  if (userExistswithPhone) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already exists! Duplicate Phone Number.',
    );
  }
  const res = await sendVerificationCode(payload?.phone);

  if (res?.success) {
    return res?.serviceSid;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      res?.message ? res?.message : 'Error sending verification code',
    );
  }
};

const ReSendSMS = async (payload: { phone: string }) => {
  const userExistswithPhone = await User.findOne({ phone: payload?.phone });
  if (userExistswithPhone?.verified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User already verified. Please login.',
    );
  }

  const res = await sendVerificationCode(payload?.phone);

  if (res?.success) {
    return res?.serviceSid;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      res?.message ? res?.message : 'Error sending verification code',
    );
  }
};

const verifySMS = async (payload: {
  phone: string;
  code: string;
  verifyServiceSid: string;
}) => {
  // const smsCode = sendVerificationCode(phone);
  const res = await verifyCode(
    payload?.phone,
    payload?.code,
    payload?.verifyServiceSid,
  );

  if (res?.success) {
    const userInfo = {
      phone: payload?.phone,
      role: USER_ROLE.student,
    };
    await User.create(userInfo);
    return res.message;
  } else {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      res?.message ? res?.message : 'Invalid verification code.',
    );
  }
};

const createUserIntoDB = async (payload: TUser) => {
  const userExists = await User.findOne({ email: payload?.email });

  if (userExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This email already exists! Please try with another email.',
    );
  }

  if (!payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Password is required. Please provide a password.',
    );
  }

  if (payload?.role === 'superAdmin' || payload?.role === 'admin') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only Super admin can create Admin or Super Admin account.',
    );
  }

  // ===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_round),
  );

  const userInfo = {
    ...payload,
    password: newHasedPassword,
    verified: true,
    passwordChangedAt: new Date(),
  };

  const user = await User.findOneAndUpdate({ phone: payload.phone }, userInfo, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (user) {
    const jwtPayload: TJwtPayload = {
      _id: user._id,
      phone: user.phone,
      role: user?.role,
    };

    //===========> create token and sent to the client
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    //===========> create refresh token and sent to the client
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_access_expires_in as string,
    );
    return {
      user: user,
      token: accessToken,
      refreshToken: refreshToken,
    };
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User Not Found, Please check your phone number.',
    );
  }
};

const getAllUserFromDB = async () => {
  const userExists = await User.find().select('-password');
  return userExists;
};

const getSingleUserFromDB = async (_id: string) => {
  const result = await User.findById({ _id }).select('-password');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Information is not found.');
  }
  return result;
};

const getMeFromDB = async (email: string) => {
  const userExists = await User.findOne({ email: email });

  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Information is not found.');
  }
  return userExists;
};

const updateUserFromDB = async (
  _id: string,
  file: any,
  payload: Partial<TUser>,
) => {
  const userExists = await User.findById({ _id });
  if (!userExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Information is not found.');
  }

  const existEmail = await User.findOne({ email: payload?.email });
  if (existEmail) {
    throw new AppError(httpStatus.FORBIDDEN, 'Duplicate Email address.');
  }

  const result = await User.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  }).select('-password');

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  getMeFromDB,
  sendSMS,
  verifySMS,
  ReSendSMS,
};
