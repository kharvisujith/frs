
import * as fs from 'fs';
import * as path from 'path';
import { products } from '../data/products';

const PRODUCTS_DIR_BASE = path.resolve(process.cwd(), 'public/products');

interface MissingItem {
    name: string;
    categorySlug: string;
    description: string;
    expectedPath: string;
}

async function listMissing() {
    console.log('🔍 Scanning for missing images...');

    if (!fs.existsSync(PRODUCTS_DIR_BASE)) {
        console.error(`❌ Base directory not found: ${PRODUCTS_DIR_BASE}`);
        return;
    }

    const missing: MissingItem[] = [];

    // Use a loop instead of for-of if needed, but for-of is fine in modern TS.
    for (const p of products) {
        if (!p.categorySlug || !p.name) continue;

        // Normalization logic matching uploadProductImages.ts
        const normalizedName = p.name.toLowerCase().trim();
        let filenameBase = normalizedName;
        if (normalizedName.includes('/')) {
            filenameBase = normalizedName.replace(/\//g, '_');
        }

        const filename = `${filenameBase}.png`;
        const categoryDir = path.join(PRODUCTS_DIR_BASE, p.categorySlug);
        const filePath = path.join(categoryDir, filename);

        if (!fs.existsSync(filePath)) {
            missing.push({
                name: p.name,
                categorySlug: p.categorySlug,
                description: p.description,
                expectedPath: filePath
            });
        }
    }

    fs.writeFileSync('missing_images.json', JSON.stringify(missing, null, 2));
    console.log(`✅ Wrote ${missing.length} missing items to missing_images.json`);
}

listMissing();
