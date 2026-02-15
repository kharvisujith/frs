/**
 * Enquiry Service
 * 
 * Handles all Firestore operations for enquiries (product and contact in separate collections).
 */

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ProductEnquiry, ContactEnquiry } from '@/models';
import { COLLECTIONS, ENQUIRY_STATUS } from '@/constants';

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Save a product enquiry to Firestore
 */
export async function saveProductEnquiry(data: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    productId: string;
    estimatedQuantity?: string;
    projectDescription?: string;
}): Promise<string> {
    try {
        const enquiry: Omit<ProductEnquiry, 'id'> = {
            ...data,
            status: ENQUIRY_STATUS.NEW,
            emailSent: false,
            createdAt: Timestamp.now()
        };

        const enquiriesRef = collection(db, COLLECTIONS.PRODUCT_ENQUIRIES);
        const docRef = await addDoc(enquiriesRef, enquiry);

        return docRef.id;
    } catch (error) {
        console.error('Error saving product enquiry:', error);
        throw error;
    }
}

/**
 * Save a contact form enquiry to Firestore
 */
export async function saveContactEnquiry(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
}): Promise<string> {
    try {
        const enquiry: Omit<ContactEnquiry, 'id'> = {
            ...data,
            status: ENQUIRY_STATUS.NEW,
            emailSent: false,
            createdAt: Timestamp.now()
        };

        const enquiriesRef = collection(db, COLLECTIONS.CONTACT_ENQUIRIES);
        const docRef = await addDoc(enquiriesRef, enquiry);

        return docRef.id;
    } catch (error) {
        console.error('Error saving contact enquiry:', error);
        throw error;
    }
}

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get all product enquiries (for admin use)
 */
export async function getProductEnquiries(): Promise<ProductEnquiry[]> {
    try {
        const enquiriesRef = collection(db, COLLECTIONS.PRODUCT_ENQUIRIES);
        const q = query(
            enquiriesRef,
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ProductEnquiry[];
    } catch (error) {
        console.error('Error fetching product enquiries:', error);
        throw error;
    }
}

/**
 * Get all contact enquiries (for admin use)
 */
export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
    try {
        const enquiriesRef = collection(db, COLLECTIONS.CONTACT_ENQUIRIES);
        const q = query(
            enquiriesRef,
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ContactEnquiry[];
    } catch (error) {
        console.error('Error fetching contact enquiries:', error);
        throw error;
    }
}

/**
 * Get a single enquiry by ID
 */
export async function getProductEnquiryById(id: string): Promise<ProductEnquiry | undefined> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.PRODUCT_ENQUIRIES, id);
        const snapshot = await getDoc(enquiryRef);

        if (!snapshot.exists()) {
            return undefined;
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        } as ProductEnquiry;
    } catch (error) {
        console.error('Error fetching product enquiry:', error);
        throw error;
    }
}

export async function getContactEnquiryById(id: string): Promise<ContactEnquiry | undefined> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.CONTACT_ENQUIRIES, id);
        const snapshot = await getDoc(enquiryRef);

        if (!snapshot.exists()) {
            return undefined;
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        } as ContactEnquiry;
    } catch (error) {
        console.error('Error fetching contact enquiry:', error);
        throw error;
    }
}

/**
 * Get enquiries by product ID
 */
export async function getEnquiriesByProduct(productId: string): Promise<ProductEnquiry[]> {
    try {
        const enquiriesRef = collection(db, COLLECTIONS.PRODUCT_ENQUIRIES);
        const q = query(
            enquiriesRef,
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ProductEnquiry[];
    } catch (error) {
        console.error('Error fetching enquiries by product:', error);
        throw error;
    }
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update enquiry status
 */
export async function updateProductEnquiryStatus(
    id: string,
    status: 'new' | 'read' | 'responded'
): Promise<void> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.PRODUCT_ENQUIRIES, id);
        await updateDoc(enquiryRef, { status });
    } catch (error) {
        console.error('Error updating product enquiry status:', error);
        throw error;
    }
}

export async function updateContactEnquiryStatus(
    id: string,
    status: 'new' | 'read' | 'responded'
): Promise<void> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.CONTACT_ENQUIRIES, id);
        await updateDoc(enquiryRef, { status });
    } catch (error) {
        console.error('Error updating contact enquiry status:', error);
        throw error;
    }
}

/**
 * Mark enquiry email as sent
 */
export async function markProductEnquiryEmailSent(id: string): Promise<void> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.PRODUCT_ENQUIRIES, id);
        await updateDoc(enquiryRef, { emailSent: true });
    } catch (error) {
        console.error('Error marking product enquiry email sent:', error);
        throw error;
    }
}

export async function markContactEnquiryEmailSent(id: string): Promise<void> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.CONTACT_ENQUIRIES, id);
        await updateDoc(enquiryRef, { emailSent: true });
    } catch (error) {
        console.error('Error marking contact enquiry email sent:', error);
        throw error;
    }
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete an enquiry
 */
export async function deleteProductEnquiry(id: string): Promise<void> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.PRODUCT_ENQUIRIES, id);
        await deleteDoc(enquiryRef);
    } catch (error) {
        console.error('Error deleting product enquiry:', error);
        throw error;
    }
}

export async function deleteContactEnquiry(id: string): Promise<void> {
    try {
        const enquiryRef = doc(db, COLLECTIONS.CONTACT_ENQUIRIES, id);
        await deleteDoc(enquiryRef);
    } catch (error) {
        console.error('Error deleting contact enquiry:', error);
        throw error;
    }
}
