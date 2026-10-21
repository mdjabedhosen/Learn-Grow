/**
 * Tests for the pure course pricing helpers used by the frontend.
 *
 * These lock the shared pricing contract that mirrors
 * `grow-backend/src/utils/pricing.ts` so both sides cannot drift apart.
 *
 * Run with:
 *   cd learn-grow && node --require sucrase/register/ts --test utils/__tests__/pricing.test.ts
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  getCoursePricing,
  validateDiscountPrice,
  resolveDiscountPrice,
  normalizePrice,
} from '../pricing';

describe('getCoursePricing', () => {
  test('returns the list price when the course has no discount', () => {
    const pricing = getCoursePricing({ price: 2999 });

    assert.equal(pricing.originalPrice, 2999);
    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 2999);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('treats an undefined discount price as no discount', () => {
    const pricing = getCoursePricing({ price: 2999, discountPrice: undefined });

    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 2999);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('treats a null discount price as no discount', () => {
    const pricing = getCoursePricing({ price: 2999, discountPrice: null });

    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 2999);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('treats a discount price of 0 as no discount (not as 100% off)', () => {
    const pricing = getCoursePricing({ price: 2999, discountPrice: 0 });

    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 2999);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('derives the effective price and percentage from a valid discount', () => {
    const pricing = getCoursePricing({ price: 2999, discountPrice: 1799 });

    assert.equal(pricing.originalPrice, 2999);
    assert.equal(pricing.discountPrice, 1799);
    assert.equal(pricing.effectivePrice, 1799);
    assert.equal(pricing.discountPercent, 40);
    assert.equal(pricing.hasDiscount, true);
  });

  test('derives 40% off for the robotics course pricing', () => {
    const pricing = getCoursePricing({ price: 3499, discountPrice: 2099 });

    assert.equal(pricing.effectivePrice, 2099);
    assert.equal(pricing.discountPercent, 40);
    assert.equal(pricing.hasDiscount, true);
  });

  test('handles a free course (price 0)', () => {
    const pricing = getCoursePricing({ price: 0 });

    assert.equal(pricing.originalPrice, 0);
    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 0);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('handles a missing price (treated as 0)', () => {
    const pricing = getCoursePricing({});

    assert.equal(pricing.originalPrice, 0);
    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 0);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('handles a null / undefined course', () => {
    for (const input of [null, undefined]) {
      const pricing = getCoursePricing(input);

      assert.equal(pricing.originalPrice, 0);
      assert.equal(pricing.discountPrice, null);
      assert.equal(pricing.effectivePrice, 0);
      assert.equal(pricing.discountPercent, 0);
      assert.equal(pricing.hasDiscount, false);
    }
  });

  test('ignores a discount price that is greater than or equal to the price', () => {
    const pricing = getCoursePricing({ price: 2999, discountPrice: 2999 });

    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 2999);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('ignores a discount price that is greater than the price', () => {
    const pricing = getCoursePricing({ price: 2999, discountPrice: 3500 });

    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 2999);
    assert.equal(pricing.hasDiscount, false);
  });

  test('ignores a negative discount price', () => {
    const pricing = getCoursePricing({ price: 2999, discountPrice: -500 });

    assert.equal(pricing.discountPrice, null);
    assert.equal(pricing.effectivePrice, 2999);
    assert.equal(pricing.discountPercent, 0);
    assert.equal(pricing.hasDiscount, false);
  });

  test('supports a non integer discount price', () => {
    const pricing = getCoursePricing({ price: 100, discountPrice: 99.5 });

    assert.equal(pricing.discountPrice, 99.5);
    assert.equal(pricing.effectivePrice, 99.5);
    assert.equal(pricing.hasDiscount, true);
    assert.equal(pricing.discountPercent, 1); // Math.round((1 - 0.995) * 100)
  });

  test('does not mutate the course it is given', () => {
    const course = { price: 2999, discountPrice: 1799 };
    const snapshot = { ...course };

    getCoursePricing(course);

    assert.deepEqual(course, snapshot);
  });

  test('is deterministic for the same input', () => {
    const course = { price: 3499, discountPrice: 2099 };

    assert.deepEqual(getCoursePricing(course), getCoursePricing(course));
  });
});

describe('normalizePrice', () => {
  test('keeps valid prices', () => {
    assert.equal(normalizePrice(2999), 2999);
    assert.equal(normalizePrice(0), 0);
    assert.equal(normalizePrice(99.5), 99.5);
  });

  test('collapses missing / invalid prices to 0', () => {
    assert.equal(normalizePrice(undefined), 0);
    assert.equal(normalizePrice(null), 0);
    assert.equal(normalizePrice(-100), 0);
    assert.equal(normalizePrice(NaN), 0);
    assert.equal(normalizePrice(Infinity), 0);
  });
});

describe('resolveDiscountPrice', () => {
  test('returns the discount price only when it is a real discount', () => {
    assert.equal(resolveDiscountPrice(2999, 1799), 1799);
  });

  test('returns null for every non-discount value', () => {
    assert.equal(resolveDiscountPrice(2999, undefined), null);
    assert.equal(resolveDiscountPrice(2999, null), null);
    assert.equal(resolveDiscountPrice(2999, 0), null);
    assert.equal(resolveDiscountPrice(2999, -1), null);
    assert.equal(resolveDiscountPrice(2999, 2999), null);
    assert.equal(resolveDiscountPrice(2999, 3000), null);
    assert.equal(resolveDiscountPrice(0, 100), null);
    assert.equal(resolveDiscountPrice(undefined, 100), null);
  });
});

describe('validateDiscountPrice', () => {
  test('accepts a discount price that is strictly below the price', () => {
    const result = validateDiscountPrice(2999, 1799);

    assert.equal(result.valid, true);
    assert.equal(result.error, undefined);
  });

  test('accepts a missing discount price (no discount)', () => {
    assert.equal(validateDiscountPrice(2999, undefined).valid, true);
    assert.equal(validateDiscountPrice(2999, null).valid, true);
  });

  test('accepts a discount price of 0 (means no discount)', () => {
    assert.equal(validateDiscountPrice(2999, 0).valid, true);
    assert.equal(validateDiscountPrice(0, 0).valid, true);
  });

  test('rejects a discount price equal to the price', () => {
    const result = validateDiscountPrice(2999, 2999);

    assert.equal(result.valid, false);
    assert.match(result.error as string, /less than/i);
  });

  test('rejects a discount price greater than the price', () => {
    const result = validateDiscountPrice(2999, 3000);

    assert.equal(result.valid, false);
    assert.match(result.error as string, /less than/i);
  });

  test('rejects a negative discount price', () => {
    const result = validateDiscountPrice(2999, -100);

    assert.equal(result.valid, false);
    assert.match(result.error as string, /negative/i);
  });

  test('rejects a non numeric discount price', () => {
    const result = validateDiscountPrice(2999, 'abc');

    assert.equal(result.valid, false);
    assert.match(result.error as string, /number/i);
  });

  test('rejects a missing price', () => {
    const result = validateDiscountPrice(undefined, 100);

    assert.equal(result.valid, false);
    assert.match(result.error as string, /required/i);
  });

  test('rejects a negative price', () => {
    const result = validateDiscountPrice(-1, undefined);

    assert.equal(result.valid, false);
    assert.match(result.error as string, /negative/i);
  });
});
