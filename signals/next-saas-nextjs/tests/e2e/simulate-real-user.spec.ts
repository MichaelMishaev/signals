import { test, expect } from '@playwright/test';

test('simulate real user interaction', async ({ page }) => {
  console.log('\n=== Simulating REAL USER behavior ===\n');

  // 1. Open page fresh
  console.log('1. Opening http://localhost:5001/en');
  await page.goto('http://localhost:5001/en');

  // 2. Wait for page to fully load (like a real user would)
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('2. Page loaded, taking screenshot of initial view');
  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/step1-initial.png'
  });

  // 3. Scroll down to signals section (like user would)
  console.log('3. Scrolling down to find signals...');
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/step2-scrolled.png'
  });

  // 4. Look for signal cards
  const cards = await page.locator('[data-signal-card]').count();
  console.log(`4. Found ${cards} signal cards`);

  if (cards === 0) {
    console.log('❌ NO SIGNALS VISIBLE - FAILED');
    return;
  }

  // 5. Hover over first signal (like real user)
  const firstCard = page.locator('[data-signal-card]').first();
  console.log('5. Hovering over first signal card...');
  await firstCard.hover();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/step3-hover.png'
  });

  // 6. Find and click the button
  const button = firstCard.locator('button');
  const buttonText = await button.textContent();
  console.log(`6. Clicking button: "${buttonText}"`);

  await button.click();

  // 7. Wait for navigation
  console.log('7. Waiting for navigation...');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  const finalUrl = page.url();
  console.log(`8. Final URL: ${finalUrl}`);

  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/step4-result.png',
    fullPage: true
  });

  // 9. Check if we're on signal page
  if (finalUrl.includes('/signal/')) {
    console.log('✅ SUCCESS - Navigated to signal page');

    // Check for drill tabs
    const tabs = await page.locator('text=/CASE STUDY|ANALYTICS|BLOG/').count();
    console.log(`9. Found ${tabs} drill tabs`);

    expect(tabs).toBeGreaterThan(0);
  } else {
    console.log('❌ FAILED - Did not navigate to signal page');
    console.log('Current URL:', finalUrl);
  }
});
