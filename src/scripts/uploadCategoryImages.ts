import 'dotenv/config';
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import * as fs from 'fs';
import * as path from 'path';

const CATEGORY_IMAGES_DIR = path.resolve(process.cwd(), 'public/category');

async function uploadCategoryImages() {
    console.log('🚀 Starting category image upload script...');

    if (!fs.existsSync(CATEGORY_IMAGES_DIR)) {
        console.error(`❌ Directory not found: ${CATEGORY_IMAGES_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(CATEGORY_IMAGES_DIR);
    const pngFiles = files.filter(file => file.endsWith('.png'));

    console.log(`Found ${pngFiles.length} PNG images to process.`);

    const categoriesRef = collection(db, 'categories');
    let updatedCount = 0;
    let failedCount = 0;

    for (const file of pngFiles) {
        const slug = path.parse(file).name;
        const filePath = path.join(CATEGORY_IMAGES_DIR, file);

        console.log(`\nProcessing: ${slug} (${file})`);

        try {
            // 1. Read file
            const fileBuffer = fs.readFileSync(filePath);

            // 2. Upload to Storage
            const storagePath = `category/${file}`;
            const storageRef = ref(storage, storagePath);

            console.log(`  Uploading to ${storagePath}...`);
            await uploadBytes(storageRef, fileBuffer, {
                contentType: 'image/png',
            });

            // 3. Get Download URL
            const downloadURL = await getDownloadURL(storageRef);
            console.log(`  ✅ Uploaded! URL: ${downloadURL}`);

            // 4. Update Firestore
            const q = query(categoriesRef, where('slug', '==', slug));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.warn(`  ⚠️  No category found with slug: "${slug}". Skipping Firestore update.`);
                continue;
            }

            // Update all matching docs (should be unique by slug, but just in case)
            const updatePromises = querySnapshot.docs.map(docSnapshot => {
                console.log(`  Updating Firestore document: ${docSnapshot.id}`);
                return updateDoc(docSnapshot.ref, { image: downloadURL });
            });

            await Promise.all(updatePromises);
            updatedCount++;

        } catch (error) {
            console.error(`  ❌ Failed to process ${file}:`, error);
            failedCount++;
        }
    }

    console.log('\n==========================================');
    console.log(`✅ Completed! Updated: ${updatedCount}, Failed: ${failedCount}`);
    console.log('==========================================');
    process.exit(0);
}

uploadCategoryImages().catch(error => {
    console.error('Script error:', error);
    process.exit(1);
});
