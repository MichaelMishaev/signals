import { test, expect } from '@playwright/test';

test.describe('Popup System - Quick Verification', () => {

  test('Bug Fix: Email submission does NOT trigger exit popup', async ({ page }) => {
    console.log('\n🧪 Testing: Email submission should NOT trigger exit popup');

    await page.goto('http://localhost:5001/broker-popup-test');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1000);

    // Simulate email subscription (the bug scenario)
    await page.click('text=Email Not Subscribed');
    await page.waitForTimeout(500);

    // Move mouse to trigger exit intent
    await page.mouse.move(500, 0);
    await page.waitForTimeout(1000);

    // Exit popup SHOULD appear (email is subscribed)
    const exitPopup = await page.locator('text=Wait! Get 3 bonus signals').isVisible();
    expect(exitPopup).toBe(true);
    console.log('✅ Exit popup appears for email subscriber - CORRECT');

    // Close popup
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Now test the actual bug fix: reset and go to signal page
    await page.click('text=🔄 Reset Everything');
    await page.waitForTimeout(1500);

    await page.goto('http://localhost:5001/signal/1');
    await page.waitForTimeout(2000);

    // Check for email form and submit if found
    const emailInput = await page.locator('input[type="email"]').first().isVisible().catch(() => false);

    if (emailInput) {
      await page.locator('input[type="email"]').first().fill('test@example.com');
      await page.locator('input[type="text"]').first().fill('Test User');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // BUG CHECK: Exit popup should NOT appear after email submit
      const buggyPopup = await page.locator('text=Wait! Get 3 bonus signals').isVisible().catch(() => false);
      expect(buggyPopup).toBe(false);
      console.log('✅ Email submission does NOT trigger exit popup - BUG FIXED!');
    }
  });

  test('Bug Fix: ANALYSIS toaster is removed', async ({ page }) => {
    console.log('\n🧪 Testing: ANALYSIS toaster should be removed');

    await page.goto('http://localhost:5001/signal/1');
    await page.waitForTimeout(3000);

    // Check for ANALYSIS toaster
    const analysisToast = await page.locator('text=ANALYSIS').isVisible().catch(() => false);
    expect(analysisToast).toBe(false);
    console.log('✅ ANALYSIS toaster removed - BUG FIXED!');
  });

  test('Content Access Popup works', async ({ page }) => {
    console.log('\n🧪 Testing: Content Access Popup');

    await page.goto('http://localhost:5001/broker-popup-test');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1000);

    await page.click('text=Trigger Content Access Popup');
    await page.waitForTimeout(500);

    const popup = await page.locator('text=Unlock exclusive trading signals').isVisible();
    expect(popup).toBe(true);
    console.log('✅ Content Access Popup works');
  });

  test('Fourth Action Popup shows ONCE only', async ({ page }) => {
    console.log('\n🧪 Testing: Fourth Action Popup (once only)');

    await page.goto('http://localhost:5001/broker-popup-test');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1000);

    // Click Track Action 4 times
    for (let i = 0; i < 4; i++) {
      await page.click('text=Track Action');
      await page.waitForTimeout(300);
    }

    // Should show popup
    const popup = await page.locator('text=$10 account').isVisible();
    expect(popup).toBe(true);
    console.log('✅ Fourth Action Popup appears on 4th action');

    // Close it
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Click 4 more times - should NOT show again
    for (let i = 0; i < 4; i++) {
      await page.click('text=Track Action');
      await page.waitForTimeout(200);
    }

    const popupAgain = await page.locator('text=$10 account').isVisible().catch(() => false);
    expect(popupAgain).toBe(false);
    console.log('✅ Fourth Action Popup shows ONCE only - CORRECT');
  });

  test('Only ONE popup shows at a time', async ({ page }) => {
    console.log('\n🧪 Testing: Only one popup at a time');

    await page.goto('http://localhost:5001/broker-popup-test');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Trigger content access
    await page.click('text=Trigger Content Access Popup');
    await page.waitForTimeout(300);

    // Try to trigger another while first is showing
    await page.click('text=Track Action');
    await page.waitForTimeout(300);

    // Count overlays
    const overlays = await page.locator('.fixed.inset-0.bg-black').count();
    expect(overlays).toBeLessThanOrEqual(1);
    console.log('✅ Only ONE popup shows at a time - CORRECT');
  });
});
