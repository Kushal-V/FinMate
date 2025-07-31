// frontend/utils/smsParser.js

/**
 * Parses a given SMS message body to extract expense details.
 * This function tries multiple patterns to support different SMS formats.
 * @param {string} message The body of the SMS.
 * @returns {object|null} An object with amount, name, and date, or null if not an expense.
 */
export function parseExpenseFromSms(message) {
  // Pattern 1: Multi-line bank alert format (e.g., HDFC Bank)
  // ✅ THE FIX IS HERE: The part to capture the name is now `([^\n\r]+)`.
  // This means "capture all characters until you hit a new line", which is much more precise.
  const multiLinePattern = /Sent\s+(?:Rs\.?|₹)\s*([\d,]+\.?\d*)\s*[\s\S]*?To\s+([^\n\r]+)[\s\S]*?On\s+(\d{2}\/\d{2}\/\d{2})/i;

  // Pattern 2: Simple, single-line format
  const singleLinePattern = /(?:debited|spent|charged|paid|sent)\s*(?:by|for)?\s*(?:(?:INR|Rs\.?|₹)\s*)?([\d,]+(?:\.\d{1,2})?)\s*(?:to|at|on)\s+([a-z0-9\s&'-]+)/i;

  let match = message.match(multiLinePattern);

  if (match) {
    // Matched the multi-line bank alert
    const amount = parseFloat(match[1].replace(/,/g, ''));
    const name = match[2].trim();
    const dateParts = match[3].split('/'); // "31/07/25" -> ["31", "07", "25"]
    const date = new Date(`20${dateParts[2]}`, dateParts[1] - 1, dateParts[0]);

    if (isNaN(amount) || amount === 0) return null;
    return { amount, name, date };
  }

  // If the first pattern didn't match, try the second one
  match = message.match(singleLinePattern);

  if (match) {
    // Matched the simple, single-line format
    const amount = parseFloat(match[1].replace(/,/g, ''));
    const name = match[2].trim();
    const date = new Date();

    if (isNaN(amount) || amount === 0) return null;
    return { amount, name, date };
  }

  // If no patterns match, return null
  return null;
}
