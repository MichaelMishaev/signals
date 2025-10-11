import { test, expect } from '@playwright/test';

test('investigate homepage drill access', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  console.log('Navigating to http://localhost:5001/en');
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for page to load
  await page.waitForTimeout(2000);

  // Take initial screenshot
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/homepage-initial.png', fullPage: true });

  // Check for signals on the page
  const signalCards = await page.locator('[class*="signal"]').count();
  console.log('Signal cards found:', signalCards);

  // Look for EUR/USD signal
  const eurUsdVisible = await page.locator('text=EUR/USD').count();
  console.log('EUR/USD mentions:', eurUsdVisible);

  // Look for any links to signal pages
  const signalLinks = await page.locator('a[href*="/signal/"]').count();
  console.log('Signal links found:', signalLinks);

  // Check if there are any "View" or "Read More" buttons
  const viewButtons = await page.locator('text=/View|Read More|Details|Learn More/i').count();
  console.log('Action buttons found:', viewButtons);

  // Get page title
  const title = await page.title();
  console.log('Page title:', title);

  // Check for any drill-related text
  const drillText = await page.locator('text=/drill/i').count();
  console.log('Drill mentions:', drillText);

  // Try to find the first signal link and click it
  const firstSignalLink = page.locator('a[href*="/signal/"]').first();
  const linkCount = await firstSignalLink.count();

  if (linkCount > 0) {
    console.log('\n✅ Found signal link, clicking it...');
    const href = await firstSignalLink.getAttribute('href');
    console.log('Link href:', href);

    await firstSignalLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot after navigation
    await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/after-signal-click.png', fullPage: true });

    const newUrl = page.url();
    console.log('Navigated to:', newUrl);

    // Check for drill tabs
    const caseStudyTab = await page.locator('text=CASE STUDY').count();
    const analyticsTab = await page.locator('text=ANALYTICS').count();
    const blogTab = await page.locator('text=BLOG').count();

    console.log('Drill tabs present:');
    console.log('  - CASE STUDY:', caseStudyTab > 0);
    console.log('  - ANALYTICS:', analyticsTab > 0);
    console.log('  - BLOG:', blogTab > 0);
  } else {
    console.log('\n❌ No signal links found on homepage');

    // Let's check what content is actually on the page
    const bodyText = await page.locator('body').textContent();
    console.log('\nPage contains:');
    console.log('  - "signal":', bodyText?.toLowerCase().includes('signal'));
    console.log('  - "trading":', bodyText?.toLowerCase().includes('trading'));
    console.log('  - "forex":', bodyText?.toLowerCase().includes('forex'));
  }
});
