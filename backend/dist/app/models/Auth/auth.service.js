"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("../UsersRegistration/userRegistration.model");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config/config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendSMS_1 = require("../../utils/sendSMS");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ phone: payload.phone });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found! Check your Phone Number.');
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.status) === 'Block') {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Your account temporary Blocked. Please contact with admin.');
    }
    ///====> checking if the password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Incorrect password!');
    }
    if (!(isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.verified)) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'You are not verified. Please verify your account.');
    }
    //-====> access granted: send accessToken, RefreshToken
    const jwtPayload = {
        _id: isUserExists._id,
        phone: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.phone,
        role: isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.role,
    };
    //===========> create token and sent to the client
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //===========> create refresh token and sent to the client
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_access_expires_in);
    const userInformation = yield userRegistration_model_1.User.findOne({ phone: payload.phone })
        .select('-password -createdAt -updatedAt -passwordChangedAt') // Exclude password, createdAt, and updatedAt from the User document
        .exec();
    return {
        user: userInformation,
        token: accessToken,
        refreshToken: refreshToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //===>check if the user is exists
    const isUserExists = yield userRegistration_model_1.User.findOne({ phone: userData.phone });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
    }
    const currentPassword = payload === null || payload === void 0 ? void 0 : payload.currentPassword;
    const hashpassword = isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.password;
    ///====> checking if the given password and exists password is correct
    const isPasswordMatch = yield userRegistration_model_1.User.isPasswordMatched(currentPassword, hashpassword);
    if (!isPasswordMatch) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Incorrect password!');
    }
    // ===> hash new password
    const newHasedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
    yield userRegistration_model_1.User.findOneAndUpdate({
        phone: userData.phone,
    }, {
        password: newHasedPassword,
        passwordChangedAt: new Date(),
    });
    return null;
});
const forgetPassword = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield userRegistration_model_1.User.findOne({ phone: phone });
    if (!isUserExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'No Account found. Please check your phone.');
    }
    const res = yield (0, sendSMS_1.sendVerificationCode)(phone);
    if (res === null || res === void 0 ? void 0 : res.success) {
        return res === null || res === void 0 ? void 0 : res.serviceSid;
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, (res === null || res === void 0 ? void 0 : res.message)
            ? res === null || res === void 0 ? void 0 : res.message
            : 'Error sending verification code for change password.');
    }
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, sendSMS_1.verifyCode)(payload === null || payload === void 0 ? void 0 : payload.phone, payload === null || payload === void 0 ? void 0 : payload.code, payload === null || payload === void 0 ? void 0 : payload.verifyServiceSid);
    if (res === null || res === void 0 ? void 0 : res.success) {
        //===> hash new password
        const newHasedPassword = yield bcryptjs_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_round));
        yield userRegistration_model_1.User.findOneAndUpdate({
            phone: payload.phone,
        }, {
            password: newHasedPassword,
            passwordChangedAt: new Date(),
        }, {
            new: true,
            runValidators: true,
        });
        return 'Your Password Changed Successfully';
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, (res === null || res === void 0 ? void 0 : res.message) ? res === null || res === void 0 ? void 0 : res.message : 'Invalid verification code.');
    }
});
const getMeFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield userRegistration_model_1.User.findOne({ email: email })
        .select('-password -passwordChangedAt -__v')
        .populate('subscribetionId');
    if (result) {
        return result;
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'This user not found!');
    }
});
exports.AuthServices = {
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword,
    getMeFromDB,
};
