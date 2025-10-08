import { test, expect } from '@playwright/test';

test('Open page and count Exness banners', async ({ page }) => {
  // Navigate to the page
  console.log('📍 Navigating to http://localhost:5001/en/signal/4');
  await page.goto('http://localhost:5001/en/signal/4');

  // Wait for page to load
  await page.waitForTimeout(3000);

  console.log('\n🔍 Searching for banners...\n');

  // Search for ExnessBanner component (sidebar)
  const sidebarBanners = await page.locator('aside').filter({ hasText: 'Sponsored' }).count();
  console.log(`✓ Sidebar banners (aside with "Sponsored"): ${sidebarBanners}`);

  // Search for any image with Exness in alt text
  const exnessImages = await page.locator('img[alt*="Exness"]').count();
  console.log(`✓ Images with "Exness" in alt: ${exnessImages}`);

  // Search for "Trade with Exness" text
  const tradeWithExness = await page.locator('text=Trade with Exness').count();
  console.log(`✓ "Trade with Exness" text: ${tradeWithExness}`);

  // Search for all "Sponsored" labels
  const sponsoredLabels = await page.locator('text=Sponsored').count();
  console.log(`✓ "Sponsored" labels: ${sponsoredLabels}`);

  // Search for footer banner section
  const footerBanners = await page.locator('div').filter({ hasText: 'Risk warning: Trading involves substantial risk of loss' }).count();
  console.log(`✓ Footer banners (with risk warning): ${footerBanners}`);

  // Get all images on the page
  const allImages = await page.locator('img').count();
  console.log(`✓ Total images on page: ${allImages}`);

  // Search for aside element (sidebar)
  const asideElements = await page.locator('aside').count();
  console.log(`✓ <aside> elements: ${asideElements}`);

  // Check if sidebar is visible (lg:col-span-3)
  const sidebarVisible = await page.locator('aside.lg\\:col-span-3').isVisible();
  console.log(`✓ Sidebar visible: ${sidebarVisible}`);

  // Get viewport size
  const viewportSize = page.viewportSize();
  console.log(`\n📐 Viewport size: ${viewportSize?.width}x${viewportSize?.height}`);
  console.log(`   Sidebar shows at: ≥1024px width`);

  // Take a screenshot
  await page.screenshot({ path: 'banner-visibility-test.png', fullPage: true });
  console.log('\n📸 Screenshot saved: banner-visibility-test.png');

  // Check console for errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  if (errors.length > 0) {
    console.log('\n❌ Console errors found:');
    errors.forEach(err => console.log(`   ${err}`));
  } else {
    console.log('\n✅ No console errors');
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY:');
  console.log('='.repeat(60));
  console.log(`Sidebar banners: ${sidebarBanners}`);
  console.log(`Footer banners: ${footerBanners}`);
  console.log(`Total Exness images: ${exnessImages}`);
  console.log(`Banner visibility depends on screen width (≥1024px)`);
  console.log('='.repeat(60));
});

test('Count banners at desktop size (1920x1080)', async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  console.log('\n🖥️  Testing at DESKTOP size: 1920x1080');

  await page.goto('http://localhost:5001/en/signal/4');
  await page.waitForTimeout(3000);

  const sidebarVisible = await page.locator('aside.lg\\:col-span-3').isVisible();
  const sidebarBanners = await page.locator('aside').filter({ hasText: 'Sponsored' }).count();
  const footerBanners = await page.locator('div').filter({ hasText: 'Risk warning' }).count();

  console.log(`✓ Sidebar visible: ${sidebarVisible}`);
  console.log(`✓ Sidebar banners: ${sidebarBanners}`);
  console.log(`✓ Footer banners: ${footerBanners}`);

  await page.screenshot({ path: 'banner-desktop-1920.png', fullPage: false });
  console.log('📸 Screenshot: banner-desktop-1920.png');
});

test('Count banners at mobile size (375x667)', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  console.log('\n📱 Testing at MOBILE size: 375x667');

  await page.goto('http://localhost:5001/en/signal/4');
  await page.waitForTimeout(3000);

  const sidebarVisible = await page.locator('aside.lg\\:col-span-3').isVisible();
  const footerBanners = await page.locator('div').filter({ hasText: 'Risk warning' }).count();

  console.log(`✓ Sidebar visible: ${sidebarVisible} (expected: false on mobile)`);
  console.log(`✓ Footer banners: ${footerBanners}`);

  await page.screenshot({ path: 'banner-mobile-375.png', fullPage: false });
  console.log('📸 Screenshot: banner-mobile-375.png');
});
