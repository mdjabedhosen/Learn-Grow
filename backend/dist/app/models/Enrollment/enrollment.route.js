"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enrollment_controller_1 = require("./enrollment.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const router = express_1.default.Router();
router.post('/', (0, Auth_1.default)(user_constent_1.USER_ROLE.student), enrollment_controller_1.EnrollmentControllers.enroll);
router.get('/my-enrollments', (0, Auth_1.default)(user_constent_1.USER_ROLE.student), enrollment_controller_1.EnrollmentControllers.getMyEnrollments);
exports.EnrollmentRoutes = router;
