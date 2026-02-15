# 🔥 Firebase Firestore Setup Guide

## Step 1: Enable Firestore in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **futureresilienceservice**
3. Click **Firestore Database** in the left menu
4. Click **Create Database**
5. Choose **Start in test mode** (for now)
6. Select a location (choose closest to your users)
7. Click **Enable**

## Step 2: Configure Firestore Security Rules

In the Firebase Console, go to **Firestore Database > Rules** and use these rules for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to categories and products
    match /categories/{document=**} {
      allow read: if true;
      allow write: if false; // Only allow writes from admin
    }
    
    match /products/{document=**} {
      allow read: if true;
      allow write: if false; // Only allow writes from admin
    }
    
    // Allow anyone to create enquiries, but not read/update/delete
    match /enquiries/{document=**} {
      allow create: if true;
      allow read, update, delete: if false; // Only admin can read
    }
  }
}
```

## Step 3: Migrate Your Data to Firestore

Run the migration script to import your existing product data:

```bash
npm install -D tsx
npx tsx src/scripts/migrateToFirestore.ts
```

This will create:
- **categories** collection with 10 categories
- **products** collection with 314 products
- **enquiries** collection (empty, ready for form submissions)

## Step 4: Verify Data in Firebase Console

1. Go to **Firestore Database > Data**
2. You should see 3 collections: `categories`, `products`, `enquiries`
3. Click on each to verify the data was imported correctly

## Step 5: Update Frontend to Use Firestore

The service layer is ready at `src/services/firestore.ts`. You can now use these functions:

```typescript
import { 
  getCategories, 
  getProducts, 
  getProductsByCategory,
  getCategoryBySlug,
  getProductById,
  saveProductEnquiry,
  saveContactEnquiry
} from '@/services/firestore';

// Example: Fetch categories
const categories = await getCategories();

// Example: Save enquiry
await saveProductEnquiry({
  fullName: "John Doe",
  email: "john@example.com",
  productName: "Fleece Blankets",
  // ... other fields
});
```

## What's Next?

Once data is migrated, I'll update your pages to:
1. Fetch data from Firestore instead of hardcoded arrays
2. Save enquiries to Firestore
3. Add loading states and error handling

---

**Ready to proceed?** Let me know once you've enabled Firestore in the console, and I'll help you run the migration!
