export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone) {
  const re = /^\+?[\d\s-()]{10,}$/;
  return re.test(phone);
}

export function validateRequired(value) {
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

export function validateMinLength(value, min) {
  return value && value.length >= min;
}

export function validateMaxLength(value, max) {
  return value && value.length <= max;
}

export function validateNumber(value, min = null, max = null) {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
}

export function validateDate(value) {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
}

export function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getValidationErrors(validationRules, data) {
  const errors = {};
  
  Object.entries(validationRules).forEach(([field, rules]) => {
    const value = data[field];
    
    for (const rule of rules) {
      const { test, message } = rule;
      if (!test(value, data)) {
        errors[field] = message;
        break;
      }
    }
  });
  
  return errors;
}
