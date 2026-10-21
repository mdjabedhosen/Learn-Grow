const BENGALI_DIGITS: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Converts English digits in a string or number to Bengali digits.
 * Example: 2999 -> "২,৯৯৯", "Save ৳1,750" -> "Save ৳১,৭৫০"
 */
export const toBengaliDigits = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
};

/**
 * Formats a number with commas and converts to Bengali digits if language is "bn".
 * Example: formatLocalizedNumber(2999, "bn") -> "২,৯৯৯"
 */
export const formatLocalizedNumber = (
  value: number | string | null | undefined,
  language: 'en' | 'bn'
): string => {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return toBengaliDigits(value);

  const formatted = num.toLocaleString('en-US');
  return language === 'bn' ? toBengaliDigits(formatted) : formatted;
};

/**
 * Formats price with currency prefix.
 * Example: formatLocalizedPrice(2999, "bn") -> "৳ ২,৯৯৯"
 * Example: formatLocalizedPrice(2999, "en") -> "৳ 2,999" (or BDT 2,999)
 */
export const formatLocalizedPrice = (
  value: number | string | null | undefined,
  language: 'en' | 'bn',
  currencySymbol: string = '৳'
): string => {
  const formatted = formatLocalizedNumber(value, language);
  return `${currencySymbol} ${formatted}`;
};
