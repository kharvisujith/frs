/**
 * Product Model
 * 
 * Represents a product in the relief catalog.
 * 
 * Category Relationship (Denormalized):
 * Stores categoryId for reference AND categoryName/categorySlug for fast display.
 * This avoids extra queries when displaying products.
 */

import { Timestamp } from 'firebase/firestore';

export interface Product {
    /** Unique identifier for the product (Firestore document ID) */
    id: string;

    /** Product name */
    name: string;

    /** Product description */
    description: string;

    /** Reference to the category document ID */
    categoryId: string;

    /** Category name (denormalized for performance) */
    categoryName: string;

    /** Category slug (denormalized for routing) */
    categorySlug: string;

    /** Product image URL */
    image: string;

    /** Timestamp when the product was created */
    createdAt: Timestamp;

    /** Timestamp when the product was last updated */
    updatedAt: Timestamp;
}
