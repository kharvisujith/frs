# Firebase Cloud Functions - Field Mapping

This document shows the exact field mapping between Firestore models and Cloud Functions email templates.

## Contact Enquiry Model → Email Template

### ContactEnquiry Interface
```typescript
{
  id: string;
  name: string;           // ✅ Used in email
  email: string;          // ✅ Used in email (replyTo)
  phone?: string;         // ✅ Used in email (optional)
  message: string;        // ✅ Used in email
  status: 'new' | 'read' | 'responded';
  emailSent: boolean;     // ✅ Updated by function
  createdAt: Timestamp;
}
```

### Email Template Uses:
- ✅ `data.name` - Customer name
- ✅ `data.email` - Customer email (replyTo)
- ✅ `data.phone` - Customer phone (optional, only shown if provided)
- ✅ `data.message` - Customer message
- ✅ `docId` - Document ID from event.params

---

## Product Enquiry Model → Email Template

### ProductEnquiry Interface
```typescript
{
  id: string;
  name: string;                    // ✅ Used in email
  email: string;                   // ✅ Used in email (replyTo)
  phone?: string;                  // ✅ Used in email (optional)
  organization?: string;           // ✅ Used in email (optional)
  productId: string;               // ✅ Used to fetch product details
  estimatedQuantity?: string;      // ✅ Used in email (optional)
  projectDescription?: string;     // ✅ Used in email (optional)
  status: 'new' | 'read' | 'responded';
  emailSent: boolean;              // ✅ Updated by function
  createdAt: Timestamp;
}
```

### Email Template Uses:
- ✅ `data.name` - Customer name
- ✅ `data.email` - Customer email (replyTo)
- ✅ `data.phone` - Customer phone (optional)
- ✅ `data.organization` - Organization name (optional)
- ✅ `data.productId` - Used to fetch product name and category
- ✅ `data.estimatedQuantity` - Quantity needed (optional)
- ✅ `data.projectDescription` - Project details (optional)
- ✅ `docId` - Document ID from event.params

---

## ✅ All Field Names Match Exactly

The Cloud Functions are already using the exact same field names as defined in the TypeScript models:
- `ContactEnquiry.ts` → `contactEmail` function
- `ProductEnquiry.ts` → `productEmail` function

No changes needed - the field names are already correct! 🎉
