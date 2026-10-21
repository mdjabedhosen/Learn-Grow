import slugify from "slugify";
import { Category } from "../model/category.model";
import { pickDefined } from "@/utils/pickFields";

/**
 * Editable category fields. `slug` is derived from `name` by the service and
 * the timestamps are owned by Mongoose.
 */
const CATEGORY_UPDATABLE_FIELDS = ["name", "description", "isActive"] as const;

export const createCategory = async (data: any) => {
  const slug = slugify(data.name, { lower: true });
  return Category.create({ ...data, slug });
};

export const getAllCategories = () => {
  return Category.find().sort({ createdAt: -1 });
};

export const getCategoryById = (id: string) => {
  return Category.findById(id);
};

export const updateCategory = async (id: string, data: any) => {
  const safeData = pickDefined(data, CATEGORY_UPDATABLE_FIELDS);
  if (safeData.name) {
    safeData.slug = slugify(safeData.name, { lower: true });
  }
  return Category.findByIdAndUpdate(id, safeData, { new: true });
};

export const deleteCategory = (id: string) => {
  return Category.findByIdAndDelete(id);
};
