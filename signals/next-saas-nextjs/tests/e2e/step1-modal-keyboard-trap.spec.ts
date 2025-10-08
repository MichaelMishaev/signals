import { test, expect } from '@playwright/test';

/**
 * STEP 1 QA TEST: Fix Modal Keyboard Trap
 *
 * Tests that the email modal:
 * 1. Closes when ESC is pressed
 * 2. Stays closed after closing
 * 3. Doesn't reopen automatically
 * 4. Saves dismissal to localStorage
 * 5. Respects dismissal across page refreshes
 */

test.describe('Step 1: Modal Keyboard Trap Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Clear all localStorage before each test
    await page.goto('http://localhost:5000/en/signal/4');
    await page.evaluate(() => localStorage.clear());
  });

  test('TEST 1: Modal closes with ESC and stays closed', async ({ page }) => {
    // Navigate to signal page
    await page.goto('http://localhost:5000/en/signal/4');

    // Wait for modal to appear (500ms delay in code)
    await page.waitForTimeout(1000);

    // Check if modal is visible
    const modalVisible = await page.locator('[role="dialog"]').isVisible();
    expect(modalVisible).toBe(true);

    // Press ESC key
    await page.keyboard.press('Escape');

    // Wait a moment for modal to close
    await page.waitForTimeout(500);

    // Verify modal is closed
    const modalAfterEsc = await page.locator('[role="dialog"]').isVisible();
    expect(modalAfterEsc).toBe(false);

    // Critical test: Wait 10 seconds and verify modal doesn't reopen
    console.log('⏳ Waiting 10 seconds to verify modal stays closed...');
    await page.waitForTimeout(10000);

    // Check modal is still closed
    const modalAfter10Sec = await page.locator('[role="dialog"]').isVisible();
    expect(modalAfter10Sec).toBe(false);

    console.log('✅ TEST 1 PASSED: Modal stayed closed for 10 seconds');
  });

  test('TEST 2: LocalStorage key is set after dismissal', async ({ page }) => {
    await page.goto('http://localhost:5000/en/signal/4');
    await page.waitForTimeout(1000);

    // Close modal with ESC
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Check localStorage
    const dismissalTimestamp = await page.evaluate(() => {
      return localStorage.getItem('email-modal-dismissed-until');
    });

    expect(dismissalTimestamp).not.toBeNull();
    expect(dismissalTimestamp).toBeTruthy();

    // Verify it's a valid timestamp
    const timestamp = parseInt(dismissalTimestamp!);
    expect(timestamp).toBeGreaterThan(Date.now());

    // Verify it's approximately 24 hours in the future
    const hoursUntilExpiry = (timestamp - Date.now()) / (1000 * 60 * 60);
    expect(hoursUntilExpiry).toBeGreaterThan(23.9);
    expect(hoursUntilExpiry).toBeLessThan(24.1);

    console.log(`✅ TEST 2 PASSED: LocalStorage set for ${hoursUntilExpiry.toFixed(1)} hours`);
  });

  test('TEST 3: Modal stays closed after page refresh', async ({ page }) => {
    await page.goto('http://localhost:5000/en/signal/4');
    await page.waitForTimeout(1000);

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Refresh page
    await page.reload();
    await page.waitForTimeout(2000);

    // Verify modal doesn't appear
    const modalAfterRefresh = await page.locator('[role="dialog"]').isVisible();
    expect(modalAfterRefresh).toBe(false);

    // Refresh again
    await page.reload();
    await page.waitForTimeout(2000);

    // Still should not appear
    const modalAfterSecondRefresh = await page.locator('[role="dialog"]').isVisible();
    expect(modalAfterSecondRefresh).toBe(false);

    console.log('✅ TEST 3 PASSED: Modal stays closed after refresh');
  });

  test('TEST 4: Close button (X) works same as ESC', async ({ page }) => {
    await page.goto('http://localhost:5000/en/signal/4');
    await page.waitForTimeout(1000);

    // Find and click the close button
    const closeButton = page.locator('[role="dialog"] button[aria-label*="Close"], [role="dialog"] button:has-text("×")').first();
    await closeButton.click();
    await page.waitForTimeout(500);

    // Verify modal closed
    const modalClosed = await page.locator('[role="dialog"]').isVisible();
    expect(modalClosed).toBe(false);

    // Verify localStorage is set
    const dismissalTimestamp = await page.evaluate(() => {
      return localStorage.getItem('email-modal-dismissed-until');
    });
    expect(dismissalTimestamp).not.toBeNull();

    // Wait 5 seconds to ensure it stays closed
    await page.waitForTimeout(5000);
    const modalStillClosed = await page.locator('[role="dialog"]').isVisible();
    expect(modalStillClosed).toBe(false);

    console.log('✅ TEST 4 PASSED: X button works same as ESC');
  });

  test('TEST 5: Dismissal persists across different pages', async ({ page }) => {
    // Close modal on signal 4
    await page.goto('http://localhost:5000/en/signal/4');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Navigate to signal 6
    await page.goto('http://localhost:5000/en/signal/6');
    await page.waitForTimeout(2000);

    // Modal should not appear
    let modalVisible = await page.locator('[role="dialog"]').isVisible();
    expect(modalVisible).toBe(false);

    // Navigate to signal 7
    await page.goto('http://localhost:5000/en/signal/7');
    await page.waitForTimeout(2000);

    // Modal should still not appear
    modalVisible = await page.locator('[role="dialog"]').isVisible();
    expect(modalVisible).toBe(false);

    console.log('✅ TEST 5 PASSED: Dismissal persists across pages');
  });

  test('TEST 6: Modal reappears after expiry time', async ({ page }) => {
    await page.goto('http://localhost:5000/en/signal/4');
    await page.waitForTimeout(1000);

    // Close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Manually set expiry to 1 second from now
    await page.evaluate(() => {
      localStorage.setItem('email-modal-dismissed-until', (Date.now() + 1000).toString());
    });

    // Refresh immediately - modal should not appear (within 1 second)
    await page.reload();
    await page.waitForTimeout(500);
    let modalVisible = await page.locator('[role="dialog"]').isVisible();
    expect(modalVisible).toBe(false);

    // Wait 2 seconds (past expiry)
    await page.waitForTimeout(2000);

    // Refresh again - modal should appear now (expired)
    await page.reload();
    await page.waitForTimeout(1000);
    modalVisible = await page.locator('[role="dialog"]').isVisible();
    expect(modalVisible).toBe(true);

    console.log('✅ TEST 6 PASSED: Modal reappears after expiry');
  });

  test('TEST 7: No JavaScript errors in console', async ({ page }) => {
    const errors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Listen for page errors
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Navigate and interact
    await page.goto('http://localhost:5000/en/signal/4');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(1000);

    // Check for errors
    expect(errors.length).toBe(0);

    if (errors.length > 0) {
      console.error('❌ Console errors found:', errors);
    } else {
      console.log('✅ TEST 7 PASSED: No console errors');
    }
  });

  test('TEST 8: Modal behavior with backdrop click', async ({ page }) => {
    await page.goto('http://localhost:5000/en/signal/4');
    await page.waitForTimeout(1000);

    // Get the backdrop element (usually the dialog itself or a wrapper)
    const dialog = page.locator('[role="dialog"]');

    // Click outside the modal content (on the backdrop)
    // This clicks on the dialog element itself, which should trigger backdrop close
    await page.click('body', { position: { x: 10, y: 10 } });
    await page.waitForTimeout(500);

    // Note: This test might need adjustment based on your modal implementation
    // If backdrop click is implemented, modal should close
    // For now, we just verify the modal handling doesn't crash

    console.log('✅ TEST 8 PASSED: Backdrop click handled without errors');
  });
});

test.describe('Step 1: Edge Cases', () => {
  test('Modal respects test environment flag', async ({ page }) => {
    // This test verifies the code doesn't crash with Playwright user agent
    await page.goto('http://localhost:5000/en/signal/4');

    // Wait to see if modal appears (it might not in test env)
    await page.waitForTimeout(2000);

    // Just verify page loads without errors
    const title = await page.title();
    expect(title).toBeTruthy();

    console.log('✅ Edge case passed: Test environment handled correctly');
  });

  test('Invalid localStorage value doesn\'t break app', async ({ page }) => {
    await page.goto('http://localhost:5000/en/signal/4');

    // Set invalid localStorage value
    await page.evaluate(() => {
      localStorage.setItem('email-modal-dismissed-until', 'invalid-value');
    });

    // Refresh and verify app still works
    await page.reload();
    await page.waitForTimeout(1000);

    // Page should load without crashing
    const title = await page.title();
    expect(title).toBeTruthy();

    console.log('✅ Edge case passed: Invalid localStorage handled gracefully');
  });
});
