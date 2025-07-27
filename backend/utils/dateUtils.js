const moment = require('moment');

/**
 * Parse a date string in allowed formats and return ISO YYYY-MM-DD.
 * Accepts dd-mm-yyyy, mm-dd-yyyy, yyyy-mm-dd and single-digit variants.
 * Returns null if invalid.
 */
function normalizeDate(dateStr) {
  if (typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  const formats = ['DD-MM-YYYY', 'D-M-YYYY', 'MM-DD-YYYY', 'M-D-YYYY', 'YYYY-MM-DD'];
  const parsed = moment(trimmed, formats, true);
  if (!parsed.isValid()) {
    return null;
  }
  return parsed.format('YYYY-MM-DD');
}

module.exports = { normalizeDate };
