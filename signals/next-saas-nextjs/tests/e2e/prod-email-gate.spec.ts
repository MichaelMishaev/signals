import { test, expect } from '@playwright/test';

test.describe('Production Email Gate - Signal 14', () => {
  test('should handle email gate flow on production', async ({ page }) => {
    // Navigate to signal 14 on production
    await page.goto('https://www.pipguru.club/en/signal/14');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({ path: 'tests/screenshots/prod-signal-14-initial.png', fullPage: true });

    // Check if gate modal appears
    const gateModal = page.locator('[data-testid="gate-modal"], [role="dialog"]').first();

    if (await gateModal.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('✅ Gate modal is visible');

      // Take screenshot of gate modal
      await page.screenshot({ path: 'tests/screenshots/prod-gate-modal.png', fullPage: true });

      // Check for email input
      const emailInput = page.locator('input[type="email"]').first();
      await expect(emailInput).toBeVisible();

      // Fill in test email
      await emailInput.fill('test@playwright.com');

      // Take screenshot before submit
      await page.screenshot({ path: 'tests/screenshots/prod-gate-before-submit.png', fullPage: true });

      // Click send button
      const sendButton = page.locator('button:has-text("Send Magic Link"), button:has-text("Send")').first();

      if (await sendButton.isVisible()) {
        // Listen for API calls
        const responsePromise = page.waitForResponse(
          response => response.url().includes('/api/auth/') && response.request().method() === 'POST',
          { timeout: 10000 }
        );

        await sendButton.click();

        // Wait for API response
        const response = await responsePromise;
        const status = response.status();
        const body = await response.json().catch(() => ({}));

        console.log('📡 API Response:', {
          url: response.url(),
          status,
          body
        });

        // Take screenshot after submit
        await page.screenshot({ path: 'tests/screenshots/prod-gate-after-submit.png', fullPage: true });

        // Check for error messages
        if (status === 500) {
          const errorMessage = page.locator('text=/failed|error|unable/i').first();
          if (await errorMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
            const errorText = await errorMessage.textContent();
            console.log('❌ Error message displayed:', errorText);
          }
        }

        // Report results
        expect(status).not.toBe(500);
        expect(body).not.toHaveProperty('error');
      }
    } else {
      console.log('ℹ️ No gate modal - content might be accessible');
      await page.screenshot({ path: 'tests/screenshots/prod-no-gate.png', fullPage: true });
    }

    // Check browser console for errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit to collect console errors
    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.log('🔴 Console Errors:', consoleErrors);
    }

    // Final screenshot
    await page.screenshot({ path: 'tests/screenshots/prod-final.png', fullPage: true });
  });

  test('should check API endpoints directly', async ({ request }) => {
    // Test check-email-status endpoint
    const emailStatusResponse = await request.post('https://www.pipguru.club/api/auth/check-email-status', {
      data: { email: 'test@playwright.com' },
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('📊 check-email-status:', {
      status: emailStatusResponse.status(),
      body: await emailStatusResponse.json().catch(() => ({}))
    });

    expect(emailStatusResponse.status()).not.toBe(500);

    // Test drill-access endpoint
    const drillAccessResponse = await request.post('https://www.pipguru.club/api/auth/drill-access', {
      data: {
        email: 'test@playwright.com',
        action: 'send-magic-link',
        source: 'signal-14',
        returnUrl: '/en/signal/14'
      },
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('📊 drill-access:', {
      status: drillAccessResponse.status(),
      body: await drillAccessResponse.json().catch(() => ({}))
    });

    expect(drillAccessResponse.status()).not.toBe(500);
  });
});
