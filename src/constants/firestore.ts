/**
 * Firestore Collection Names
 * Centralized constants for all Firestore collections
 */

export const COLLECTIONS = {
    CATEGORIES: 'categories',
    PRODUCTS: 'products',
    CONTACT_ENQUIRIES: 'contactEnquiries',
    PRODUCT_ENQUIRIES: 'productEnquiries',
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
