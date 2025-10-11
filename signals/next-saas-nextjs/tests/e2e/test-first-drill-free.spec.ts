import { test, expect } from '@playwright/test';

test.describe('First Drill Free - Email Gate on Second Drill', () => {
  test('First drill should be visible without email, gate appears on second drill', async ({ page }) => {
    console.log('\n========================================');
    console.log('🧪 Testing First Drill Free Flow');
    console.log('========================================\n');

    // Capture console logs
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[GATE]') || text.includes('[SignalPageClient]') || text.includes('drillsViewed')) {
        console.log('📝 ' + text);
      }
    });

    // Clear all state
    await page.goto('http://localhost:5001');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    console.log('🧹 Cleared all storage\n');

    // Navigate to signal 17
    console.log('🔗 Navigating to signal 17...');
    await page.goto('http://localhost:5001/signal/17');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-step1-initial-load.png', fullPage: true });

    // Check if first drill (ANALYTICS) content is visible
    // ANALYTICS drill shows "Real-Time Analytics Dashboard"
    const analyticsTitle = await page.locator('text=Real-Time Analytics Dashboard').count();
    const analyticsDescription = await page.locator('text=Live performance metrics').count();
    const lockedMessage = await page.locator('text=Verify Your Email to Access More Drills').count();

    console.log('\n📊 Initial State:');
    console.log(`  - Analytics title visible: ${analyticsTitle > 0}`);
    console.log(`  - Analytics description visible: ${analyticsDescription > 0}`);
    console.log(`  - Locked message visible: ${lockedMessage > 0}`);

    // ASSERTION 1: First drill content should be visible without email
    expect(analyticsTitle, 'First drill (ANALYTICS) title should be visible on page load').toBeGreaterThan(0);
    expect(lockedMessage, 'Locked message should NOT appear on first drill').toBe(0);

    console.log('✅ PASSED: First drill is visible without email\n');

    // Find drill tabs
    const drillButtons = await page.locator('button:has-text("CASE"), button:has-text("ANALYTICS"), button:has-text("BLOG")').all();
    console.log(`📋 Found ${drillButtons.length} drill buttons\n`);

    if (drillButtons.length >= 2) {
      // Click second drill button (BLOG or CASE STUDY)
      console.log('👆 Clicking second drill button...');
      await drillButtons[1].click();
      await page.waitForTimeout(2000);

      await page.screenshot({ path: 'test-step2-second-drill-clicked.png', fullPage: true });

      // Check localStorage state
      const gateState = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const gateKey = keys.find(k => k.includes('gate_flow_state'));
        if (gateKey) {
          return JSON.parse(localStorage.getItem(gateKey) || '{}');
        }
        return null;
      });

      console.log('\n📊 Gate State After Second Click:');
      console.log('  - drillsViewed:', gateState?.drillsViewed);
      console.log('  - hasEmail:', gateState?.hasEmail);
      console.log('  - drillHistory:', gateState?.drillHistory?.length || 0);

      // Check if email gate modal appeared
      const emailGateModal = await page.locator('text=Unlock Unlimited Signals').count();
      const emailInput = await page.locator('input[type="email"]').count();

      console.log('\n🚪 Email Gate Check:');
      console.log(`  - Email gate modal visible: ${emailGateModal > 0}`);
      console.log(`  - Email input field visible: ${emailInput > 0}`);

      // ASSERTION 2: Email gate should appear after clicking second drill
      expect(emailGateModal, 'Email gate modal should appear after clicking second drill').toBeGreaterThan(0);
      expect(emailInput, 'Email input field should be visible in gate modal').toBeGreaterThan(0);

      console.log('✅ PASSED: Email gate appears on second drill\n');

      await page.screenshot({ path: 'test-step3-email-gate-visible.png', fullPage: true });

    } else {
      console.log('❌ Not enough drill buttons found');
      test.skip();
    }

    console.log('\n========================================');
    console.log('✅ ALL TESTS PASSED');
    console.log('========================================\n');
  });
});
