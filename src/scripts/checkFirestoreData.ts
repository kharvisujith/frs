import 'dotenv/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CATEGORIES_TO_CHECK = [
    'seeds',
    'agric-tools',
    'solar',
    'tents',
    'construction'
];

async function checkFirestoreData() {
    console.log('🔍 Checking Firestore data for categories:', CATEGORIES_TO_CHECK);
    const productsRef = collection(db, 'products');

    for (const slug of CATEGORIES_TO_CHECK) {
        const q = query(productsRef, where('categorySlug', '==', slug));
        const snapshot = await getDocs(q);

        console.log(`\n📂 Category: ${slug} (${snapshot.size} items)`);
        if (snapshot.empty) {
            console.log('   (No items found)');
        } else {
            snapshot.forEach(doc => {
                console.log(`   - "${doc.data().name}" (ID: ${doc.id})`);
            });
        }
    }
}

checkFirestoreData().catch(console.error);
