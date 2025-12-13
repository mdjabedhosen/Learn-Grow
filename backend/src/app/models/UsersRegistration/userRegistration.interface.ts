/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TUser = {
  _id: string;
  student_name?: string;
  guardian_name?: string;
  phone: string;
  class?: string;
  age?: number;
  institution?: string;
  gender?: string;
  email?: string;
  password?: string;
  address?: string;
  img?: string;
  verified: boolean;
  role: 'superAdmin' | 'admin' | 'student' | 'guardian' | 'instructor';
  status: 'Active' | 'Block';
  passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hasPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
