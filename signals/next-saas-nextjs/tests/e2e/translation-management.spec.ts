import { test, expect } from '@playwright/test';

test.describe('Translation Management System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin panel and login
    await page.goto('http://localhost:5001/admin');

    // Enter admin password (6262)
    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill('6262');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display admin dashboard', async ({ page }) => {
    // Verify admin dashboard loads
    await expect(page.locator('h1:has-text("Website Control Center")')).toBeVisible();
  });

  test('should navigate to translations page', async ({ page }) => {
    // Click on translations route
    const translationsLink = page.locator('a[href="/admin/translations"]').first();
    await translationsLink.click();

    // Wait for translations page to load
    await page.waitForURL('**/admin/translations');

    // Verify translations page header
    await expect(page.locator('h1:has-text("Translation Management")')).toBeVisible();
  });

  test('should display translation stats dashboard', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Verify stats cards are visible
    await expect(page.locator('text=Total Items')).toBeVisible();
    await expect(page.locator('text=Pending Review')).toBeVisible();
    await expect(page.locator('text=Approved')).toBeVisible();
    await expect(page.locator('text=Rejected')).toBeVisible();
    await expect(page.locator('text=Not Translated')).toBeVisible();
  });

  test('should display static UI translations tab', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Click on Static UI tab
    await page.locator('button:has-text("Static UI")').click();

    // Verify table headers
    await expect(page.locator('th:has-text("File")')).toBeVisible();
    await expect(page.locator('th:has-text("Key")')).toBeVisible();
    await expect(page.locator('th:has-text("English")')).toBeVisible();
    await expect(page.locator('th:has-text("اردو")')).toBeVisible();

    // Verify at least one translation row exists
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('should display dynamic content translations tab', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Click on Dynamic Content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Verify table headers
    await expect(page.locator('th:has-text("Type")')).toBeVisible();
    await expect(page.locator('th:has-text("Key")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();

    // Verify sample data exists (from seed)
    await expect(page.locator('text=btc_buy_signal_001')).toBeVisible();
  });

  test('should filter translations by search term', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Switch to dynamic content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Type in search box
    const searchInput = page.locator('input[placeholder*="Search translations"]');
    await searchInput.fill('Bitcoin');

    // Verify filtered results
    await expect(page.locator('text=Bitcoin Buy Signal')).toBeVisible();
  });

  test('should filter dynamic translations by status', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Switch to dynamic content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Select "Pending" status filter
    const statusFilter = page.locator('select');
    await statusFilter.selectOption('pending');

    // Verify only pending items are shown
    const pendingBadges = page.locator('span:has-text("Pending")');
    await expect(pendingBadges.first()).toBeVisible();
  });

  test('should display status badges correctly', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Switch to dynamic content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Verify different status badges exist
    await expect(page.locator('span:has-text("⏳ Pending")')).toBeVisible();
    await expect(page.locator('span:has-text("✅ Approved")')).toBeVisible();
    await expect(page.locator('span:has-text("❌ Rejected")')).toBeVisible();
  });

  test('should show approve/reject buttons for pending translations', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Switch to dynamic content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Find a pending translation row
    const pendingRow = page.locator('tr:has(span:has-text("⏳ Pending"))').first();

    // Verify approve and reject buttons exist
    await expect(pendingRow.locator('button:has-text("Approve")')).toBeVisible();
    await expect(pendingRow.locator('button:has-text("Reject")')).toBeVisible();
  });

  test('should approve a translation', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Switch to dynamic content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Find the first pending translation
    const pendingRow = page.locator('tr:has(span:has-text("⏳ Pending"))').first();

    // Get the translation key before approving
    const translationKey = await pendingRow.locator('td:nth-child(2)').textContent();

    // Click approve button
    await pendingRow.locator('button:has-text("Approve")').click();

    // Wait for the page to reload or update
    await page.waitForTimeout(1000);

    // Verify the translation is now approved
    const approvedRow = page.locator(`tr:has-text("${translationKey}")`);
    await expect(approvedRow.locator('span:has-text("✅ Approved")')).toBeVisible();
  });

  test('should reject a translation with reason', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Switch to dynamic content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Find the first pending translation
    const pendingRow = page.locator('tr:has(span:has-text("⏳ Pending"))').first();

    // Get the translation key before rejecting
    const translationKey = await pendingRow.locator('td:nth-child(2)').textContent();

    // Set up dialog handler to provide rejection reason
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Reason for rejection');
      await dialog.accept('Translation quality needs improvement');
    });

    // Click reject button
    await pendingRow.locator('button:has-text("Reject")').click();

    // Wait for the page to reload or update
    await page.waitForTimeout(1000);

    // Verify the translation is now rejected
    const rejectedRow = page.locator(`tr:has-text("${translationKey}")`);
    await expect(rejectedRow.locator('span:has-text("❌ Rejected")')).toBeVisible();
  });

  test('should display RTL text correctly for Urdu', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Switch to dynamic content tab
    await page.locator('button:has-text("Dynamic Content")').click();

    // Find a cell with Urdu text
    const urduCell = page.locator('td span[dir="rtl"]').first();

    // Verify RTL direction is set
    await expect(urduCell).toHaveAttribute('dir', 'rtl');
  });

  test('should show info box explaining translation system', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Verify info box is visible
    await expect(page.locator('text=How Translation Works')).toBeVisible();
    await expect(page.locator('text=Static UI Translations')).toBeVisible();
    await expect(page.locator('text=Dynamic Content')).toBeVisible();
  });

  test('should have back to admin button', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Verify back button exists
    const backButton = page.locator('a:has-text("Back to Admin")');
    await expect(backButton).toBeVisible();

    // Click back button
    await backButton.click();

    // Verify we're back on admin dashboard
    await page.waitForURL('**/admin');
    await expect(page.locator('h1:has-text("Website Control Center")')).toBeVisible();
  });

  test('should load static translations from JSON files', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Verify static tab shows translations
    await page.locator('button:has-text("Static UI")').click();

    // Verify common.json translations are loaded
    await expect(page.locator('td:has-text("common.json")')).toBeVisible();

    // Verify hero.json translations are loaded
    await expect(page.locator('td:has-text("hero.json")')).toBeVisible();

    // Verify signals.json translations are loaded
    await expect(page.locator('td:has-text("signals.json")')).toBeVisible();
  });

  test('should display correct translation counts', async ({ page }) => {
    await page.goto('http://localhost:5001/admin/translations');

    // Get the counts from tab labels
    const staticTabText = await page.locator('button:has-text("Static UI")').textContent();
    const dynamicTabText = await page.locator('button:has-text("Dynamic Content")').textContent();

    // Verify counts are present and numeric
    expect(staticTabText).toMatch(/\d+ items/);
    expect(dynamicTabText).toMatch(/\d+ items/);
  });
});
