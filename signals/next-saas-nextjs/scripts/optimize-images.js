#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Safely converts and compresses images to WebP format while preserving originals.
 *
 * Features:
 * - Converts PNG/JPG to WebP (60-80% size reduction)
 * - Preserves original files as .original
 * - Creates backup before optimization
 * - Progress tracking and error handling
 * - Dry-run mode for testing
 *
 * Usage:
 *   npm run optimize:images          # Convert all images
 *   npm run optimize:images -- --dry-run    # Test without converting
 *   npm run optimize:images -- --quality 85  # Custom quality (default: 80)
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '../public/images'),
  quality: parseInt(process.argv.find(arg => arg.startsWith('--quality='))?.split('=')[1]) || 80,
  dryRun: process.argv.includes('--dry-run'),
  extensions: ['.png', '.jpg', '.jpeg'],
  skipIfWebPExists: true, // Don't reconvert if .webp already exists
};

let stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  failed: 0,
  originalSize: 0,
  optimizedSize: 0,
};

/**
 * Check if sharp is installed
 */
async function checkSharpInstalled() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    console.error('❌ Error: sharp is not installed.');
    console.error('Please run: npm install -D sharp');
    process.exit(1);
  }
}

/**
 * Get all image files recursively
 */
async function getImageFiles(dir) {
  const files = [];

  async function scan(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (CONFIG.extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  await scan(dir);
  return files;
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
  } catch {
    return 0;
  }
}

/**
 * Convert image to WebP
 */
async function convertToWebP(inputPath) {
  const sharp = require('sharp');
  const dir = path.dirname(inputPath);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const outputPath = path.join(dir, `${baseName}.webp`);
  const backupPath = path.join(dir, `${baseName}${ext}.original`);

  // Skip if WebP already exists
  if (CONFIG.skipIfWebPExists && fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipped: ${path.relative(CONFIG.inputDir, inputPath)} (WebP exists)`);
    stats.skipped++;
    return;
  }

  // Skip if it's already a backup file
  if (inputPath.endsWith('.original')) {
    stats.skipped++;
    return;
  }

  try {
    const originalSize = getFileSizeKB(inputPath);
    stats.originalSize += parseFloat(originalSize);

    if (CONFIG.dryRun) {
      console.log(`🔍 Would convert: ${path.relative(CONFIG.inputDir, inputPath)} (${originalSize} KB)`);
      stats.converted++;
      return;
    }

    // Create backup of original
    if (!fs.existsSync(backupPath)) {
      await copyFile(inputPath, backupPath);
    }

    // Convert to WebP
    await sharp(inputPath)
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath);

    const optimizedSize = getFileSizeKB(outputPath);
    stats.optimizedSize += parseFloat(optimizedSize);

    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ Converted: ${path.relative(CONFIG.inputDir, inputPath)}`);
    console.log(`   ${originalSize} KB → ${optimizedSize} KB (${savings}% smaller)`);

    stats.converted++;
  } catch (error) {
    console.error(`❌ Failed: ${path.relative(CONFIG.inputDir, inputPath)}`);
    console.error(`   Error: ${error.message}`);
    stats.failed++;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Image Optimization Script\n');
  console.log(`📁 Input directory: ${CONFIG.inputDir}`);
  console.log(`🎨 Quality: ${CONFIG.quality}%`);
  console.log(`🧪 Dry run: ${CONFIG.dryRun ? 'Yes' : 'No'}\n`);

  // Check dependencies
  await checkSharpInstalled();

  // Check if directory exists
  if (!fs.existsSync(CONFIG.inputDir)) {
    console.error(`❌ Error: Directory not found: ${CONFIG.inputDir}`);
    process.exit(1);
  }

  // Get all images
  console.log('🔍 Scanning for images...\n');
  const imageFiles = await getImageFiles(CONFIG.inputDir);
  stats.total = imageFiles.length;

  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Found ${imageFiles.length} images\n`);

  // Process each image
  for (let i = 0; i < imageFiles.length; i++) {
    console.log(`[${i + 1}/${imageFiles.length}]`);
    await convertToWebP(imageFiles[i]);
    console.log('');
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total images found:    ${stats.total}`);
  console.log(`Converted:             ${stats.converted}`);
  console.log(`Skipped:               ${stats.skipped}`);
  console.log(`Failed:                ${stats.failed}`);

  if (!CONFIG.dryRun && stats.converted > 0) {
    const totalSavings = ((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1);
    console.log(`\nOriginal size:         ${stats.originalSize.toFixed(2)} KB`);
    console.log(`Optimized size:        ${stats.optimizedSize.toFixed(2)} KB`);
    console.log(`Total savings:         ${totalSavings}% (${(stats.originalSize - stats.optimizedSize).toFixed(2)} KB)`);
  }

  console.log('='.repeat(60));

  if (CONFIG.dryRun) {
    console.log('\n💡 This was a dry run. Run without --dry-run to convert images.');
  } else if (stats.converted > 0) {
    console.log('\n✅ Optimization complete!');
    console.log('📦 Original files backed up with .original extension');
    console.log('🎉 You can now use the .webp files in your Next.js Image components');
  }
}

// Run script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
