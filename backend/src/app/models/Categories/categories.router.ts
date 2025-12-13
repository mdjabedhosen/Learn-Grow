import express from 'express';
import ValidateRequest from '../../middlewares/validateRequest';
import Auth from '../../middlewares/Auth';
import { categoryValidations } from './categories.validation';
import { categoryControllers } from './categories.controller';
const router = express.Router();

router.post(
  '/create-category',
  Auth('superAdmin', 'admin'),
  ValidateRequest(categoryValidations.categoryValidationSchema),
  categoryControllers.createCategory,
);

router.patch(
  '/update-category/:_id',
  Auth('superAdmin', 'admin'),
  ValidateRequest(categoryValidations.categoryValidationSchema),
  categoryControllers.updateCategory,
);

router.get(
  '/get-all-category',
  Auth('superAdmin', 'admin'),
  categoryControllers.getAllCategory,
);

router.get(
  '/get-single-category/:_id',
  Auth('superAdmin', 'admin'),
  categoryControllers.getSingleCategory,
);

router.delete(
  '/delete-category/:_id',
  Auth('superAdmin', 'admin'),
  categoryControllers.categoryDelete,
);

export const categoryRouters = router;
