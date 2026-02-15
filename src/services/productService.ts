/**
 * Product Service
 * 
 * Handles all Firestore operations for products.
 */

import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product } from '@/models';
import { getCategoryById } from './categoryService';
import { COLLECTIONS } from '@/constants';

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Fetch all products from Firestore
 */
export async function getProducts(): Promise<Product[]> {
    try {
        const productsRef = collection(db, COLLECTIONS.PRODUCTS);
        const snapshot = await getDocs(productsRef);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
    try {
        const productRef = doc(db, COLLECTIONS.PRODUCTS, id);
        const snapshot = await getDoc(productRef);

        if (!snapshot.exists()) {
            return undefined;
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        } as Product;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

/**
 * Get products by category ID
 */
export async function getProductsByCategoryId(categoryId: string): Promise<Product[]> {
    try {
        const productsRef = collection(db, COLLECTIONS.PRODUCTS);
        const q = query(productsRef, where('categoryId', '==', categoryId));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
        console.error('Error fetching products by category ID:', error);
        throw error;
    }
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
        const productsRef = collection(db, COLLECTIONS.PRODUCTS);
        const q = query(productsRef, where('categorySlug', '==', categorySlug));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
}

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new product
 * User only provides: name, description, categoryId, image
 * We automatically fetch and denormalize: categoryName, categorySlug
 */
export async function createProduct(data: {
    name: string;
    description: string;
    categoryId: string;  // User selects category
    image: string;
}): Promise<string> {
    try {
        // Fetch category details for denormalization
        const category = await getCategoryById(data.categoryId);

        if (!category) {
            throw new Error(`Category with ID ${data.categoryId} not found`);
        }

        const productsRef = collection(db, COLLECTIONS.PRODUCTS);

        // Create product with denormalized category data
        const docRef = await addDoc(productsRef, {
            name: data.name,
            description: data.description,
            categoryId: data.categoryId,
            categoryName: category.name,      // Auto-populated from category
            categorySlug: category.slug,      // Auto-populated from category
            image: data.image,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return docRef.id;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update an existing product
 * If categoryId changes, automatically update categoryName and categorySlug
 */
export async function updateProduct(
    id: string,
    data: Partial<{
        name: string;
        description: string;
        categoryId: string;
        image: string;
    }>
): Promise<void> {
    try {
        const productRef = doc(db, COLLECTIONS.PRODUCTS, id);
        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp()
        };

        // If category changed, fetch and update denormalized fields
        if (data.categoryId) {
            const category = await getCategoryById(data.categoryId);

            if (!category) {
                throw new Error(`Category with ID ${data.categoryId} not found`);
            }

            updateData.categoryName = category.name;
            updateData.categorySlug = category.slug;
        }

        await updateDoc(productRef, updateData);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

/**
 * Batch update products when category name/slug changes
 * This maintains denormalized data consistency
 */
export async function updateProductsCategory(
    categoryId: string,
    categoryName: string,
    categorySlug: string
): Promise<void> {
    try {
        const products = await getProductsByCategoryId(categoryId);
        const batch = writeBatch(db);

        products.forEach(product => {
            const productRef = doc(db, COLLECTIONS.PRODUCTS, product.id);
            batch.update(productRef, {
                categoryName,
                categorySlug,
                updatedAt: serverTimestamp()
            });
        });

        await batch.commit();
    } catch (error) {
        console.error('Error batch updating products category:', error);
        throw error;
    }
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
    try {
        const productRef = doc(db, COLLECTIONS.PRODUCTS, id);
        await deleteDoc(productRef);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}
