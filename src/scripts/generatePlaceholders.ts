
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

// Load missing images JSON (assuming it's in project root)
const MISSING_IMAGES_PATH = path.resolve(process.cwd(), 'missing_images.json');
const PRODUCTS_DIR_BASE = path.resolve(process.cwd(), 'public/products');

interface MissingItem {
    name: string;
    categorySlug: string;
    description: string;
    expectedPath: string; // This might be absolute from previous script
}

async function generatePlaceholders() {
    console.log('🚀 Starting placeholder generation...');

    if (!fs.existsSync(MISSING_IMAGES_PATH)) {
        console.error(`❌ missing_images.json not found at ${MISSING_IMAGES_PATH}. Run listMissingImages.ts first.`);
        process.exit(1);
    }

    const content = fs.readFileSync(MISSING_IMAGES_PATH, 'utf-8');
    const missingItems: MissingItem[] = JSON.parse(content);
    console.log(`Found ${missingItems.length} items to process.`);

    let successCount = 0;
    let failCount = 0;

    // Define colors for categories
    const colorMap: Record<string, string> = {
        'construction': '#e67e22', // orange
        'nfi-items': '#3498db',     // blue
        'dignity-kits': '#9b59b6',  // purple
        'mhm-kits': '#e91e63',      // pink
        'fishing-items': '#1abc9c', // teal
        'baby-kits': '#f1c40f',     // yellow
        'seeds': '#2ecc71',         // green
        'agric-tools': '#d35400',   // pumpkins
        'solar': '#f39c12',         // orange
        'tents': '#7f8c8d'          // gray
    };

    for (const item of missingItems) {
        const { name, categorySlug, expectedPath } = item;

        // Ensure directory exists
        const dir = path.dirname(expectedPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        try {
            const bgColor = colorMap[categorySlug] || '#95a5a6';

            // Create SVG with text centered
            // Escaping implementation
            const safeName = name.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');

            // Break text into lines if too long? 
            // For simplicity, just let it be. Sharp SVG rendering handles text reasonably well, 
            // but for long names it might get cut off without logic.
            // Let's rely on basic SVG text wrapping or just center it.
            // Using logic to split into max 3 lines roughly.

            const words = safeName.split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                if (currentLine.length + words[i].length < 20) {
                    currentLine += ' ' + words[i];
                } else {
                    lines.push(currentLine);
                    currentLine = words[i];
                }
            }
            lines.push(currentLine);

            // Generate tspan based on lines
            const tspans = lines.map((line, index) => {
                // dy is relative to previous line
                const dy = index === 0 ? "0" : "1.2em";
                return `<tspan x="50%" dy="${dy}">${line}</tspan>`;
            }).join('');

            // Initial Y adjustment to center the block
            // 24px font size * 1.2 line height * number of lines
            // roughly center y should be 50% - (half total height)

            const svgImage = `
            <svg width="500" height="500" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="${bgColor}" />
              <text x="50%" y="45%" font-size="30" font-family="Arial, sans-serif" font-weight="bold" fill="white" text-anchor="middle">
                ${tspans}
              </text>
              <text x="50%" y="90%" font-size="20" font-family="Arial, sans-serif" fill="rgba(255,255,255,0.7)" text-anchor="middle">
                ${categorySlug}
              </text>
            </svg>
            `;

            await sharp(Buffer.from(svgImage))
                .png()
                .toFile(expectedPath);

            // console.log(`  ✅ Generated: ${path.basename(expectedPath)}`);
            successCount++;

        } catch (error) {
            console.error(`  ❌ Failed: ${name}`, error);
            failCount++;
        }
    }

    console.log(`\n✨ Done! Generated: ${successCount}, Failed: ${failCount}`);
}

generatePlaceholders();
