/**
 * Application-wide Constants
 */

export const APP_NAME = 'Relief Catalog';

export const TOAST_MESSAGES = {
    CONTACT_SUCCESS: 'Thank you for contacting us! We will get back to you soon.',
    CONTACT_ERROR: 'Failed to submit enquiry. Please try again.',
    PRODUCT_ENQUIRY_SUCCESS: 'Thank you for your enquiry! We will contact you shortly.',
    PRODUCT_ENQUIRY_ERROR: 'Failed to submit enquiry. Please try again.',
} as const;

export const FORM_VALIDATION = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
} as const;

export const ENQUIRY_STATUS = {
    NEW: 'new',
    READ: 'read',
    RESPONDED: 'responded',
} as const;
