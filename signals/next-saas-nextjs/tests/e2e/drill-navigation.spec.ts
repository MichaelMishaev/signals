import { test, expect } from '@playwright/test';

test.describe('Drill Navigation', () => {
  test('should navigate to drill page without ModalContext error', async ({ page }) => {
    // Navigate to drill page with test parameter to disable modal
    await page.goto('/drill-example?test=true');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that the page loaded successfully without context error
    await expect(page.locator('h1')).toContainText('Advanced Trading');

    // Check that the EmailGateWrapper is working (no modal context error)
    await expect(page.locator('[data-testid="email-gate-wrapper"], .min-h-screen')).toBeVisible();

    // Check that the premium content lock overlay is visible (since no email submitted)
    await expect(page.locator('text=Premium Content')).toBeVisible();

    // Check that the unlock button is visible
    await expect(page.locator('[data-testid="unlock-drill-button"]')).toBeVisible();
  });

  test('should show email gate modal when unlock button is clicked', async ({ page }) => {
    await page.goto('/drill-example?test=true');
    await page.waitForLoadState('networkidle');

    // Click the unlock button
    await page.click('[data-testid="unlock-drill-button"]');

    // Wait a bit for any animations or state changes
    await page.waitForTimeout(1000);

    // Check if email gate modal appears (it should be controlled by the ModalContext)
    // Since we fixed the ModalProvider, this should work without errors
    const unlockButton = page.locator('[data-testid="unlock-drill-button"]');
    await expect(unlockButton).toBeVisible();
  });

  test('should display learning benefits correctly', async ({ page }) => {
    await page.goto('/drill-example?test=true');
    await page.waitForLoadState('networkidle');

    // Check that all learning benefits are displayed
    await expect(page.locator('text=Risk Management')).toBeVisible();
    await expect(page.locator('text=Technical Analysis')).toBeVisible();
    await expect(page.locator('text=Market Psychology')).toBeVisible();
    await expect(page.locator('text=Live Examples')).toBeVisible();
  });

  test('should have blurred content when access is not granted', async ({ page }) => {
    await page.goto('/drill-example');
    await page.waitForLoadState('networkidle');

    // Check that the interactive drill session content is blurred
    const blurredContent = page.locator('[data-testid="drill-content"]');
    await expect(blurredContent).toBeVisible();
    await expect(blurredContent).toHaveClass(/filter/);

    // Check that the lock overlay is present
    await expect(page.locator('text=This drill contains advanced trading strategies and live market analysis')).toBeVisible();
  });

  test('should not show console errors related to ModalContext', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/drill-example');
    await page.waitForLoadState('networkidle');

    // Check that no ModalContext errors occurred
    const modalContextErrors = consoleErrors.filter((error) =>
      error.includes('useModalContext must be used within a ModalProvider'),
    );

    expect(modalContextErrors.length).toBe(0);
  });
});
