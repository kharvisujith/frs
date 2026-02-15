/**
 * Contact Enquiry Model
 * 
 * Submitted through the general contact form.
 */

import { Timestamp } from 'firebase/firestore';

export interface ContactEnquiry {
    /** Unique identifier (Firestore document ID) */
    id: string;

    /** Name of the person making the enquiry */
    name: string;

    /** Email address for contact (mandatory) */
    email: string;

    /** Optional phone number */
    phone?: string;

    /** Message content */
    message: string;

    /** Current status of the enquiry */
    status: 'new' | 'read' | 'responded';

    /** Whether a confirmation email was sent */
    emailSent: boolean;

    /** Timestamp when the enquiry was created */
    createdAt: Timestamp;
}
