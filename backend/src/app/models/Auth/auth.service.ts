import httpStatus from 'http-status-codes';
import { EmailVerification, TLoginUser } from './auth.interface';
import AppError from '../../errors/appError';
import { User } from '../UsersRegistration/userRegistration.model';
import { TJwtPayload, VerifyToken, createToken } from './auth.utils';
import config from '../../config/config';
import { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../../utils/sendEmail';
import { sendVerificationCode, verifyCode } from '../../utils/sendSMS';

const loginUser = async (payload: TLoginUser) => {
  //===>check if the user is exists
  const isUserExists = await User.findOne({ phone: payload.phone });

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User not found! Check your Phone Number.',
    );
  }

  if (isUserExists?.status === 'Block') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account temporary Blocked. Please contact with admin.',
    );
  }

  ///====> checking if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    isUserExists?.password as string,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password!');
  }

  if (!isUserExists?.verified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not verified. Please verify your account.',
    );
  }

  //-====> access granted: send accessToken, RefreshToken
  const jwtPayload: TJwtPayload = {
    _id: isUserExists._id,
    phone: isUserExists?.phone,
    role: isUserExists?.role,
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

  const userInformation = await User.findOne({ phone: payload.phone })
    .select('-password -createdAt -updatedAt -passwordChangedAt') // Exclude password, createdAt, and updatedAt from the User document
    .exec();

  return {
    user: userInformation,
    token: accessToken,
    refreshToken: refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  //===>check if the user is exists
  const isUserExists = await User.findOne({ phone: userData.phone });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }

  const currentPassword = payload?.currentPassword;
  const hashpassword = isUserExists?.password;

  ///====> checking if the given password and exists password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    currentPassword,
    hashpassword as string,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password!');
  }

  // ===> hash new password
  const newHasedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      phone: userData.phone,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const forgetPassword = async (phone: string) => {
  const isUserExists = await User.findOne({ phone: phone });

  if (!isUserExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No Account found. Please check your phone.',
    );
  }

  const res = await sendVerificationCode(phone);

  if (res?.success) {
    return res?.serviceSid;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      res?.message
        ? res?.message
        : 'Error sending verification code for change password.',
    );
  }
};

const resetPassword = async (payload: {
  phone: string;
  code: string;
  verifyServiceSid: string;
  newPassword: string;
}) => {
  const res = await verifyCode(
    payload?.phone,
    payload?.code,
    payload?.verifyServiceSid,
  );

  if (res?.success) {
    //===> hash new password
    const newHasedPassword = await bcrypt.hash(
      payload.newPassword,
      Number(config.bcrypt_salt_round),
    );

    await User.findOneAndUpdate(
      {
        phone: payload.phone,
      },
      {
        password: newHasedPassword,
        passwordChangedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return 'Your Password Changed Successfully';
  } else {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      res?.message ? res?.message : 'Invalid verification code.',
    );
  }
};

const getMeFromDB = async (email: string) => {
  // const result = await User.aggregate([
  //   {
  //     $match: { email: email },
  //   },
  //   {
  //     $project: {
  //       password: 0,
  //       passwordChangedAt: 0,
  //       __v: 0,
  //     },
  //   },
  // ]);
  // if (result?.length > 0) {
  //   return result[0];
  // } else {
  //   throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  // }

  const result = await User.findOne({ email: email })
    .select('-password -passwordChangedAt -__v')
    .populate('subscribetionId');

  if (result) {
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'This user not found!');
  }
};

export const AuthServices = {
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
  getMeFromDB,
};
