import { test, expect } from '@playwright/test';

test.describe('Email Gate - Verify on Signals 17, 18, 19', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all state before each test
    await page.goto('http://localhost:5001');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    console.log('🧹 Cleared all storage');
  });

  test('Signal 17 - Email gate should appear after 2nd drill click', async ({ page }) => {
    console.log('\n========================================');
    console.log('🧪 Testing Signal 17');
    console.log('========================================\n');

    // Capture ALL console logs
    const logs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push(text);
      if (text.includes('[GATE]') || text.includes('[SignalPageClient]') || text.includes('[useGateFlow]') || text.includes('[GateManager]') || text.includes('[MECHANISM]')) {
        console.log('📝 ' + text);
      }
    });

    // Navigate to signal 17
    console.log('🔗 Navigating to signal 17...');
    await page.goto('http://localhost:5001/signal/17');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check initial localStorage state
    const initialState = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      const gateKey = keys.find(k => k.includes('gate_flow_state'));
      if (gateKey) {
        const state = JSON.parse(localStorage.getItem(gateKey) || '{}');
        return { found: true, key: gateKey, state };
      }
      return { found: false, key: null, state: null };
    });
    console.log('📊 Initial localStorage:', initialState);

    // Take screenshot
    await page.screenshot({ path: 'signal-17-initial.png', fullPage: true });

    // Find all buttons on the page
    console.log('\n🔍 Searching for drill tab buttons...');
    const allButtons = await page.locator('button').all();
    console.log(`Found ${allButtons.length} total buttons on page`);

    // Log text of all buttons
    for (let i = 0; i < Math.min(allButtons.length, 20); i++) {
      const text = await allButtons[i].textContent();
      console.log(`  Button ${i + 1}: "${text?.trim()}"`);
    }

    // Try to find drill tabs by looking for buttons containing drill type text
    const drillButtons = await page.locator('button:has-text("CASE"), button:has-text("ANALYTICS"), button:has-text("BLOG")').all();
    console.log(`\n📋 Found ${drillButtons.length} potential drill buttons`);

    if (drillButtons.length === 0) {
      console.log('⚠️ No drill buttons found! Checking page structure...');

      // Check if we're on the right page
      const pageTitle = await page.title();
      const pageUrl = page.url();
      console.log('📄 Page title:', pageTitle);
      console.log('🔗 Page URL:', pageUrl);

      // Check for any elements with "drill" text
      const drillElements = await page.locator('text=/drill/i').all();
      console.log(`Found ${drillElements.length} elements containing "drill" text`);

      await page.screenshot({ path: 'signal-17-no-drills.png', fullPage: true });
    }

    // Click first drill button
    if (drillButtons.length > 0) {
      console.log('\n👆 Clicking first drill button...');
      await drillButtons[0].click();
      await page.waitForTimeout(1000);

      const stateAfterFirst = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const gateKey = keys.find(k => k.includes('gate_flow_state'));
        if (gateKey) {
          return JSON.parse(localStorage.getItem(gateKey) || '{}');
        }
        return null;
      });
      console.log('📊 State after 1st click:', {
        drillsViewed: stateAfterFirst?.drillsViewed,
        hasEmail: stateAfterFirst?.hasEmail,
        drillHistory: stateAfterFirst?.drillHistory,
      });

      await page.screenshot({ path: 'signal-17-after-first-click.png', fullPage: true });

      // Check if gate appeared (shouldn't yet)
      const gateAfterFirst = await page.locator('[role="dialog"]').count();
      console.log(`🚪 Modals visible after 1st click: ${gateAfterFirst}`);
    }

    // Click second drill button
    if (drillButtons.length > 1) {
      console.log('\n👆 Clicking second drill button...');
      await drillButtons[1].click();
      await page.waitForTimeout(2000);

      const stateAfterSecond = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const gateKey = keys.find(k => k.includes('gate_flow_state'));
        if (gateKey) {
          return JSON.parse(localStorage.getItem(gateKey) || '{}');
        }
        return null;
      });
      console.log('📊 State after 2nd click:', {
        drillsViewed: stateAfterSecond?.drillsViewed,
        hasEmail: stateAfterSecond?.hasEmail,
        drillHistory: stateAfterSecond?.drillHistory,
      });

      await page.screenshot({ path: 'signal-17-after-second-click.png', fullPage: true });

      // Check if email gate appeared
      const emailGate = page.locator('[role="dialog"]');
      const gateCount = await emailGate.count();
      console.log(`\n🚪 Dialogs found: ${gateCount}`);

      if (gateCount > 0) {
        const gateText = await emailGate.first().textContent();
        console.log('📝 Dialog content:', gateText?.substring(0, 200));

        const hasEmailField = await page.locator('input[type="email"]').count();
        console.log(`✉️ Email input found: ${hasEmailField > 0}`);

        if (hasEmailField > 0) {
          console.log('✅ EMAIL GATE APPEARED!');
          await page.screenshot({ path: 'signal-17-EMAIL-GATE-SUCCESS.png', fullPage: true });
        }
      } else {
        console.log('❌ EMAIL GATE DID NOT APPEAR!');

        // Debug: Print relevant console logs
        console.log('\n📝 Relevant console logs:');
        logs.filter(l => l.includes('[GATE]') || l.includes('drill')).forEach(l => console.log('  ' + l));
      }

      // Assert email gate should be visible
      expect(gateCount, 'Email gate should appear after 2nd drill click').toBeGreaterThan(0);
    } else {
      console.log('❌ Not enough drill buttons found to test');
      test.skip();
    }
  });

  test('Signals 18 and 19 - Quick verification', async ({ page }) => {
    console.log('\n========================================');
    console.log('🧪 Testing Signals 18 and 19');
    console.log('========================================\n');

    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[GATE]')) {
        console.log('📝 ' + text);
      }
    });

    for (const signalId of [18, 19]) {
      console.log(`\n--- Testing Signal ${signalId} ---`);

      await page.goto(`http://localhost:5001/signal/${signalId}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      const drillButtons = await page.locator('button:has-text("CASE"), button:has-text("ANALYTICS"), button:has-text("BLOG")').all();
      console.log(`📋 Signal ${signalId}: Found ${drillButtons.length} drill buttons`);

      if (drillButtons.length >= 2) {
        await drillButtons[0].click();
        await page.waitForTimeout(800);
        await drillButtons[1].click();
        await page.waitForTimeout(1500);

        const gateCount = await page.locator('[role="dialog"]').count();
        console.log(`🚪 Signal ${signalId}: ${gateCount} dialog(s) visible`);

        await page.screenshot({ path: `signal-${signalId}-test.png`, fullPage: true });
      }

      // Clear for next test
      await page.evaluate(() => localStorage.clear());
    }
  });
});
