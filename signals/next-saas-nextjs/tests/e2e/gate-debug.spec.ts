import { test, expect } from '@playwright/test';

test('Debug drill counting', async ({ page }) => {
  // Capture console logs
  const logs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    logs.push(text);
    if (text.includes('[GATE]') || text.includes('[SignalPageClient]') || text.includes('[useGateFlow]')) {
      console.log('📋 Browser log:', text);
    }
  });

  // Clear storage
  await page.goto('http://localhost:5001/en/signal/1');
  await page.evaluate(() => localStorage.clear());

  console.log('\n🔍 DEBUG TEST: Checking drill counting\n');

  // View signal #1
  console.log('📍 Step 1: Navigate to signal #1');
  await page.goto('http://localhost:5001/en/signal/1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Wait longer

  let state = await page.evaluate(() => {
    const key = Object.keys(localStorage).find(k => k.includes('gate_flow_state'));
    if (key) {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      console.log('[TEST] After signal #1, state:', data);
      return data;
    }
    return null;
  });

  console.log('State after signal #1:', state);
  expect(state).not.toBeNull();
  expect(state.drillsViewed).toBe(1);

  // View signal #2 - should trigger email gate
  console.log('\n📍 Step 2: Navigate to signal #2 (should trigger email gate)');
  await page.goto('http://localhost:5001/en/signal/2');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Check for email gate
  const emailGate = page.locator('text=Unlock Unlimited Signals');
  await expect(emailGate).toBeVisible({ timeout: 5000 });
  console.log('✅ Email gate appeared');

  // Submit email
  await page.locator('input[type="email"]').fill('debug@example.com');
  await page.locator('button:has-text("Get Free Access")').click();
  await page.waitForTimeout(2000);

  state = await page.evaluate(() => {
    const key = Object.keys(localStorage).find(k => k.includes('debug'));
    if (key) {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      console.log('[TEST] After email submit, state:', data);
      return data;
    }
    return null;
  });

  console.log('State after email submit:', state);
  expect(state).not.toBeNull();
  expect(state.hasEmail).toBe(true);
  expect(state.drillsViewed).toBe(2);

  // View signal #3
  console.log('\n📍 Step 3: Navigate to signal #3');
  await page.goto('http://localhost:5001/en/signal/3');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  state = await page.evaluate(() => {
    const key = Object.keys(localStorage).find(k => k.includes('debug'));
    if (key) {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      console.log('[TEST] After signal #3, state:', data);
      return data;
    }
    return null;
  });

  console.log('State after signal #3:', state);
  console.log('Drill history:', state?.drillHistory);

  expect(state).not.toBeNull();
  console.log(`Expected drillsViewed: 3, Actual: ${state.drillsViewed}`);

  if (state.drillsViewed !== 3) {
    console.error('❌ FAIL: Drill count did not increment from 2 to 3');
    console.error('This means recordDrillView(3) was either not called or returned early');
  } else {
    console.log('✅ SUCCESS: Drill count incremented correctly');
  }
});
