"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_controller_1 = require("./course.controller");
const course_validation_1 = require("./course.validation");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const router = express_1.default.Router();
router.post('/', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.instructor), (0, validateRequest_1.default)(course_validation_1.CourseValidations.createCourseValidationSchema), course_controller_1.CourseControllers.createCourse);
router.get('/', course_controller_1.CourseControllers.getAllCourses);
router.get('/:id', course_controller_1.CourseControllers.getSingleCourse);
router.patch('/:id', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.instructor), (0, validateRequest_1.default)(course_validation_1.CourseValidations.updateCourseValidationSchema), course_controller_1.CourseControllers.updateCourse);
router.delete('/:id', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin), course_controller_1.CourseControllers.deleteCourse);
exports.CourseRoutes = router;
