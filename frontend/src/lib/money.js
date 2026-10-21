const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/**
 * Converts kobo integer to formatted Nigerian Naira string (e.g. ₦ 2,450,000)
 * @param {number} kobo - amount in kobo
 * @returns {string} formatted currency string
 */
export const naira = (kobo) => {
  if (kobo === null || kobo === undefined || isNaN(kobo)) return "₦ 0";
  return formatter.format(kobo / 100);
};

/**
 * Converts kobo to compact display (e.g. ₦ 1.32M or ₦ 450K)
 * @param {number} kobo 
 * @returns {string}
 */
export const formatNairaCompact = (kobo) => {
  if (kobo === null || kobo === undefined || isNaN(kobo)) return "₦ 0";
  const nairaAmount = kobo / 100;
  if (nairaAmount >= 1_000_000) {
    return `₦ ${(nairaAmount / 1_000_000).toFixed(2)}M`;
  }
  if (nairaAmount >= 1_000) {
    return `₦ ${(nairaAmount / 1_000).toFixed(1)}K`;
  }
  return formatter.format(nairaAmount);
};

/**
 * Converts naira decimal or string into integer kobo for API payload
 * @param {number|string} nairaInput 
 * @returns {number} kobo integer
 */
export const nairaToKobo = (nairaInput) => {
  if (!nairaInput) return 0;
  const cleaned = String(nairaInput).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100);
};

/**
 * Converts kobo to naira number
 * @param {number} kobo
 * @returns {number}
 */
export const koboToNaira = (kobo) => {
  if (!kobo) return 0;
  return kobo / 100;
};
