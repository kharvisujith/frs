# Firestore Setup Instructions

## Current Issue
Your Firebase project `prashiva-a0490` exists, but **Firestore Database is not enabled**.

## Error You're Seeing
```
5 NOT_FOUND
Could not reach Cloud Firestore backend
```

This means Firestore service hasn't been created in your Firebase project yet.

## Solution: Enable Firestore Database

### Step 1: Go to Firebase Console
Open: https://console.firebase.google.com/project/prashiva-a0490/firestore

### Step 2: Create Firestore Database
1. You should see a page saying **"Cloud Firestore"** with a button **"Create database"**
2. Click **"Create database"**

### Step 3: Choose Security Rules
- **Test mode** (Recommended for development)
  - Allows all reads/writes for 30 days
  - Good for testing
- **Production mode**
  - Requires security rules
  - More secure but needs configuration

Choose **Test mode** for now.

### Step 4: Select Location
Choose a location close to you:
- **asia-south1** (Mumbai, India)
- **us-central1** (Iowa, USA)
- **europe-west1** (Belgium)

**Important:** Location cannot be changed later!

### Step 5: Click "Enable"
Wait 30-60 seconds for Firestore to be created.

### Step 6: Run Migration
Once Firestore is created, run:
```bash
npm run migrate
```

## Verify Setup
After enabling Firestore, you should see:
- Collections tab (empty initially)
- Data tab
- Rules tab
- Indexes tab

## Current Configuration
Your `.env` file is correctly configured:
```
VITE_FIREBASE_PROJECT_ID=prashiva-a0490
```

The project exists, you just need to enable the Firestore service within it.
