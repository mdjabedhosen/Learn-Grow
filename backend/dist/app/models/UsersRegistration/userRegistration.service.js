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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errors/appError"));
const userRegistration_model_1 = require("./userRegistration.model");
const user_constent_1 = require("./user.constent");
const auth_utils_1 = require("../Auth/auth.utils");
const config_1 = __importDefault(require("../../config/config"));
const sendSMS_1 = require("../../utils/sendSMS");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendSMS = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExistswithPhone = yield userRegistration_model_1.User.findOne({ phone: payload === null || payload === void 0 ? void 0 : payload.phone });
    if (userExistswithPhone) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User already exists! Duplicate Phone Number.');
    }
    const res = yield (0, sendSMS_1.sendVerificationCode)(payload === null || payload === void 0 ? void 0 : payload.phone);
    if (res === null || res === void 0 ? void 0 : res.success) {
        return res === null || res === void 0 ? void 0 : res.serviceSid;
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, (res === null || res === void 0 ? void 0 : res.message) ? res === null || res === void 0 ? void 0 : res.message : 'Error sending verification code');
    }
});
const ReSendSMS = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExistswithPhone = yield userRegistration_model_1.User.findOne({ phone: payload === null || payload === void 0 ? void 0 : payload.phone });
    if (userExistswithPhone === null || userExistswithPhone === void 0 ? void 0 : userExistswithPhone.verified) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User already verified. Please login.');
    }
    const res = yield (0, sendSMS_1.sendVerificationCode)(payload === null || payload === void 0 ? void 0 : payload.phone);
    if (res === null || res === void 0 ? void 0 : res.success) {
        return res === null || res === void 0 ? void 0 : res.serviceSid;
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, (res === null || res === void 0 ? void 0 : res.message) ? res === null || res === void 0 ? void 0 : res.message : 'Error sending verification code');
    }
});
const verifySMS = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // const smsCode = sendVerificationCode(phone);
    const res = yield (0, sendSMS_1.verifyCode)(payload === null || payload === void 0 ? void 0 : payload.phone, payload === null || payload === void 0 ? void 0 : payload.code, payload === null || payload === void 0 ? void 0 : payload.verifyServiceSid);
    if (res === null || res === void 0 ? void 0 : res.success) {
        const userInfo = {
            phone: payload === null || payload === void 0 ? void 0 : payload.phone,
            role: user_constent_1.USER_ROLE.student,
        };
        yield userRegistration_model_1.User.create(userInfo);
        return res.message;
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.UNAUTHORIZED, (res === null || res === void 0 ? void 0 : res.message) ? res === null || res === void 0 ? void 0 : res.message : 'Invalid verification code.');
    }
});
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (userExists) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'This email already exists! Please try with another email.');
    }
    if (!payload.password) {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Password is required. Please provide a password.');
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.role) === 'superAdmin' || (payload === null || payload === void 0 ? void 0 : payload.role) === 'admin') {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Only Super admin can create Admin or Super Admin account.');
    }
    // ===> hash new password
    const newHasedPassword = yield bcryptjs_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_round));
    const userInfo = Object.assign(Object.assign({}, payload), { password: newHasedPassword, verified: true, passwordChangedAt: new Date() });
    const user = yield userRegistration_model_1.User.findOneAndUpdate({ phone: payload.phone }, userInfo, {
        new: true,
        runValidators: true,
    }).select('-password');
    if (user) {
        const jwtPayload = {
            _id: user._id,
            phone: user.phone,
            role: user === null || user === void 0 ? void 0 : user.role,
        };
        //===========> create token and sent to the client
        const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        //===========> create refresh token and sent to the client
        const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_access_expires_in);
        return {
            user: user,
            token: accessToken,
            refreshToken: refreshToken,
        };
    }
    else {
        throw new appError_1.default(http_status_codes_1.default.BAD_REQUEST, 'User Not Found, Please check your phone number.');
    }
});
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.find().select('-password');
    return userExists;
});
const getSingleUserFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield userRegistration_model_1.User.findById({ _id }).select('-password');
    if (!result) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User Information is not found.');
    }
    return result;
});
const getMeFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findOne({ email: email });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User Information is not found.');
    }
    return userExists;
});
const updateUserFromDB = (_id, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield userRegistration_model_1.User.findById({ _id });
    if (!userExists) {
        throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, 'User Information is not found.');
    }
    const existEmail = yield userRegistration_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    if (existEmail) {
        throw new appError_1.default(http_status_codes_1.default.FORBIDDEN, 'Duplicate Email address.');
    }
    const result = yield userRegistration_model_1.User.findByIdAndUpdate(_id, payload, {
        new: true,
        runValidators: true,
    }).select('-password');
    return result;
});
exports.UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateUserFromDB,
    getMeFromDB,
    sendSMS,
    verifySMS,
    ReSendSMS,
};
