/**
 * Category Service
 * 
 * Handles all Firestore operations for categories.
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
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Category } from '@/models';
import { COLLECTIONS } from '@/constants';

// ============================================
// READ OPERATIONS
// ============================================


// Helper removed as we only use Firestore images now

/**
 * Fetch all categories from Firestore
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
        const snapshot = await getDocs(categoriesRef);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                image: data.image
            };
        }) as Category[];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: string): Promise<Category | undefined> {
    try {
        const categoryRef = doc(db, COLLECTIONS.CATEGORIES, id);
        const snapshot = await getDoc(categoryRef);

        if (!snapshot.exists()) {
            return undefined;
        }

        const data = snapshot.data();
        return {
            id: snapshot.id,
            ...data,
            image: data.image
        } as Category;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
    try {
        const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
        const q = query(categoriesRef, where('slug', '==', slug));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return undefined;
        }

        const data = snapshot.docs[0].data();
        return {
            id: snapshot.docs[0].id,
            ...data,
            image: data.image
        } as Category;
    } catch (error) {
        console.error('Error fetching category by slug:', error);
        throw error;
    }
}

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create a new category
 */
export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
    try {
        const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
        const docRef = await addDoc(categoriesRef, data);
        return docRef.id;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update an existing category
 */
export async function updateCategory(
    id: string,
    data: Partial<Omit<Category, 'id'>>
): Promise<void> {
    try {
        const categoryRef = doc(db, COLLECTIONS.CATEGORIES, id);
        await updateDoc(categoryRef, data);
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
    try {
        const categoryRef = doc(db, COLLECTIONS.CATEGORIES, id);
        await deleteDoc(categoryRef);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}
