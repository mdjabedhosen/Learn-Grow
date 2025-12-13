import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import auth from '../../middlewares/Auth';
import { USER_ROLE } from '../UsersRegistration/user.constent';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.instructor),
    validateRequest(CourseValidations.createCourseValidationSchema),
    CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get('/:id', CourseControllers.getSingleCourse);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.instructor),
    validateRequest(CourseValidations.updateCourseValidationSchema),
    CourseControllers.updateCourse,
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin),
    CourseControllers.deleteCourse,
);

export const CourseRoutes = router;
