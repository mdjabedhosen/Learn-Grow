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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config/config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.Schema({
    student_name: { type: String },
    guardian_name: { type: String },
    phone: { type: String, required: true, unique: true },
    class: { type: String },
    age: { type: Number },
    institution: { type: String },
    gender: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    address: { type: String },
    img: { type: String },
    verified: { type: Boolean },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'student', 'guardian', 'instructor'],
        default: 'student',
    },
    status: {
        type: String,
        enum: ['Active', 'Block'],
        default: 'Active',
    },
    passwordChangedAt: { type: Date, select: false },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        //==========> Hash the current password if it exists
        if (user.password && typeof user.password === 'string') {
            user.password = yield bcryptjs_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_round));
        }
        next();
    });
});
userSchema.statics.isPasswordMatched = function (plainTextPassword, hasPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(plainTextPassword, hasPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
