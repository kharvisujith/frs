/**
 * Category Model
 * 
 * Represents a product category in the relief catalog.
 * Categories are used to organize products into logical groups.
 */

import { Timestamp } from 'firebase/firestore';

export interface Category {
    /** Unique identifier for the category (Firestore document ID) */
    id: string;

    /** Category name */
    name: string;

    /** URL-friendly slug for routing */
    slug: string;

    /** Category description */
    description: string;

    /** Category image URL */
    image: string;

    /** Timestamp when the category was created */
    createdAt: Timestamp;

    /** Timestamp when the category was last updated */
    updatedAt: Timestamp;
}
