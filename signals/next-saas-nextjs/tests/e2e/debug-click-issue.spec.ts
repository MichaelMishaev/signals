import { test } from '@playwright/test';

test('debug why clicks are not working', async ({ page }) => {
  // Log all console messages
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  // Log all errors
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  // Log network failures
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });

  console.log('\n=== Navigating to homepage ===');
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle', timeout: 60000 });

  await page.waitForTimeout(3000);

  // Check if signals loaded
  const signalCards = await page.locator('[data-signal-card]').count();
  console.log(`\nSignal cards found: ${signalCards}`);

  if (signalCards === 0) {
    console.log('ERROR: No signal cards found!');
    const bodyText = await page.locator('body').textContent();
    console.log('Page contains "EUR/USD":', bodyText?.includes('EUR/USD'));
    await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/no-signals-debug.png', fullPage: true });
    return;
  }

  // Get the first signal card
  const firstCard = page.locator('[data-signal-card]').first();

  // Check if it's in a link
  const parentLink = firstCard.locator('xpath=ancestor::a');
  const hasParentLink = await parentLink.count();
  console.log('Card wrapped in link:', hasParentLink > 0);

  if (hasParentLink > 0) {
    const href = await parentLink.getAttribute('href');
    console.log('Link href:', href);
  }

  // Check if card is clickable
  const isVisible = await firstCard.isVisible();
  console.log('First card visible:', isVisible);

  // Try to get bounding box
  const box = await firstCard.boundingBox();
  console.log('Card bounding box:', box);

  // Take screenshot before clicking
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/before-click.png', fullPage: true });

  // Try clicking the card directly
  console.log('\n=== Attempting to click first signal card ===');
  try {
    await firstCard.click({ timeout: 5000 });
    console.log('Click succeeded');

    await page.waitForTimeout(2000);

    const newUrl = page.url();
    console.log('Current URL after click:', newUrl);

    await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/after-click-debug.png', fullPage: true });

    const hasDrillTabs = await page.locator('text=CASE STUDY').count();
    console.log('Drill tabs visible:', hasDrillTabs > 0);

  } catch (error: any) {
    console.log('Click failed:', error.message);
    await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/click-failed.png', fullPage: true });
  }

  // Try clicking via link if card click failed
  console.log('\n=== Attempting to click via link element ===');
  const signalLinks = page.locator('a[href*="/signal/"]');
  const linkCount = await signalLinks.count();
  console.log('Signal links found:', linkCount);

  if (linkCount > 0) {
    try {
      await signalLinks.first().click({ timeout: 5000 });
      await page.waitForTimeout(2000);
      console.log('Link click succeeded, URL:', page.url());
    } catch (error: any) {
      console.log('Link click failed:', error.message);
    }
  }
});
