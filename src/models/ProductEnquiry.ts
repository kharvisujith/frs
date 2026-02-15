/**
 * Product Enquiry Model
 * 
 * Submitted when a user requests information about a specific product.
 */

import { Timestamp } from 'firebase/firestore';

export interface ProductEnquiry {
    /** Unique identifier (Firestore document ID) */
    id: string;

    /** Name of the person making the enquiry */
    name: string;

    /** Email address for contact (mandatory) */
    email: string;

    /** Optional phone number */
    phone?: string;

    /** Optional organization name */
    organization?: string;

    /** ID of the product being enquired about */
    productId: string;

    /** Estimated quantity needed */
    estimatedQuantity?: string;

    /** Description of the project/use case */
    projectDescription?: string;

    /** Current status of the enquiry */
    status: 'new' | 'read' | 'responded';

    /** Whether a confirmation email was sent */
    emailSent: boolean;

    /** Timestamp when the enquiry was created */
    createdAt: Timestamp;
}
