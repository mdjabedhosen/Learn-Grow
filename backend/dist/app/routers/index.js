"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = require("../models/Auth/auth.router");
const userRegistration_router_1 = require("../models/UsersRegistration/userRegistration.router");
const categories_router_1 = require("../models/Categories/categories.router");
const course_router_1 = require("../models/Course/course.router");
const liveClass_route_1 = require("../models/LiveClass/liveClass.route");
const enrollment_route_1 = require("../models/Enrollment/enrollment.route");
const siteContent_router_1 = require("../models/SiteContent/siteContent.router");
const router = (0, express_1.Router)();
const moduleRouters = [
    {
        path: '/user',
        route: userRegistration_router_1.userRouter,
    },
    {
        path: '/auth',
        route: auth_router_1.loginRouters,
    },
    {
        path: '/category',
        route: categories_router_1.categoryRouters,
    },
    {
        path: '/courses',
        route: course_router_1.CourseRoutes,
    },
    {
        path: '/live-classes',
        route: liveClass_route_1.LiveClassRoutes,
    },
    {
        path: '/enrollments',
        route: enrollment_route_1.EnrollmentRoutes,
    },
    {
        path: '/site-content',
        route: siteContent_router_1.SiteContentRoutes,
    },
];
moduleRouters.forEach((route) => router.use(route.path, route.route));
exports.default = router;
