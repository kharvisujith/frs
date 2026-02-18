import 'dotenv/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

async function debugProduct() {
    console.log('🔍 Listing baby-kits products in Firestore...');
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('categorySlug', '==', 'baby-kits'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.log('❌ No baby-kits products found in Firestore.');
        return;
    }

    snapshot.forEach(doc => {
        console.log(`Name: "${doc.data().name}"`);
    });
}

debugProduct().catch(console.error);
