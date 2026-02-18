import 'dotenv/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import * as fs from 'fs';
import * as path from 'path';

const PRODUCTS_IMAGES_DIR = path.resolve(process.cwd(), 'public/products');

async function uploadProductImages() {
    console.log('🚀 Starting product image upload script...');

    if (!fs.existsSync(PRODUCTS_IMAGES_DIR)) {
        console.error(`❌ Directory not found: ${PRODUCTS_IMAGES_DIR}`);
        console.log('Please create "public/products" and organize images as: public/products/<categorySlug>/<productName>.png');
        process.exit(1);
    }

    // 1. Fetch all products from Firestore to build a lookup map
    console.log('📦 Fetching existing products from Firestore...');
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    // Map<categorySlug, Map<normalizedProductName, productId>>
    const productLookup = new Map<string, Map<string, string>>();

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        const categorySlug = data.categorySlug;
        const name = data.name;

        if (!categorySlug || !name) return;

        if (!productLookup.has(categorySlug)) {
            productLookup.set(categorySlug, new Map());
        }

        // Normalize name for comparison (lowercase, trimmed)
        const normalizedName = name.toLowerCase().trim();
        productLookup.get(categorySlug)!.set(normalizedName, doc.id);

        // Also support filenames where / is replaced by _
        if (normalizedName.includes('/')) {
            const underscoreName = normalizedName.replace(/\//g, '_');
            productLookup.get(categorySlug)!.set(underscoreName, doc.id);
        }
    });

    console.log(`Loaded ${snapshot.size} products from Firestore.\n`);

    // 2. Iterate through category directories in public/products
    const categoryDirs = fs.readdirSync(PRODUCTS_IMAGES_DIR).filter(file => {
        return fs.statSync(path.join(PRODUCTS_IMAGES_DIR, file)).isDirectory();
    });

    let updatedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;

    for (const categorySlug of categoryDirs) {
        const categoryPath = path.join(PRODUCTS_IMAGES_DIR, categorySlug);
        const files = fs.readdirSync(categoryPath).filter(f => f.toLowerCase().endsWith('.png'));

        if (files.length === 0) continue;

        console.log(`📂 Processing category folder: ${categorySlug} (${files.length} images)`);

        if (!productLookup.has(categorySlug)) {
            console.warn(`  ⚠️  Unknown category slug in Firestore: "${categorySlug}". Skipping folder.`);
            skippedCount += files.length;
            continue;
        }

        const categoryProducts = productLookup.get(categorySlug)!;

        for (const file of files) {
            const productName = path.parse(file).name; // Filename without extension
            const normalizedName = productName.toLowerCase().trim();
            const filePath = path.join(categoryPath, file);

            // Find matching product ID
            const productId = categoryProducts.get(normalizedName);

            if (!productId) {
                console.warn(`  Item not found in Firestore: "${productName}" (Category: ${categorySlug}). Skipping.`);
                skippedCount++;
                continue;
            }

            console.log(`  Processing: ${productName} -> ID: ${productId}`);

            try {
                // Upload to Storage
                const fileBuffer = fs.readFileSync(filePath);
                const storagePath = `products/${categorySlug}/${file}`;
                const storageRef = ref(storage, storagePath);

                // console.log(`    Uploading to ${storagePath}...`);
                await uploadBytes(storageRef, fileBuffer, { contentType: 'image/png' });

                // Get URL
                const downloadURL = await getDownloadURL(storageRef);
                // console.log(`    ✅ Uploaded!`);

                // Update Firestore
                const productRef = doc(db, 'products', productId);
                await updateDoc(productRef, { image: downloadURL });

                console.log(`    ✨ Updated Firestore!`);
                updatedCount++;

            } catch (error) {
                console.error(`  ❌ Failed to process ${file}:`, error);
                failedCount++;
            }
        }
    }

    console.log('\n==========================================');
    console.log(`✅ Completed! Updated: ${updatedCount}, Skipped: ${skippedCount}, Failed: ${failedCount}`);
    console.log('==========================================');
    process.exit(0);
}

uploadProductImages().catch(error => {
    console.error('Script error:', error);
    process.exit(1);
});
