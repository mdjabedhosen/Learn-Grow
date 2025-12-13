import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { LiveClassControllers } from './liveClass.controller';
import { LiveClassValidations } from './liveClass.validation';
import auth from '../../middlewares/Auth';
import { USER_ROLE } from '../UsersRegistration/user.constent';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.instructor),
    validateRequest(LiveClassValidations.createLiveClassValidationSchema),
    LiveClassControllers.scheduleClass,
);

router.get(
    '/',
    auth(USER_ROLE.admin),
    LiveClassControllers.getAllClasses,
);

router.get(
    '/my-classes',
    auth(USER_ROLE.instructor, USER_ROLE.student),
    LiveClassControllers.getMyClasses,
);

router.patch(
    '/:id/status',
    auth(USER_ROLE.admin, USER_ROLE.instructor),
    LiveClassControllers.updateStatus,
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.instructor),
    LiveClassControllers.deleteClass,
);

export const LiveClassRoutes = router;
