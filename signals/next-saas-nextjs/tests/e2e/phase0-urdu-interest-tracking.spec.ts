import { test, expect } from '@playwright/test';

/**
 * Phase 0: Urdu Interest Tracking - E2E Tests
 *
 * Tests the Urdu demand validation button and tracking functionality
 * to ensure Phase 0 implementation works correctly without regressions.
 */

test.describe('Phase 0: Urdu Interest Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to English homepage
    await page.goto('http://localhost:5001/en');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display Urdu interest button on English page', async ({ page }) => {
    // Find the button by text content
    const urduButton = page.getByText(/اردو میں دیکھیں؟.*View in Urdu\?/);

    // Verify button is visible
    await expect(urduButton).toBeVisible({ timeout: 10000 });

    // Verify button has Pakistan flag emoji
    const buttonText = await urduButton.textContent();
    expect(buttonText).toContain('🇵🇰');
    expect(buttonText).toContain('اردو میں دیکھیں؟');
    expect(buttonText).toContain('View in Urdu?');
  });

  test('should NOT display Urdu interest button on Urdu page', async ({ page }) => {
    // Navigate to Urdu page
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Button should not be present
    const urduButton = page.getByText(/اردو میں دیکھیں؟/);
    await expect(urduButton).not.toBeVisible();
  });

  test('should track click and show thank you message', async ({ page }) => {
    // Set up network request interception to verify tracking
    let trackingRequestSent = false;

    page.on('request', request => {
      if (request.url().includes('/api/analytics/track')) {
        trackingRequestSent = true;
      }
    });

    // Set up dialog handler to handle alert
    let alertMessage = '';
    page.on('dialog', async dialog => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Click the button
    const urduButton = page.getByText(/اردو میں دیکھیں؟.*View in Urdu\?/);
    await urduButton.click();

    // Wait a bit for the request to be sent
    await page.waitForTimeout(1000);

    // Verify tracking request was sent
    expect(trackingRequestSent).toBe(true);

    // Verify alert message appeared with correct content
    expect(alertMessage).toContain('شکریہ');
    expect(alertMessage).toContain('Thank you');
    expect(alertMessage).toContain('Urdu language support');
  });

  test('should show "Thanks" state after clicking', async ({ page }) => {
    // Handle alert dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Get initial button text
    const urduButton = page.getByText(/اردو میں دیکھیں؟/);
    await urduButton.click();

    // Wait for state change
    await page.waitForTimeout(500);

    // Button should now show "Thanks" state
    const thanksButton = page.getByText(/شکریہ Thanks!/);
    await expect(thanksButton).toBeVisible();
  });

  test('should not break existing hero functionality', async ({ page }) => {
    // Verify all existing hero elements are still present

    // Check CTA buttons exist
    const startTrialButton = page.getByRole('link', { name: /Start.*Trial/i });
    await expect(startTrialButton).toBeVisible();

    const viewSignalsButton = page.getByRole('link', { name: /View.*Signals/i });
    await expect(viewSignalsButton).toBeVisible();

    // Check feature list items exist
    const features = page.locator('li').filter({ hasText: /Real-time|PSX|Risk/i });
    expect(await features.count()).toBeGreaterThanOrEqual(3);

    // Check hero title exists
    const heroTitle = page.locator('h1');
    await expect(heroTitle.first()).toBeVisible();
  });

  test('analytics API endpoint should be accessible', async ({ page }) => {
    // Test GET endpoint (health check)
    const response = await page.request.get('http://localhost:5001/api/analytics/track');

    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.phase).toBe('Phase 0 - Urdu Demand Validation');
    expect(data.endpoint).toBe('/api/analytics/track');
    expect(data.methods).toContain('POST');
  });

  test('analytics POST endpoint should accept tracking data', async ({ page }) => {
    // Send POST request
    const response = await page.request.post('http://localhost:5001/api/analytics/track', {
      data: {
        event: 'urdu_interest_clicked',
        timestamp: new Date().toISOString(),
        page_path: '/en'
      }
    });

    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  test('urdu-demand analytics endpoint should return data', async ({ page }) => {
    // Test analytics summary endpoint
    const response = await page.request.get('http://localhost:5001/api/analytics/urdu-demand');

    expect(response.ok()).toBe(true);

    const data = await response.json();
    expect(data).toHaveProperty('totalClicks');
    expect(data).toHaveProperty('last7Days');
    expect(data).toHaveProperty('last30Days');
    expect(data).toHaveProperty('conversionRate');
    expect(data).toHaveProperty('demandLevel');
    expect(data).toHaveProperty('recommendation');

    // Demand level should be one of: HIGH, MODERATE, LOW
    expect(['HIGH', 'MODERATE', 'LOW']).toContain(data.demandLevel);
  });

  test('admin dashboard should be accessible', async ({ page }) => {
    // Navigate to admin dashboard
    await page.goto('http://localhost:5001/admin/urdu-demand');
    await page.waitForLoadState('networkidle');

    // Check dashboard title
    const title = page.getByRole('heading', { name: /Phase 0.*Urdu Demand Analysis/i });
    await expect(title).toBeVisible();

    // Check stats cards are present
    const totalClicksCard = page.getByText(/Total Interest Clicks/i);
    await expect(totalClicksCard).toBeVisible();

    const last7DaysCard = page.getByText(/Last 7 Days/i);
    await expect(last7DaysCard).toBeVisible();

    const last30DaysCard = page.getByText(/Last 30 Days/i);
    await expect(last30DaysCard).toBeVisible();

    const demandLevelCard = page.getByText(/Demand Level/i);
    await expect(demandLevelCard).toBeVisible();

    // Check decision matrix is present
    const decisionMatrix = page.getByText(/Decision Matrix/i);
    await expect(decisionMatrix).toBeVisible();

    // Check recommendation section is present
    const recommendation = page.getByText(/Recommendation/i);
    await expect(recommendation).toBeVisible();
  });

  test('should not cause layout shift in hero section', async ({ page }) => {
    // Take screenshot before
    const beforeScreenshot = await page.screenshot({ fullPage: false });

    // Wait a bit
    await page.waitForTimeout(1000);

    // Take screenshot after
    const afterScreenshot = await page.screenshot({ fullPage: false });

    // Screenshots should be very similar (no major layout shift)
    // This is a rough check - in a real scenario you'd use visual regression tools
    expect(beforeScreenshot.length).toBeCloseTo(afterScreenshot.length, -1);
  });

  test('button should be keyboard accessible', async ({ page }) => {
    // Tab through page elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Handle alert dialog
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Press Enter to activate focused element
    // This should eventually reach the Urdu button
    const urduButton = page.getByText(/اردو میں دیکھیں؟/);
    await urduButton.focus();
    await page.keyboard.press('Enter');

    // Wait for potential alert
    await page.waitForTimeout(500);

    // Button should show thanks state
    const thanksButton = page.getByText(/شکریہ Thanks!/);
    await expect(thanksButton).toBeVisible({ timeout: 2000 });
  });

  test('button should have proper ARIA label', async ({ page }) => {
    const urduButton = page.getByRole('button', { name: /Request Urdu language support/i });
    await expect(urduButton).toBeVisible();

    // Verify aria-label attribute
    const ariaLabel = await urduButton.getAttribute('aria-label');
    expect(ariaLabel).toBe('Request Urdu language support');
  });
});

test.describe('Phase 0: Regression Tests', () => {
  test('existing homepage elements should not be affected', async ({ page }) => {
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    // Check all critical elements still work
    const checks = [
      page.getByRole('navigation'),
      page.getByRole('main'),
      page.getByRole('contentinfo'), // footer
      page.locator('h1'),
      page.getByRole('link', { name: /Start.*Trial/i }),
      page.getByRole('link', { name: /View.*Signals/i }),
    ];

    for (const element of checks) {
      await expect(element.first()).toBeVisible();
    }
  });

  test('language switcher should still work', async ({ page }) => {
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    // Find and click language switcher (if it exists)
    const languageSwitcher = page.getByLabel(/Switch language|Language/i);

    if (await languageSwitcher.count() > 0) {
      await languageSwitcher.first().click();

      // Should show language options
      const urduOption = page.getByText(/اردو|Urdu/i);
      await expect(urduOption.first()).toBeVisible();
    }
  });

  test('existing translations should still work', async ({ page }) => {
    // Check English page
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    const heroTitle = page.locator('h1').first();
    const englishText = await heroTitle.textContent();
    expect(englishText).toBeTruthy();
    expect(englishText?.length).toBeGreaterThan(10);

    // Check Urdu page (if translations exist)
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    const urduHeroTitle = page.locator('h1').first();
    const urduText = await urduHeroTitle.textContent();
    expect(urduText).toBeTruthy();
  });
});
