import * as fs from 'fs';
import * as path from 'path';

const PRODUCTS_DATA_PATH = path.resolve(process.cwd(), 'src/data/products.ts');
const PUBLIC_PRODUCTS_DIR = path.resolve(process.cwd(), 'public/products');

async function createFolders() {
    console.log('🚀 Creating product image folders...');

    if (!fs.existsSync(PRODUCTS_DATA_PATH)) {
        console.error(`❌ Data file not found: ${PRODUCTS_DATA_PATH}`);
        process.exit(1);
    }

    // Read the file content
    const fileContent = fs.readFileSync(PRODUCTS_DATA_PATH, 'utf-8');

    // Regex to find all slugs in the categories array
    // Looking for "slug": "value" pattern
    const slugRegex = /"slug":\s*"([^"]+)"/g;

    const slugs = new Set<string>();
    let match;

    // We only want the slugs from the 'categories' constant, but since the file 
    // structure is simple and only categories have "slug" (products have "categorySlug"),
    // searching for "slug": "..." is safe enough for this one-off task.
    // Products use "categorySlug": "...", so they won't match "slug": "..."

    while ((match = slugRegex.exec(fileContent)) !== null) {
        slugs.add(match[1]);
    }

    console.log(`Found ${slugs.size} unique category slugs.`);

    // Create base directory
    if (!fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
        fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
        console.log(`Created base directory: ${PUBLIC_PRODUCTS_DIR}`);
    }

    // Create subdirectories
    slugs.forEach(slug => {
        const dirPath = path.join(PUBLIC_PRODUCTS_DIR, slug);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            console.log(`  ✅ Created: public/products/${slug}`);
        } else {
            console.log(`  skip: public/products/${slug} (exists)`);
        }
    });

    console.log('\n✨ Done! You can now drop images into these folders.');
}

createFolders();
