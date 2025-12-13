import express from 'express';
import { SiteContentControllers } from './siteContent.controller';
import Auth from '../../middlewares/Auth';

const router = express.Router();

// Get content (Public)
router.get('/:page', SiteContentControllers.getContent);

// Update content (Admin only)
router.post(
    '/',
    Auth('admin', 'superAdmin'),
    SiteContentControllers.updateContent
);

export const SiteContentRoutes = router;
