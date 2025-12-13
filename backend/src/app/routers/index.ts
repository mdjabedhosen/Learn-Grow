import { Router } from 'express';
import { loginRouters } from '../models/Auth/auth.router';
import { userRouter } from '../models/UsersRegistration/userRegistration.router';
import { categoryRouters } from '../models/Categories/categories.router';
import { CourseRoutes } from '../models/Course/course.router';
import { LiveClassRoutes } from '../models/LiveClass/liveClass.route';
import { EnrollmentRoutes } from '../models/Enrollment/enrollment.route';
import { SiteContentRoutes } from '../models/SiteContent/siteContent.router';

const router = Router();

const moduleRouters = [
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/auth',
    route: loginRouters,
  },
  {
    path: '/category',
    route: categoryRouters,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/live-classes',
    route: LiveClassRoutes,
  },
  {
    path: '/enrollments',
    route: EnrollmentRoutes,
  },
  {
    path: '/site-content',
    route: SiteContentRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
