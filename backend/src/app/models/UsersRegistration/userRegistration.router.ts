import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import { UserValidations } from './userRegistration.validation';
import { userControllers } from './userRegistration.controller';
import Auth from '../../middlewares/Auth';
const router = express.Router();

router.post('/send-otp', userControllers.sendOTP);

router.post('/resend-otp', userControllers.ReSendOTP);

router.post('/verify-sms', userControllers.verifySMS);
router.post('/user-create', userControllers.createUsers);

router.get(
  '/get-me',
  Auth('superAdmin', 'admin', 'student', 'guardian', 'instructor'),
  userControllers.getMe,
);
router.get('/', Auth('admin', 'superAdmin'), userControllers.getAllUsers);
router.get('/:id', Auth('admin', 'superAdmin'), userControllers.getSingleUser);

router.patch(
  '/update-user/:id',
  Auth('superAdmin', 'admin', 'student', 'guardian', 'instructor'),
  ValidateRequest(UserValidations.updateUserValidationSchema),
  userControllers.updateUsers,
);

export const userRouter = router;
