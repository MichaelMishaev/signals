import { test } from '@playwright/test';

test('ULTRATHINK: investigate why clicks dont work', async ({ page }) => {
  console.log('\n=== ULTRATHINK DEBUG MODE ===\n');

  // Capture all errors
  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
    }
  });

  // Navigate
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  // Check if signals are visible in viewport
  const signalCards = page.locator('[data-signal-card]');
  const count = await signalCards.count();
  console.log(`Found ${count} signal cards\n`);

  if (count === 0) {
    console.log('❌ NO SIGNAL CARDS FOUND!');
    return;
  }

  // Check first card
  const firstCard = signalCards.first();
  const isVisible = await firstCard.isVisible();
  console.log('First card visible:', isVisible);

  // Check if card is in viewport
  const box = await firstCard.boundingBox();
  console.log('Card position:', box);

  // Scroll to card
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  console.log('\n--- Checking for overlaying elements ---');

  // Get the card's position and check what element is actually at that point
  if (box) {
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    const elementAtPoint = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (el) {
        return {
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          text: el.textContent?.substring(0, 50)
        };
      }
      return null;
    }, { x: centerX, y: centerY });

    console.log('Element at card center:', elementAtPoint);
  }

  // Check button specifically
  console.log('\n--- Checking button ---');
  const button = firstCard.locator('button');
  const buttonExists = await button.count();
  console.log('Button exists:', buttonExists > 0);

  if (buttonExists > 0) {
    const buttonVisible = await button.isVisible();
    const buttonEnabled = await button.isEnabled();
    const buttonText = await button.textContent();

    console.log('Button visible:', buttonVisible);
    console.log('Button enabled:', buttonEnabled);
    console.log('Button text:', buttonText);

    // Check if button has click handler
    const hasOnClick = await button.evaluate((el) => {
      return typeof (el as any).onclick === 'function' ||
             el.getAttribute('onclick') !== null;
    });
    console.log('Button has onclick:', hasOnClick);

    // Try to click
    console.log('\n--- Attempting click ---');
    try {
      await button.click({ timeout: 5000 });
      console.log('✅ Click succeeded!');

      await page.waitForTimeout(2000);
      const newUrl = page.url();
      console.log('New URL:', newUrl);

      if (newUrl.includes('/signal/')) {
        console.log('✅ NAVIGATION SUCCESSFUL!');
      } else {
        console.log('❌ NO NAVIGATION - Still on:', newUrl);
      }

    } catch (error: any) {
      console.log('❌ Click failed:', error.message);

      // Try force click
      console.log('\n--- Trying force click ---');
      try {
        await button.click({ force: true });
        await page.waitForTimeout(2000);
        console.log('Force click URL:', page.url());
      } catch (e: any) {
        console.log('Force click also failed:', e.message);
      }
    }
  }

  // Take screenshot
  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/ultrathink-debug.png',
    fullPage: true
  });

  // Check if the whole card is clickable or just the button
  console.log('\n--- Checking if entire card is clickable ---');
  const cardLink = firstCard.locator('xpath=ancestor::a');
  const hasLink = await cardLink.count();
  console.log('Card wrapped in link:', hasLink > 0);

  if (hasLink === 0) {
    console.log('⚠️  FOUND ISSUE: Cards are NOT wrapped in links!');
    console.log('⚠️  Only buttons have click handlers');
  }
});
