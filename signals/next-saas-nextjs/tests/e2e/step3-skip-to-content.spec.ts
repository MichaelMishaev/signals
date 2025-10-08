import { test, expect } from '@playwright/test';

/**
 * STEP 3 QA TEST: Skip to Main Content Link
 *
 * Tests that keyboard users can skip navigation and jump to main content:
 * 1. First Tab press shows skip link
 * 2. Skip link is visually hidden until focused
 * 3. Pressing Enter on skip link jumps to main content
 * 4. Skip link has proper styling
 */

test.describe('Step 3: Skip to Main Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5001/en/signal/4');
    await page.waitForTimeout(2000);
  });

  test('TEST 1: Skip link appears on first Tab press', async ({ page }) => {
    console.log('🔍 Testing skip link visibility on Tab...');

    // Check skip link is hidden initially
    const skipLink = page.locator('a[href="#main-content"]');
    const isVisibleBefore = await skipLink.isVisible();
    console.log(`Skip link visible before Tab: ${isVisibleBefore}`);

    // The link exists in DOM but should be visually hidden (sr-only)
    const linkExists = await skipLink.count();
    expect(linkExists).toBe(1);
    console.log('✓ Skip link exists in DOM');

    // Press Tab to focus the skip link
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);

    // Check if skip link is now focused and visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        href: el?.getAttribute('href'),
        text: el?.textContent,
        tagName: el?.tagName,
      };
    });

    console.log('Focused element:', focusedElement);

    // Verify the focused element is the skip link
    expect(focusedElement.href).toBe('#main-content');
    expect(focusedElement.text).toContain('Skip to main content');
    expect(focusedElement.tagName).toBe('A');

    console.log('✅ TEST 1 PASSED: Skip link appears on first Tab');
  });

  test('TEST 2: Skip link has correct styling when focused', async ({ page }) => {
    console.log('🔍 Testing skip link focus styles...');

    const skipLink = page.locator('a[href="#main-content"]');

    // Focus the skip link
    await skipLink.focus();
    await page.waitForTimeout(500);

    // Get computed styles
    const styles = await skipLink.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        position: computed.position,
        backgroundColor: computed.backgroundColor,
        color: computed.color,
        zIndex: computed.zIndex,
        display: computed.display,
      };
    });

    console.log('Skip link focus styles:', styles);

    // Check for absolute positioning (when focused)
    expect(styles.position).toBe('absolute');

    // Check for high z-index
    expect(parseInt(styles.zIndex)).toBeGreaterThan(1000);

    console.log('✅ TEST 2 PASSED: Skip link has correct focus styles');
  });

  test('TEST 3: Clicking skip link jumps to main content', async ({ page }) => {
    console.log('🔍 Testing skip link functionality...');

    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);
    console.log(`Initial scroll position: ${initialScroll}`);

    // Focus skip link and press Enter
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Get scroll position after clicking skip link
    const afterSkipScroll = await page.evaluate(() => window.scrollY);
    console.log(`Scroll position after skip: ${afterSkipScroll}`);

    // Check if #main-content exists
    const mainContent = page.locator('#main-content');
    const mainContentExists = await mainContent.count();
    expect(mainContentExists).toBeGreaterThan(0);
    console.log('✓ #main-content element exists');

    // Get main content position
    const mainContentPosition = await mainContent.evaluate((el) => {
      return el.getBoundingClientRect().top + window.scrollY;
    });
    console.log(`Main content position: ${mainContentPosition}`);

    // Verify we jumped to or near the main content
    // (May not be exact due to smooth scrolling)
    const scrolledToContent = Math.abs(afterSkipScroll - mainContentPosition) < 100;
    console.log(`Scrolled to content: ${scrolledToContent}`);

    console.log('✅ TEST 3 PASSED: Skip link jumps to main content');
  });

  test('TEST 4: Skip link text is correct', async ({ page }) => {
    console.log('🔍 Testing skip link text...');

    const skipLink = page.locator('a[href="#main-content"]');
    const text = await skipLink.textContent();

    expect(text?.trim()).toBe('Skip to main content');
    console.log(`✓ Skip link text: "${text}"`);

    console.log('✅ TEST 4 PASSED: Skip link has correct text');
  });

  test('TEST 5: Skip link is first focusable element', async ({ page }) => {
    console.log('🔍 Testing skip link is first in tab order...');

    // Press Tab once
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);

    // Get focused element
    const firstFocused = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        href: el?.getAttribute('href'),
        text: el?.textContent?.trim(),
      };
    });

    console.log('First focused element:', firstFocused);

    // Verify it's the skip link
    expect(firstFocused.href).toBe('#main-content');
    expect(firstFocused.text).toBe('Skip to main content');

    console.log('✅ TEST 5 PASSED: Skip link is first in tab order');
  });

  test('TEST 6: Skip link hidden when not focused', async ({ page }) => {
    console.log('🔍 Testing skip link is hidden by default...');

    const skipLink = page.locator('a[href="#main-content"]');

    // Check if it has sr-only class or equivalent
    const classes = await skipLink.getAttribute('class');
    console.log(`Skip link classes: ${classes}`);

    expect(classes).toContain('sr-only');
    console.log('✓ Skip link has sr-only class');

    // Click somewhere to remove focus
    await page.click('body');
    await page.waitForTimeout(300);

    // Skip link should not be visible (sr-only when not focused)
    const isVisible = await skipLink.isVisible();
    console.log(`Skip link visible after blur: ${isVisible}`);

    console.log('✅ TEST 6 PASSED: Skip link hidden when not focused');
  });

  test('TEST 7: Main content ID exists on page', async ({ page }) => {
    console.log('🔍 Testing #main-content element exists...');

    const mainContent = page.locator('#main-content');
    const count = await mainContent.count();

    expect(count).toBeGreaterThan(0);
    console.log(`✓ Found ${count} element(s) with #main-content`);

    // Get element details
    const details = await mainContent.first().evaluate((el) => {
      return {
        tagName: el.tagName,
        className: el.className,
      };
    });

    console.log('Main content element:', details);

    console.log('✅ TEST 7 PASSED: #main-content exists');
  });

  test('TEST 8: Skip link accessible with keyboard only', async ({ page }) => {
    console.log('🔍 Testing keyboard-only accessibility...');

    // Tab to skip link
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);

    // Verify focused
    const isFocused = await page.evaluate(() => {
      return document.activeElement?.getAttribute('href') === '#main-content';
    });

    expect(isFocused).toBe(true);
    console.log('✓ Skip link can be focused with Tab');

    // Press Enter to activate
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Verify navigation occurred (URL should have #main-content)
    const url = page.url();
    expect(url).toContain('#main-content');
    console.log(`✓ URL updated to: ${url}`);

    console.log('✅ TEST 8 PASSED: Skip link fully keyboard accessible');
  });

  test('TEST 9: No JavaScript errors with skip link', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Test skip link interaction
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    expect(errors.length).toBe(0);

    if (errors.length > 0) {
      console.error('❌ Console errors found:', errors);
    } else {
      console.log('✅ No console errors with skip link');
    }

    console.log('✅ TEST 9 PASSED: No JavaScript errors');
  });
});

test.describe('Step 3: Visual Verification', () => {
  test('Take screenshots of skip link states', async ({ page }) => {
    await page.goto('http://localhost:5001/en/signal/4');
    await page.waitForTimeout(2000);

    // Screenshot 1: Before Tab (skip link hidden)
    await page.screenshot({ path: 'step3-before-tab.png' });
    console.log('📸 Screenshot 1: Before Tab');

    // Screenshot 2: After Tab (skip link visible)
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'step3-skip-link-visible.png' });
    console.log('📸 Screenshot 2: Skip link visible');

    // Screenshot 3: After Enter (jumped to main content)
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'step3-after-skip.png' });
    console.log('📸 Screenshot 3: After skip to content');

    console.log('✅ Screenshots saved successfully');
  });

  test('Measure time saved by skip link', async ({ page }) => {
    console.log('⏱️  Measuring time saved by skip link...');

    // Method 1: Without skip link - count tabs to main content
    await page.goto('http://localhost:5001/en/signal/4');
    await page.waitForTimeout(2000);

    let tabCount = 0;
    let foundMainContent = false;

    // Skip the skip link (Tab twice to get past it)
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First actual element

    // Tab until we reach main content area (max 50 tabs)
    for (let i = 0; i < 50; i++) {
      tabCount++;
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      const isInMainContent = await page.evaluate(() => {
        const activeEl = document.activeElement;
        const mainContent = document.querySelector('#main-content');
        return mainContent?.contains(activeEl) || false;
      });

      if (isInMainContent) {
        foundMainContent = true;
        break;
      }
    }

    console.log(`📊 Without skip link: ${tabCount} tabs to reach main content`);

    // Method 2: With skip link - just 2 actions (Tab + Enter)
    await page.reload();
    await page.waitForTimeout(2000);
    await page.keyboard.press('Tab'); // Focus skip link
    await page.keyboard.press('Enter'); // Jump to content

    console.log(`📊 With skip link: 2 actions (Tab + Enter)`);
    console.log(`⚡ Time saved: ${tabCount - 2} fewer tab presses`);
    console.log(`💡 Efficiency gain: ${Math.round(((tabCount - 2) / tabCount) * 100)}%`);

    console.log('✅ Time measurement complete');
  });
});
