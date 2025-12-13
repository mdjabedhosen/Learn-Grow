import { model, Schema } from 'mongoose';
import { TCategories } from './categories.interface';

const categorySchema = new Schema<TCategories>(
  {
    name: { type: String },
    active: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Categorie = model<TCategories>('Categorie', categorySchema);
