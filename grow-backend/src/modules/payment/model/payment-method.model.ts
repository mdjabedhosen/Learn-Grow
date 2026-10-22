import { Schema, model } from "mongoose";

export interface IPaymentMethod {
  name: string;
  accountNumber: string;
  paymentNote: string;
  /**
   * Bank transfer details.
   *
   * These used to live inside the free-text `paymentNote` field, which meant
   * the checkout page had to show a blob of text and the admin could not
   * manage the details as data. They are first-class fields now so the
   * checkout can present them as a labelled block and the admin panel can
   * edit them one by one.
   */
  accountName?: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  swiftCode?: string;
  isActive: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentMethodSchema = new Schema<IPaymentMethod>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    paymentNote: {
      type: String,
      required: true,
      trim: true,
    },
    accountName: {
      type: String,
      trim: true,
      default: "",
    },
    bankName: {
      type: String,
      trim: true,
      default: "",
    },
    branchName: {
      type: String,
      trim: true,
      default: "",
    },
    routingNumber: {
      type: String,
      trim: true,
      default: "",
    },
    swiftCode: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for ordering
paymentMethodSchema.index({ order: 1 });

export const PaymentMethod = model<IPaymentMethod>(
  "PaymentMethod",
  paymentMethodSchema
);
