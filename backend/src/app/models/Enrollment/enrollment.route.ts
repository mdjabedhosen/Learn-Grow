import express from 'express';
import { EnrollmentControllers } from './enrollment.controller';
import auth from '../../middlewares/Auth';
import { USER_ROLE } from '../UsersRegistration/user.constent';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.student),
    EnrollmentControllers.enroll,
);

router.get(
    '/my-enrollments',
    auth(USER_ROLE.student),
    EnrollmentControllers.getMyEnrollments,
);

export const EnrollmentRoutes = router;
