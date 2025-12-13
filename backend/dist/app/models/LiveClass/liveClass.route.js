"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveClassRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const liveClass_controller_1 = require("./liveClass.controller");
const liveClass_validation_1 = require("./liveClass.validation");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_constent_1 = require("../UsersRegistration/user.constent");
const router = express_1.default.Router();
router.post('/', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.instructor), (0, validateRequest_1.default)(liveClass_validation_1.LiveClassValidations.createLiveClassValidationSchema), liveClass_controller_1.LiveClassControllers.scheduleClass);
router.get('/', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin), liveClass_controller_1.LiveClassControllers.getAllClasses);
router.get('/my-classes', (0, Auth_1.default)(user_constent_1.USER_ROLE.instructor, user_constent_1.USER_ROLE.student), liveClass_controller_1.LiveClassControllers.getMyClasses);
router.patch('/:id/status', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.instructor), liveClass_controller_1.LiveClassControllers.updateStatus);
router.delete('/:id', (0, Auth_1.default)(user_constent_1.USER_ROLE.admin, user_constent_1.USER_ROLE.instructor), liveClass_controller_1.LiveClassControllers.deleteClass);
exports.LiveClassRoutes = router;
