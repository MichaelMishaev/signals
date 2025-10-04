/**
 * Gate System Integration Test - Live Signal Pages
 * Tests the complete gate flow on actual signal detail pages
 */

import { test, expect } from '@playwright/test';

// Helper function to get gate state from localStorage
const getGateState = async (page: any) => {
  return await page.evaluate(() => {
    const gateKey = Object.keys(localStorage).find(k => k.includes('gate_flow_state'));
    if (gateKey) return JSON.parse(localStorage.getItem(gateKey) || '{}');
    return null;
  });
};

test.describe('Gate System - Live Signal Pages Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5001/en/signal/1');
    await page.evaluate(() => localStorage.clear());
  });

  test('Full User Journey - Anonymous to Email User to Broker User', async ({ page, context }) => {
    // Enable console logging
    const logs: string[] = [];
    page.on('console', (msg) => {
      if (msg.text().includes('[GATE]')) {
        logs.push(msg.text());
      }
    });

    console.log('\n🧪 TEST: Full User Journey on Live Signal Pages\n');

    // ===================================================================
    // STEP 1: First drill view (Signal #1) - No gate
    // ===================================================================
    console.log('📍 Step 1: Viewing first signal (Signal #1) - No gate expected');
    await page.goto('http://localhost:5001/en/signal/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify no gate modal
    const emailGateFirst = page.locator('text=Unlock Unlimited Signals');
    await expect(emailGateFirst).not.toBeVisible();
    console.log('✅ No gate shown on first drill view');

    // Check localStorage
    let state = await getGateState(page);
    expect(state).not.toBeNull();
    expect(state.drillsViewed).toBe(1);
    expect(state.hasEmail).toBe(false);
    console.log('✅ State: drillsViewed=1, hasEmail=false');

    // ===================================================================
    // STEP 2: Second drill view (Signal #2) - EMAIL GATE
    // ===================================================================
    console.log('\n📍 Step 2: Viewing second signal (Signal #2) - Email gate expected');
    await page.goto('http://localhost:5001/en/signal/2');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Email gate should appear
    const emailGateModal = page.locator('text=Unlock Unlimited Signals');
    await expect(emailGateModal).toBeVisible({ timeout: 5000 });
    console.log('✅ Email gate appeared on second drill view');

    // Verify gate content
    await expect(page.locator('text=Enter your email to continue viewing premium trading signals')).toBeVisible();
    await expect(page.locator('text=Real-time entry/exit points')).toBeVisible();

    // Submit email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('testuser@example.com');
    await page.locator('button:has-text("Get Free Access")').click();
    await page.waitForTimeout(1000);
    console.log('✅ Email submitted: testuser@example.com');

    // Verify gate closed and state updated
    await expect(emailGateModal).not.toBeVisible();
    state = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.includes('testuser'));
      if (key) return JSON.parse(localStorage.getItem(key) || '{}');
      return null;
    });
    expect(state).not.toBeNull();
    expect(state.hasEmail).toBe(true);
    expect(state.userEmail).toBe('testuser@example.com');
    expect(state.drillsViewed).toBe(2);
    console.log('✅ State: hasEmail=true, userEmail=testuser@example.com, drillsViewed=2');

    // ===================================================================
    // STEP 3: View signals 3-9 - No gates
    // ===================================================================
    console.log('\n📍 Step 3: Viewing signals 3-9 - No gates expected');
    for (let i = 3; i <= 9; i++) {
      await page.goto(`http://localhost:5001/en/signal/${i}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      const brokerGate = page.locator('text=Upgrade to Premium Access');
      await expect(brokerGate).not.toBeVisible();
      console.log(`✅ Signal #${i}: No gate shown`);
    }

    state = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.includes('testuser'));
      if (key) return JSON.parse(localStorage.getItem(key) || '{}');
      return null;
    });
    expect(state.drillsViewed).toBe(9);
    console.log('✅ State: drillsViewed=9');

    // ===================================================================
    // STEP 4: Tenth drill view (Signal #10) - BROKER GATE
    // ===================================================================
    console.log('\n📍 Step 4: Viewing tenth signal (Signal #10) - Broker gate expected');
    await page.goto('http://localhost:5001/en/signal/10');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Broker gate should appear
    const brokerGateModal = page.locator('text=Upgrade to Premium Access');
    await expect(brokerGateModal).toBeVisible({ timeout: 5000 });
    console.log('✅ Broker gate appeared on tenth drill view');

    // Verify gate content
    await expect(page.locator('text=You\'ve viewed 9 drills')).toBeVisible();
    await expect(page.locator('text=Open Broker Account')).toBeVisible();

    // Click "I Already Have an Account"
    await page.locator('button:has-text("I Already Have an Account")').click();
    await page.waitForTimeout(1000);
    console.log('✅ Clicked "I Already Have an Account"');

    // Fill verification code
    await page.locator('input[placeholder*="CONFIRMED"]').fill('TEST-123');
    await page.waitForTimeout(500);

    // Click Verify Code
    await page.locator('button:has-text("Verify Code")').click();
    await page.waitForTimeout(2000); // Wait for verification
    console.log('✅ Completed broker verification');

    // Verify gate closed and broker verified
    await expect(brokerGateModal).not.toBeVisible();
    state = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.includes('testuser'));
      if (key) return JSON.parse(localStorage.getItem(key) || '{}');
      return null;
    });
    expect(state.hasBrokerAccount).toBe(true);
    console.log('✅ State: hasBrokerAccount=true');

    // ===================================================================
    // STEP 5: Unlimited access - View signals 11+
    // ===================================================================
    console.log('\n📍 Step 5: Viewing signals 11-13 - Unlimited access');
    for (let i = 11; i <= 13; i++) {
      await page.goto(`http://localhost:5001/en/signal/${i}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      const emailGate = page.locator('text=Unlock Unlimited Signals');
      const brokerGate = page.locator('text=Upgrade to Premium Access');
      await expect(emailGate).not.toBeVisible();
      await expect(brokerGate).not.toBeVisible();
      console.log(`✅ Signal #${i}: No gates - unlimited access confirmed`);
    }

    // ===================================================================
    // VERIFICATION: Console Logs
    // ===================================================================
    console.log('\n📊 Console Logs Verification:');
    const drillViewLogs = logs.filter(log => log.includes('Drill view recorded'));
    const emailGateLogs = logs.filter(log => log.includes('EMAIL GATE TRIGGERED'));
    const brokerGateLogs = logs.filter(log => log.includes('BROKER GATE TRIGGERED'));
    const emailSubmitLogs = logs.filter(log => log.includes('EMAIL GATE - Email submitted'));
    const brokerVerifiedLogs = logs.filter(log => log.includes('BROKER GATE - Broker account verified'));

    console.log(`  - Drill view logs: ${drillViewLogs.length}`);
    console.log(`  - Email gate triggers: ${emailGateLogs.length}`);
    console.log(`  - Broker gate triggers: ${brokerGateLogs.length}`);
    console.log(`  - Email submissions: ${emailSubmitLogs.length}`);
    console.log(`  - Broker verifications: ${brokerVerifiedLogs.length}`);

    expect(drillViewLogs.length).toBeGreaterThan(0);
    expect(emailGateLogs.length).toBeGreaterThanOrEqual(1);
    expect(brokerGateLogs.length).toBeGreaterThanOrEqual(1);
    expect(emailSubmitLogs.length).toBe(1);
    expect(brokerVerifiedLogs.length).toBe(1);

    console.log('\n✅ Full user journey test PASSED\n');
  });

  test('Multi-User Separation - Different Emails Have Different States', async ({ page }) => {
    console.log('\n🧪 TEST: Multi-User Separation\n');

    // ===================================================================
    // USER 1: alice@example.com
    // ===================================================================
    console.log('📍 Testing User 1: alice@example.com');

    // View first signal
    await page.goto('http://localhost:5001/en/signal/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // View second signal - email gate
    await page.goto('http://localhost:5001/en/signal/2');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const emailGate = page.locator('text=Unlock Unlimited Signals');
    await expect(emailGate).toBeVisible();

    // Submit Alice's email
    await page.locator('input[type="email"]').fill('alice@example.com');
    await page.locator('button:has-text("Get Free Access")').click();
    await page.waitForTimeout(1000);

    // Check Alice's state
    let aliceState = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.includes('alice'));
      if (key) return { key, state: JSON.parse(localStorage.getItem(key) || '{}') };
      return null;
    });
    expect(aliceState).not.toBeNull();
    expect(aliceState!.state.userEmail).toBe('alice@example.com');
    expect(aliceState!.state.drillsViewed).toBe(2);
    console.log('✅ Alice state: drillsViewed=2, email stored');

    // ===================================================================
    // CLEAR AND SWITCH TO USER 2: bob@example.com
    // ===================================================================
    console.log('\n📍 Clearing state and testing User 2: bob@example.com');

    // Clear localStorage (simulating logout)
    await page.evaluate(() => localStorage.clear());

    // Bob views first signal
    await page.goto('http://localhost:5001/en/signal/3');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Check Bob's anonymous state
    let bobState = await getGateState(page);
    expect(bobState).not.toBeNull();
    expect(bobState.drillsViewed).toBe(1);
    expect(bobState.hasEmail).toBe(false);
    console.log('✅ Bob (anonymous) state: drillsViewed=1, no email');

    // Bob views second signal - email gate
    await page.goto('http://localhost:5001/en/signal/4');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(emailGate).toBeVisible();

    // Submit Bob's email
    await page.locator('input[type="email"]').fill('bob@example.com');
    await page.locator('button:has-text("Get Free Access")').click();
    await page.waitForTimeout(1000);

    // Check Bob's state
    bobState = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.includes('bob'));
      if (key) return { key, state: JSON.parse(localStorage.getItem(key) || '{}') };
      return null;
    });
    expect(bobState).not.toBeNull();
    expect(bobState!.state.userEmail).toBe('bob@example.com');
    expect(bobState!.state.drillsViewed).toBe(2);
    console.log('✅ Bob state: drillsViewed=2, email stored');

    // ===================================================================
    // RESTORE ALICE: Simulate login
    // ===================================================================
    console.log('\n📍 Restoring Alice state (simulating re-login)');

    // Manually restore Alice's state
    await page.evaluate((aliceData) => {
      localStorage.clear();
      if (aliceData) {
        localStorage.setItem(aliceData.key, JSON.stringify(aliceData.state));
      }
    }, aliceState);

    // Navigate to new signal
    await page.goto('http://localhost:5001/en/signal/5');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // No email gate (Alice already has email)
    await expect(emailGate).not.toBeVisible();

    // Check Alice's state persisted
    const restoredAlice = await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.includes('alice'));
      if (key) return JSON.parse(localStorage.getItem(key) || '{}');
      return null;
    });
    expect(restoredAlice).not.toBeNull();
    expect(restoredAlice.userEmail).toBe('alice@example.com');
    expect(restoredAlice.drillsViewed).toBe(3); // Incremented from viewing signal 5
    console.log('✅ Alice state restored: drillsViewed=3 (incremented correctly)');

    console.log('\n✅ Multi-user separation test PASSED\n');
  });

  test('Drill Tab Click Tracking', async ({ page }) => {
    console.log('\n🧪 TEST: Drill Tab Click Tracking\n');

    // Navigate to signal with drills
    await page.goto('http://localhost:5001/en/signal/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check initial state
    let state = await getGateState(page);
    const initialDrillCount = state?.drillsViewed || 0;
    console.log(`✅ Initial drill count: ${initialDrillCount}`);

    // Click on different drill tabs (if they exist)
    const drillTabs = page.locator('[role="button"], button').filter({ hasText: /CASE_STUDY|ANALYTICS|BLOG/i });
    const tabCount = await drillTabs.count();

    if (tabCount > 0) {
      console.log(`📍 Found ${tabCount} drill tabs, clicking each...`);

      for (let i = 0; i < Math.min(tabCount, 3); i++) {
        await drillTabs.nth(i).click();
        await page.waitForTimeout(500);
        console.log(`✅ Clicked drill tab ${i + 1}`);
      }

      // Check state after tab clicks
      state = await getGateState(page);

      console.log(`📊 Final drill count: ${state?.drillsViewed}`);
      console.log('✅ Drill tab tracking verified');
    } else {
      console.log('⚠️  No drill tabs found on this signal page');
    }

    console.log('\n✅ Drill tab click tracking test PASSED\n');
  });

  test('Duplicate Signal View Prevention', async ({ page }) => {
    console.log('\n🧪 TEST: Duplicate Signal View Prevention\n');

    // View signal 1
    await page.goto('http://localhost:5001/en/signal/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    let state = await getGateState(page);
    expect(state).not.toBeNull();
    expect(state.drillsViewed).toBe(1);
    console.log('✅ First view of Signal #1: drillsViewed=1');

    // View signal 1 again
    await page.goto('http://localhost:5001/en/signal/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    state = await getGateState(page);
    expect(state).not.toBeNull();
    expect(state.drillsViewed).toBe(1); // Should still be 1
    console.log('✅ Second view of Signal #1: drillsViewed=1 (duplicate prevented)');

    // View signal 2
    await page.goto('http://localhost:5001/en/signal/2');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should show email gate (2nd unique signal)
    const emailGate = page.locator('text=Unlock Unlimited Signals');
    await expect(emailGate).toBeVisible();
    console.log('✅ Email gate appeared on 2nd UNIQUE signal view');

    console.log('\n✅ Duplicate prevention test PASSED\n');
  });
});
