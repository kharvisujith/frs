import * as fs from 'fs';
import * as path from 'path';

// Mapping: Key = Firestore Name, Value = Generated Image Name (or best guess)
// If Value is null, we can't map it.
const MAPPING: Record<string, Record<string, string>> = {
    'nfi-items': {
        "Kithcen set ICR / UNHCR type": "Kithcen set ICR_UNHCR type.png",
        "buckets 20 ltr": "buckets 20 ltr.png",
        "flecee blanket": "flecee blanket.png",
        "mosquito net": "mosquito net.png",
        "Tarpaulin 4*5": "Tarpaulin 4*5.png",
        "Tarpaulin 4*6": "Tarpaulin 4*6.png",
        "Sleeping mats": "Sleeping mats.png",
        "jerrycans": "jerrycans.png",
        "colapsibel jerycans": "colapsibel jerycans.png",
        "oxfam type bucekts": "oxfam type bucekts.png",
        "PP bags": "PP bags.png",
        "cotton bed sheet": "cotton bed sheet.png"
    },
    'dignity-kits': {
        "tooth brush": "Toothbrush.png",
        "tooth paste": "Toothpaste.png",
        "soalr torch": "Solar Torch.png",
        "bar soap": "Soap (bathing).png",
        "dettol soap": "Soap (bathing).png",
        "underwears assorted sizes": "Underwear (panties).png",
    },
    'mhm-kits': {
        "Solar touch": "Solar Torch.png",
        "Laundary Soap (400 gm)": "Soap (bathing).png",
        "Bathing soap (4pcs)": "Soap (bathing).png",
        "Whistle": "Whistle.png",
        "Sanitary pads (a packet of 6 pcs) Reusable": "Reusable Sanitary Pads (pack of 4).png",
        "Pands (6 pcs 3small, 3medium)": "Disposable Sanitary Pads (pack of 8).png"
    },
    'fishing-items': {
        "fishing net": "fishing net (unmounted).png",
        "fishing hooks different size": "fishing hooks (100 box).png",
        "monofilaments": "fishing monofilament (rolls).png",
        "fishing twines": "fishing twine (rolls).png"
    },
    'baby-kits': {
        "Daipers": "Diaper_Napkin (cloth).png",
        "Blankets for baby": "Baby Blanket.png",
        "Duke Bathing Soap 125g Empty Packing Covers": "Baby soap.png",
        "Sweater": "Baby vest.png",
        "Movits Hair Food": "Baby jelly.png",
        "Fabrics Heavy/light Cotton": "Baby Wrapper.png"
    }
}

const PRODUCTS_DIR = path.resolve(process.cwd(), 'public/products');

function renameImages() {
    console.log('🚀 Renaming images to match Firestore...');

    for (const [category, map] of Object.entries(MAPPING)) {
        const categoryDir = path.join(PRODUCTS_DIR, category);
        if (!fs.existsSync(categoryDir)) continue;

        console.log(`\n📂 Proccessing ${category}...`);

        for (const [firestoreName, generatedName] of Object.entries(map)) {
            if (!generatedName) continue;

            const oldPath = path.join(categoryDir, generatedName);
            // Sanitize firestore name for file system (replace / with _)
            const sanitizedFirestoreName = firestoreName.replace(/\//g, '_');
            const newPath = path.join(categoryDir, `${sanitizedFirestoreName}.png`);

            if (fs.existsSync(oldPath)) {
                try {
                    fs.copyFileSync(oldPath, newPath);
                    console.log(`  ✅ Mapped: "${generatedName}" -> "${sanitizedFirestoreName}.png"`);
                } catch (e) {
                    console.error(`  ❌ Error processing ${generatedName}:`, e);
                }
            }
        }
    }

    // Cleanup section removed as per user request to preserve original files.
    console.log('\n✅ Mapping complete. Original files preserved.');
}

renameImages();
