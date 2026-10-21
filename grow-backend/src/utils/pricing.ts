/**
 * Pure, deterministic pricing helpers for a course list price + optional discounted price.
 *
 * SEMANTICS
 *  - `price` is the ORIGINAL / list price of the course (e.g. Python 2999, Robotics 3499).
 *  - `discountPrice` is the price AFTER the discount (e.g. 1799 => 40% off 2999).
 *  - A missing / null / 0 / negative `discountPrice`, or one that is >= `price`,
 *    means "no discount" => the effective price is the list price.
 *  - The discount PERCENTAGE is always DERIVED, never stored:
 *    `Math.round((1 - discountPrice / price) * 100)`.
 *  - The effective price (what the customer pays) is `discountPrice ?? price`.
 *
 * Every function here is pure: it never mutates its input, never reads the clock
 * and never uses randomness, so the same input always yields the same output.
 */

/** Minimal shape of a course record required to derive pricing. */
export interface PricedCourse {
  price?: number | null;
  discountPrice?: number | null;
}

/** Fully derived pricing breakdown for a course. */
export interface CoursePricing {
  /** The list price (course.price). */
  originalPrice: number;
  /** The discounted price, or null when the course has no valid discount. */
  discountPrice: number | null;
  /** What the customer actually pays: `discountPrice ?? price`. */
  effectivePrice: number;
  /** Derived discount percentage; 0 when there is no discount. */
  discountPercent: number;
  /** True only when a valid (strictly lower) discount price was found. */
  hasDiscount: boolean;
}

/** Result of validating a proposed discount price against the list price. */
export interface DiscountValidation {
  /** True when the discount price may be stored on the course. */
  valid: boolean;
  /** Human readable reason, present only when `valid` is false. */
  error?: string;
}

/**
 * An already server-side validated coupon (the shape returned by
 * `validateCoupon` in the coupon service). The pricing helpers never look a
 * coupon up themselves - they only apply a discount that was already verified.
 */
export interface ValidatedCoupon {
  code: string;
  discountAmount: number;
}

/** Authoritative price breakdown for a "single" course purchase. */
export interface SingleCourseOrderPricing {
  /** Amount charged before any coupon: the effective course price. */
  originalPrice: number;
  /** Coupon discount applied on top of `originalPrice` (0 when no coupon). */
  discountAmount: number;
  /** Normalised (trimmed + uppercased) coupon code, undefined when no coupon. */
  couponCode?: string;
  /** Final amount the customer pays. */
  price: number;
  /** The course list price, kept for audit trails / "x% off" badges. */
  courseOriginalPrice: number;
  /** Derived course level discount percentage, for audit trails / badges. */
  courseDiscountPercent: number;
}

/**
 * Converts an arbitrary value into a finite number.
 * Returns null for null/undefined, non numeric values and NaN / Infinity.
 */
const toFiniteNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Normalises a price into a usable non negative number.
 * Missing or invalid prices collapse to 0 so callers never have to deal with
 * NaN / undefined.
 */
export const normalizePrice = (value: unknown): number => {
  const parsed = toFiniteNumber(value);
  if (parsed === null || parsed < 0) return 0;
  return parsed;
};

/**
 * Resolves the discount price of a course.
 *
 * A discount price is only honoured when it is a real discount, i.e. it is
 * strictly greater than 0 AND strictly less than the list price. Anything else
 * (null, undefined, 0, negative, >= price) means "no discount" and yields null.
 */
export const resolveDiscountPrice = (
  price: unknown,
  discountPrice: unknown
): number | null => {
  const listPrice = toFiniteNumber(price);
  const candidate = toFiniteNumber(discountPrice);

  if (candidate === null) return null; // no discount configured
  if (candidate <= 0) return null; // 0 / negative => no discount
  if (listPrice === null || listPrice <= 0) return null; // nothing to discount
  if (candidate >= listPrice) return null; // a "discount" that raises the price is invalid

  return candidate;
};

/**
 * Derives the complete pricing breakdown of a course.
 *
 * `price` is the list price, `discountPrice` the price after the discount.
 * The discount percentage is derived (never read from storage) and the
 * effective price is `discountPrice ?? price`. Invalid discounts are ignored
 * so that a corrupt course record can never make a customer pay more.
 */
export const getCoursePricing = (
  course: PricedCourse | null | undefined
): CoursePricing => {
  const originalPrice = normalizePrice(course?.price);
  const discountPrice = resolveDiscountPrice(course?.price, course?.discountPrice);
  const hasDiscount = discountPrice !== null;
  const effectivePrice = hasDiscount ? (discountPrice as number) : originalPrice;

  const discountPercent =
    hasDiscount && originalPrice > 0
      ? Math.round((1 - (discountPrice as number) / originalPrice) * 100)
      : 0;

  return {
    originalPrice,
    discountPrice,
    effectivePrice,
    discountPercent,
    hasDiscount,
  };
};

/**
 * Validates a proposed discount price against the list price of a course.
 *
 * A discount price is only accepted when it is >= 0 and strictly less than the
 * list price. `null` / `undefined` means "no discount" and is always valid;
 * 0 is valid as well because 0 simply means "no discount".
 */
export const validateDiscountPrice = (
  price: unknown,
  discountPrice: unknown
): DiscountValidation => {
  const listPrice = toFiniteNumber(price);

  if (listPrice === null) {
    return { valid: false, error: "Price is required" };
  }
  if (listPrice < 0) {
    return { valid: false, error: "Price cannot be negative" };
  }

  if (discountPrice === null || discountPrice === undefined) {
    return { valid: true };
  }

  const candidate = toFiniteNumber(discountPrice);
  if (candidate === null) {
    return { valid: false, error: "Discount price must be a number" };
  }
  if (candidate < 0) {
    return { valid: false, error: "Discount price cannot be negative" };
  }
  if (candidate === 0) {
    // 0 means "no discount", there is nothing to compare it against.
    return { valid: true };
  }
  if (candidate >= listPrice) {
    return {
      valid: false,
      error: "Discount price must be less than the original price",
    };
  }

  return { valid: true };
};

/**
 * Derives the authoritative price breakdown for a "single" course purchase.
 *
 * The COURSE RECORD is the only source of truth for the base amount: the
 * effective course price (`course.discountPrice ?? course.price`) is used and
 * a client supplied price is never accepted. An already validated coupon is
 * then applied ON TOP of that effective price.
 *
 * `originalPrice` is the amount charged before the coupon (i.e. the effective
 * course price), `discountAmount` is the coupon discount and `price` is the
 * final amount the customer pays.
 */
export const deriveSingleCourseOrderPricing = (
  course: PricedCourse | null | undefined,
  coupon?: ValidatedCoupon | null
): SingleCourseOrderPricing => {
  const coursePricing = getCoursePricing(course);
  const baseAmount = coursePricing.effectivePrice;

  let discountAmount = 0;
  let couponCode: string | undefined;

  if (coupon && typeof coupon.code === "string" && coupon.code.trim().length > 0) {
    couponCode = coupon.code.trim().toUpperCase();
    const rawDiscount = toFiniteNumber(coupon.discountAmount) ?? 0;
    // A coupon can never push the order below zero.
    discountAmount = Math.max(0, Math.min(rawDiscount, baseAmount));
  }

  return {
    originalPrice: baseAmount,
    discountAmount,
    couponCode,
    price: Math.max(0, baseAmount - discountAmount),
    courseOriginalPrice: coursePricing.originalPrice,
    courseDiscountPercent: coursePricing.discountPercent,
  };
};
