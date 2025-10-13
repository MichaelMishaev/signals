#!/usr/bin/env node

/**
 * Image Optimization Script - TEST VERSION
 *
 * Tests on a single folder first before running on entire project
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

// Test on small folder first
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images/about-page-01'),
  quality: 80,
  dryRun: false,
  extensions: ['.png', '.jpg', '.jpeg'],
  skipIfWebPExists: true,
};

let stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  failed: 0,
  originalSize: 0,
  optimizedSize: 0,
};

async function getImageFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (CONFIG.extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch {
    return 0;
  }
}

async function convertToWebP(inputPath) {
  const sharp = require('sharp');
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const outputPath = path.join(dir, `${baseName}.webp`);
  const backupPath = path.join(dir, `${baseName}${ext}.original`);

  if (CONFIG.skipIfWebPExists && fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipped: ${baseName}${ext} (WebP exists)`);
    stats.skipped++;
    return;
  }

  if (inputPath.endsWith('.original')) {
    stats.skipped++;
    return;
  }

  try {
    const originalSize = getFileSizeKB(inputPath);
    stats.originalSize += parseFloat(originalSize);

    // Create backup
    if (!fs.existsSync(backupPath)) {
      await copyFile(inputPath, backupPath);
      console.log(`💾 Backed up: ${baseName}${ext}`);
    }

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);

    const optimizedSize = getFileSizeKB(outputPath);
    stats.optimizedSize += parseFloat(optimizedSize);

    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ ${baseName}${ext} → ${baseName}.webp`);
    console.log(`   ${originalSize} KB → ${optimizedSize} KB (${savings}% smaller)\n`);

    stats.converted++;
  } catch (error) {
    console.error(`❌ Failed: ${baseName}${ext}`);
    console.error(`   ${error.message}\n`);
    stats.failed++;
  }
}

async function main() {
  console.log('🧪 Image Optimization TEST\n');
  console.log(`📁 Test folder: ${CONFIG.inputDir}\n`);

  try {
    require('sharp');
  } catch {
    console.error('❌ sharp not installed. Run: npm install -D sharp');
    process.exit(1);
  }

  if (!fs.existsSync(CONFIG.inputDir)) {
    console.error(`❌ Directory not found: ${CONFIG.inputDir}`);
    process.exit(1);
  }

  const imageFiles = await getImageFiles(CONFIG.inputDir);
  stats.total = imageFiles.length;

  console.log(`Found ${imageFiles.length} images to optimize\n`);

  for (const file of imageFiles) {
    await convertToWebP(file);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`Total:      ${stats.total}`);
  console.log(`Converted:  ${stats.converted}`);
  console.log(`Skipped:    ${stats.skipped}`);
  console.log(`Failed:     ${stats.failed}`);

  if (stats.converted > 0) {
    const totalSavings = ((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1);
    console.log(`\nBefore:     ${stats.originalSize.toFixed(2)} KB`);
    console.log(`After:      ${stats.optimizedSize.toFixed(2)} KB`);
    console.log(`Savings:    ${totalSavings}% (-${(stats.originalSize - stats.optimizedSize).toFixed(2)} KB)`);
  }

  console.log('='.repeat(50));
  console.log('\n✅ Test complete! Check the files in about-page-01/');
  console.log('📦 Originals backed up with .original extension');
  console.log('\n💡 If everything looks good, run: npm run optimize:images');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
