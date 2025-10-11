import { test } from '@playwright/test';

test('check for blocking overlays', async ({ page }) => {
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  console.log('\n=== Checking for blocking elements ===\n');

  // Check for modals
  const modals = await page.locator('[class*="modal"], [class*="overlay"], [class*="backdrop"]').count();
  console.log('Modals/overlays found:', modals);

  // Check for fixed/absolute positioned elements that might block
  const blockingElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const blocking = elements.filter(el => {
      const style = window.getComputedStyle(el);
      const isFixed = style.position === 'fixed';
      const isAbsolute = style.position === 'absolute';
      const hasHighZ = parseInt(style.zIndex) > 1000;
      const coversScreen = el.getBoundingClientRect().width > window.innerWidth * 0.5;

      return (isFixed || (isAbsolute && hasHighZ)) && coversScreen;
    });

    return blocking.map(el => ({
      tag: el.tagName,
      class: el.className,
      zIndex: window.getComputedStyle(el).zIndex,
      position: window.getComputedStyle(el).position
    }));
  });

  console.log('\nPotentially blocking elements:');
  blockingElements.forEach((el, i) => {
    console.log(`${i + 1}.`, el);
  });

  // Scroll to signals
  await page.evaluate(() => {
    const signals = document.querySelector('[data-signal-card]');
    signals?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  await page.waitForTimeout(2000);

  // Take screenshot highlighting the signal area
  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/overlay-check.png',
    fullPage: true
  });

  // Check pointer-events on signal cards
  const pointerEvents = await page.locator('[data-signal-card]').first().evaluate((el) => {
    return window.getComputedStyle(el).pointerEvents;
  });
  console.log('\nSignal card pointer-events:', pointerEvents);

  // Check if RevealAnimation might be blocking
  const revealAnimations = await page.locator('[class*="reveal"]').count();
  console.log('RevealAnimation elements:', revealAnimations);

  // Try clicking without scrolling first
  console.log('\n=== Testing click from homepage load position ===');
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const buttonVisible = await page.locator('[data-signal-card] button').first().isVisible();
  console.log('Button visible without scroll:', buttonVisible);

  if (!buttonVisible) {
    console.log('⚠️  ISSUE: Buttons not visible in initial viewport!');
    console.log('⚠️  User must scroll down to see signals');
  }
});
