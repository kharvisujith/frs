import { execSync } from 'child_process';
import * as path from 'path';

function runScript(scriptName: string) {
    console.log(`\n▶️ Running ${scriptName}...`);
    try {
        execSync(`npx tsx src/scripts/${scriptName}`, { stdio: 'inherit', cwd: process.cwd() });
        console.log(`✅ ${scriptName} completed.`);
    } catch (error) {
        console.error(`❌ ${scriptName} failed.`);
        process.exit(1);
    }
}

async function main() {
    console.log('🚀 Starting Image Sync Process (Map + Upload)...');

    // 1. Map images to Firestore names (preserves originals)
    runScript('mapImagesToFirestore.ts');

    // 2. Upload images to Firebase
    runScript('uploadProductImages.ts');

    console.log('\n✨ All done! Images mapped and uploaded.');
}

main();
