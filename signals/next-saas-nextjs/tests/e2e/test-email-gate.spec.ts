import { test, expect } from '@playwright/test';

test.describe('Email Gate Trigger Test', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5001');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('Email gate should appear after viewing 2nd drill tab', async ({ page }) => {
    console.log('🧪 Starting email gate test...');

    // Navigate to homepage
    await page.goto('http://localhost:5001');
    await page.waitForLoadState('networkidle');

    console.log('✅ Homepage loaded');

    // Find and click on signal #17 (or any available signal)
    const signalLink = page.locator('a[href*="/signal/"]').first();
    const signalHref = await signalLink.getAttribute('href');
    console.log('🔗 Found signal link:', signalHref);

    await signalLink.click();
    await page.waitForLoadState('networkidle');
    console.log('✅ Signal page loaded');

    // Wait a bit for the page to fully render
    await page.waitForTimeout(1000);

    // Check localStorage state before drill views
    const initialState = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const gateKey = keys.find(k => k.includes('gate_flow_state'));
      if (gateKey) {
        return JSON.parse(localStorage.getItem(gateKey) || '{}');
      }
      return null;
    });
    console.log('📊 Initial gate state:', initialState);

    // Find all drill tabs
    const drillTabs = page.locator('[role="tab"], button:has-text("CASE_STUDY"), button:has-text("ANALYTICS"), button:has-text("BLOG")');
    const tabCount = await drillTabs.count();
    console.log(`📑 Found ${tabCount} drill tabs`);

    // If no tabs found, try alternative selectors
    if (tabCount === 0) {
      console.log('⚠️ No drill tabs found with standard selector, trying alternatives...');

      // Take screenshot for debugging
      await page.screenshot({ path: 'signal-page-no-tabs.png', fullPage: true });

      // Log page content
      const pageContent = await page.content();
      console.log('📄 Page HTML length:', pageContent.length);

      // Check if drills exist in the DOM
      const drillsExist = await page.locator('text=/drill|CASE_STUDY|ANALYTICS|BLOG/i').count();
      console.log(`🔍 Found ${drillsExist} elements with drill-related text`);
    }

    // Click first drill tab
    console.log('👆 Clicking first drill tab...');
    if (tabCount > 0) {
      await drillTabs.first().click();
      await page.waitForTimeout(500);

      // Check state after first click
      const stateAfterFirst = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const gateKey = keys.find(k => k.includes('gate_flow_state'));
        if (gateKey) {
          return JSON.parse(localStorage.getItem(gateKey) || '{}');
        }
        return null;
      });
      console.log('📊 State after 1st drill view:', stateAfterFirst);

      // Check console logs
      const logs = await page.evaluate(() => {
        return (window as any).__gateLogs || [];
      });
      console.log('📝 Console logs:', logs);
    }

    // Check if email gate modal is visible (should NOT be visible yet)
    const gateModalBeforeSecond = page.locator('[role="dialog"], [data-testid="email-gate-modal"], text="Enter your email"');
    const isVisibleBeforeSecond = await gateModalBeforeSecond.isVisible().catch(() => false);
    console.log('🚪 Email gate visible after 1st drill?', isVisibleBeforeSecond);

    // Click second drill tab (if available)
    if (tabCount > 1) {
      console.log('👆 Clicking second drill tab...');
      await drillTabs.nth(1).click();
      await page.waitForTimeout(1000);

      // Check state after second click
      const stateAfterSecond = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const gateKey = keys.find(k => k.includes('gate_flow_state'));
        if (gateKey) {
          return JSON.parse(localStorage.getItem(gateKey) || '{}');
        }
        return null;
      });
      console.log('📊 State after 2nd drill view:', stateAfterSecond);

      // Take screenshot
      await page.screenshot({ path: 'after-second-drill.png', fullPage: true });

      // Check if email gate modal is NOW visible
      const gateModalAfterSecond = page.locator('[role="dialog"], [data-testid="email-gate-modal"], text="Enter your email"');
      const isVisibleAfterSecond = await gateModalAfterSecond.isVisible().catch(() => false);
      console.log('🚪 Email gate visible after 2nd drill?', isVisibleAfterSecond);

      // Check for any modal or overlay
      const anyModal = await page.locator('[role="dialog"], .modal, [class*="modal"]').count();
      console.log('🔍 Total modals found:', anyModal);

      // Assert that email gate should be visible
      expect(isVisibleAfterSecond, 'Email gate should appear after 2nd drill view').toBe(true);
    } else {
      console.log('❌ Not enough drill tabs to test (need at least 2)');
      test.skip();
    }
  });

  test('Debug: Check drill tab clicking and gate state tracking', async ({ page }) => {
    console.log('🐛 Debug test: Checking drill tracking...');

    // Set up console log capture - capture ALL console logs
    page.on('console', msg => {
      const text = msg.text();
      console.log('🖥️ Browser console:', text);
    });

    await page.goto('http://localhost:5001');
    await page.waitForLoadState('networkidle');

    // Click first signal
    const signalLink = page.locator('a[href*="/signal/"]').first();
    await signalLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot of initial state
    await page.screenshot({ path: 'debug-initial-state.png', fullPage: true });

    // Get all clickable elements that might be drill tabs
    const allButtons = page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`🔍 Total buttons found: ${buttonCount}`);

    // Check localStorage
    const gateState = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      console.log('🔑 LocalStorage keys:', keys);
      const gateKey = keys.find(k => k.includes('gate_flow_state'));
      if (gateKey) {
        const state = localStorage.getItem(gateKey);
        console.log(`📦 Gate state (${gateKey}):`, state);
        return JSON.parse(state || '{}');
      }
      return null;
    });
    console.log('📊 Current gate state:', gateState);

    // Try clicking buttons with specific text patterns
    const possibleDrillButtons = page.locator('button:has-text("📚"), button:has-text("📊"), button:has-text("📝")');
    const drillButtonCount = await possibleDrillButtons.count();
    console.log(`📑 Found ${drillButtonCount} potential drill buttons`);

    if (drillButtonCount > 0) {
      for (let i = 0; i < Math.min(drillButtonCount, 3); i++) {
        const buttonText = await possibleDrillButtons.nth(i).textContent();
        console.log(`👆 Clicking button ${i + 1}: "${buttonText}"`);
        await possibleDrillButtons.nth(i).click();
        await page.waitForTimeout(1000);

        const stateAfterClick = await page.evaluate(() => {
          const keys = Object.keys(localStorage);
          const gateKey = keys.find(k => k.includes('gate_flow_state'));
          if (gateKey) {
            return JSON.parse(localStorage.getItem(gateKey) || '{}');
          }
          return null;
        });
        console.log(`📊 State after click ${i + 1}:`, stateAfterClick);

        await page.screenshot({ path: `debug-after-click-${i + 1}.png`, fullPage: true });
      }
    }
  });
});
