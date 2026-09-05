/**
 * Strict Form Validation Utilities for Shashi Enterprises B2B Platform
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (!cleaned) return 'Mobile / WhatsApp number is required.';
  
  // Regex for 10-digit Indian mobile number with optional +91 prefix
  const phoneRegex = /^(\+91)?([6-9]\d{9})$/;
  if (!phoneRegex.test(cleaned)) {
    return 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210).';
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email address is required.';
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g., trade@yourshop.com).';
  }
  return null;
}

export function validateGSTIN(gstin: string): string | null {
  if (!gstin || !gstin.trim()) return null; // GSTIN is optional
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
  if (!gstinRegex.test(gstin.trim())) {
    return 'Invalid GSTIN format. Must be 15 characters (e.g., 07AAAAA0000A1Z5).';
  }
  return null;
}

export function validatePincode(pincode: string): string | null {
  if (!pincode) return 'Pincode is required.';
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  if (!pincodeRegex.test(pincode.trim())) {
    return 'Please enter a valid 6-digit Indian PIN code (e.g., 110005).';
  }
  return null;
}

export function validateName(name: string, label: string = 'Name', minLen: number = 2): string | null {
  const trimmed = name.trim();
  if (!trimmed) return `${label} is required.`;
  if (trimmed.length < minLen) return `${label} must be at least ${minLen} characters long.`;
  // Must contain letters (not just numbers or symbols)
  if (!/[a-zA-Z]/.test(trimmed)) {
    return `${label} must contain letters and be a valid name.`;
  }
  return null;
}

export function validateBusinessName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Shop / Business Name is required.';
  if (trimmed.length < 3) return 'Shop / Business Name must be at least 3 characters.';
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Shop / Business Name must contain letters.';
  }
  return null;
}

export function validateAddress(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return 'Delivery Street Address is required.';
  if (trimmed.length < 8) return 'Please enter a complete street address (minimum 8 characters).';
  return null;
}

export function validateCity(city: string): string | null {
  const trimmed = city.trim();
  if (!trimmed) return 'City is required.';
  if (trimmed.length < 2 || !/[a-zA-Z]/.test(trimmed)) {
    return 'Please enter a valid city name.';
  }
  return null;
}
