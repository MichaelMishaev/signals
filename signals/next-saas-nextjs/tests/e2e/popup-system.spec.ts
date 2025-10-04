import { test, expect } from '@playwright/test';

test.describe('Broker Popup System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5001/broker-popup-test');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should show idle popup after 60 seconds of inactivity', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Wait for idle popup (with buffer)
    await page.waitForTimeout(62000);

    // Check if idle popup appeared
    const popup = await page.locator('text=Start trading today').first();
    await expect(popup).toBeVisible({ timeout: 5000 });
  });

  test('should show content access popup when triggered', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Click trigger content access button
    await page.click('text=Trigger Content Access Popup');

    // Check if content access popup appeared
    const popup = await page.locator('text=Unlock exclusive trading signals').first();
    await expect(popup).toBeVisible({ timeout: 3000 });
  });

  test('should show 4th action popup on exactly 4th click', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Click "Track Action" button 4 times
    const trackButton = page.locator('text=Track Action');

    for (let i = 0; i < 4; i++) {
      await trackButton.click();
      await page.waitForTimeout(500);
    }

    // Check if 4th action popup appeared
    const popup = await page.locator('text=$10 account').first();
    await expect(popup).toBeVisible({ timeout: 3000 });
  });

  test('should NOT show 4th action popup twice', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Click "Track Action" button 4 times
    const trackButton = page.locator('text=Track Action');
    for (let i = 0; i < 4; i++) {
      await trackButton.click();
      await page.waitForTimeout(300);
    }

    // Close the popup
    await page.click('.bg-black\\/80');

    // Click 4 more times
    for (let i = 0; i < 4; i++) {
      await trackButton.click();
      await page.waitForTimeout(300);
    }

    // 4th action popup should NOT appear again
    const popup = page.locator('text=$10 account');
    await expect(popup).not.toBeVisible();
  });

  test('should show exit intent popup only for email subscribers', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Toggle email subscription ON
    await page.click('text=Email Not Subscribed');
    await page.waitForTimeout(500);

    // Simulate exit intent by moving mouse to top
    await page.mouse.move(100, 0);
    await page.waitForTimeout(1000);

    // Check if exit intent popup appeared
    const popup = await page.locator('text=Wait! Get 3 bonus signals').first();
    await expect(popup).toBeVisible({ timeout: 3000 });
  });

  test('should NOT show exit intent if broker account opened', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Toggle both email subscription and broker account ON
    await page.click('text=Email Not Subscribed');
    await page.waitForTimeout(300);
    await page.click('text=No Broker Account');
    await page.waitForTimeout(300);

    // Simulate exit intent
    await page.mouse.move(100, 0);
    await page.waitForTimeout(2000);

    // Exit intent popup should NOT appear
    const popup = page.locator('text=Wait! Get 3 bonus signals');
    await expect(popup).not.toBeVisible();
  });

  test('should not show multiple popups at once', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Trigger content access popup
    await page.click('text=Trigger Content Access Popup');
    await page.waitForTimeout(500);

    // Try to trigger another popup while first is showing
    await page.click('text=Track Action');
    await page.waitForTimeout(500);

    // Count visible popups (should only be 1)
    const popups = await page.locator('.fixed.inset-0.bg-black').count();
    expect(popups).toBeLessThanOrEqual(1);
  });

  test('should reset action count when clicking reset button', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Click track action 3 times
    const trackButton = page.locator('text=Track Action');
    for (let i = 0; i < 3; i++) {
      await trackButton.click();
      await page.waitForTimeout(200);
    }

    // Verify action count is 3
    await expect(page.locator('text=/\\(3\\/4\\)/')).toBeVisible();

    // Click reset
    await page.click('text=🔄 Reset Everything');
    await page.waitForTimeout(2000);

    // Verify action count reset to 0
    await expect(page.locator('text=/\\(0\\/4\\)/')).toBeVisible();
  });

  test('popups should be dismissible', async ({ page }) => {
    await page.goto('http://localhost:5001/broker-popup-test');

    // Trigger content access popup
    await page.click('text=Trigger Content Access Popup');
    await page.waitForTimeout(500);

    // Close by clicking overlay
    await page.click('.bg-black\\/80', { position: { x: 10, y: 10 } });
    await page.waitForTimeout(500);

    // Popup should be gone
    const popup = page.locator('text=Unlock exclusive trading signals');
    await expect(popup).not.toBeVisible();
  });
});
