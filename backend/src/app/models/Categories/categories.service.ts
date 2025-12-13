import AppError from '../../errors/appError';
import { TCategories } from './categories.interface';
import { Categorie } from './categories.model';
import httpStatus from 'http-status-codes';

const categoryCreateIntoDB = async (payload: TCategories) => {
  const categoryExists = await Categorie.findOne({ name: payload?.name });
  if (categoryExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Category already exists! Duplicate Category Name.',
    );
  }

  const result = await Categorie.create(payload);

  return result;
};

const updateCategoryIntoDB = async (
  _id: string,
  payload: Partial<TCategories>,
) => {
  const categoryExists = await Categorie.findById({ _id });
  if (!categoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
  }

  const result = await Categorie.findByIdAndUpdate(_id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const getAllcategoryFromDB = async () => {
  const result = await Categorie.find({ active: true }).sort({ createdAt: -1 });
  return result;
};

const getSingleCategoryFromDB = async (_id: string) => {
  const result = await Categorie.findById({ _id });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
  }
  return result;
};

const categoryDeleteFromDB = async (_id: string) => {
  const categoryExists = await Categorie.findById({ _id });
  if (!categoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
  }

  if (categoryExists.active) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Category already Active! Thats meaan this category have course.',
    );
  }

  const result = await Categorie.findByIdAndUpdate(
    _id,
    { active: false },
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const categoryServices = {
  categoryCreateIntoDB,
  updateCategoryIntoDB,
  getAllcategoryFromDB,
  getSingleCategoryFromDB,
  categoryDeleteFromDB,
};
