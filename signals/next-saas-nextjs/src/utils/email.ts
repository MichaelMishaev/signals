/**
 * Email Utility Functions
 * Handles email normalization and validation
 */

/**
 * Normalize email address for consistent comparison
 * - Converts to lowercase
 * - Trims whitespace
 * - Handles gmail dot notation (optional)
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';

  // Trim and lowercase
  let normalized = email.trim().toLowerCase();

  // Gmail-specific: Remove dots in username (before @)
  // Gmail ignores dots, so john.doe@gmail.com = johndoe@gmail.com
  if (normalized.endsWith('@gmail.com') || normalized.endsWith('@googlemail.com')) {
    const [username, domain] = normalized.split('@');
    normalized = username.replace(/\./g, '') + '@' + domain;
  }

  return normalized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email domain looks suspicious (common typos)
 */
export function checkEmailDomain(email: string): { valid: boolean; suggestion?: string } {
  const normalized = normalizeEmail(email);
  const domain = normalized.split('@')[1];

  const commonDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'protonmail.com',
  ];

  const commonTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'outloo.com': 'outlook.com',
    'hotmial.com': 'hotmail.com',
  };

  if (commonTypos[domain]) {
    return {
      valid: false,
      suggestion: email.replace(domain, commonTypos[domain]),
    };
  }

  return { valid: true };
}
