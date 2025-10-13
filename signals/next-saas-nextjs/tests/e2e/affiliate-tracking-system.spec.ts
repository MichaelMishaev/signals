import { test, expect } from '@playwright/test';

/**
 * Affiliate Tracking System - E2E Test Suite
 *
 * Tests all affiliate link tracking functionality across the platform
 */

test.describe('Affiliate Tracking System', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage to start fresh
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  // ============================================================================
  // API Endpoint Tests
  // ============================================================================

  test.describe('API Endpoints', () => {
    test('should track affiliate click via API', async ({ page }) => {
      const response = await page.request.post('/api/track-affiliate-click', {
        data: {
          clickId: 'test_' + Date.now(),
          source: 'test_suite',
          signalId: 123,
          buttonVariant: 'test-button',
          utmParams: {
            source: 'test',
            medium: 'automation',
            campaign: 'qa_test',
          },
          metadata: {
            testRun: true,
          },
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.clickId).toBeTruthy();
    });

    test('should return 400 for missing required fields', async ({ page }) => {
      const response = await page.request.post('/api/track-affiliate-click', {
        data: {
          // Missing clickId and source
          signalId: 123,
        },
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should handle Exness postback', async ({ page }) => {
      const response = await page.request.post('/api/exness-postback', {
        data: {
          cid: 'test_click_id_' + Date.now(),
          event: 'registration',
          user_id: 'test_user_123',
          transaction_id: 'txn_' + Date.now(),
        },
      });

      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    test('should get API health status', async ({ page }) => {
      const response = await page.request.get('/api/track-affiliate-click');
      expect(response.ok()).toBeTruthy();

      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(data.endpoint).toBe('/api/track-affiliate-click');
    });
  });

  // ============================================================================
  // Signal Page Tests
  // ============================================================================

  test.describe('Signal Page Tracking', () => {
    test('should track click on signal page CTA button', async ({ page, context }) => {
      // Listen for API call
      let trackingCalled = false;
      await page.route('/api/track-affiliate-click', async (route) => {
        trackingCalled = true;
        const request = route.request();
        const body = request.postDataJSON();

        expect(body.source).toBe('signal_page_cta');
        expect(body.buttonVariant).toBeTruthy();
        expect(body.signalId).toBeTruthy();

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, clickId: body.clickId }),
        });
      });

      // Navigate to signal page
      await page.goto('/en/signal/10'); // Assuming signal ID 10 exists

      // Wait for page load
      await page.waitForSelector('button', { timeout: 10000 });

      // Click the CTA button
      const ctaButton = page.locator('button').filter({ hasText: /START LEARNING|VIEW ANALYSIS/i }).first();

      if (await ctaButton.count() > 0) {
        // Listen for new tab
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          ctaButton.click(),
        ]);

        // Verify tracking was called
        await page.waitForTimeout(1000);
        expect(trackingCalled).toBe(true);

        // Verify new tab URL contains tracking parameters
        const url = newPage.url();
        expect(url).toContain('one.exnessonelink.com');
        expect(url).toContain('cid=');
        expect(url).toContain('utm_source=');

        await newPage.close();
      }
    });
  });

  // ============================================================================
  // Homepage Feed Tests
  // ============================================================================

  test.describe('Homepage Signal Feed Tracking', () => {
    test('should track click on homepage signal feed button', async ({ page, context }) => {
      let trackingCalled = false;
      await page.route('/api/track-affiliate-click', async (route) => {
        trackingCalled = true;
        const body = route.request().postDataJSON();
        expect(body.source).toBe('homepage_feed');

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, clickId: body.clickId }),
        });
      });

      await page.goto('/en');
      await page.waitForSelector('[data-signal-card]', { timeout: 10000 });

      // Find and click signal button in feed
      const feedButton = page.locator('[data-signal-card] button').first();

      if (await feedButton.count() > 0) {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          feedButton.click(),
        ]);

        await page.waitForTimeout(1000);
        expect(trackingCalled).toBe(true);

        const url = newPage.url();
        expect(url).toContain('one.exnessonelink.com');

        await newPage.close();
      }
    });
  });

  // ============================================================================
  // Popup Tests
  // ============================================================================

  test.describe('Popup Tracking', () => {
    test('should track popup button clicks', async ({ page }) => {
      let trackingCalled = false;
      let popupSource = '';

      await page.route('/api/track-affiliate-click', async (route) => {
        trackingCalled = true;
        const body = route.request().postDataJSON();
        popupSource = body.source;

        expect(body.source).toMatch(/^popup_/);

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, clickId: body.clickId }),
        });
      });

      // Test would need popup to be triggered
      // This is a placeholder for popup testing logic
    });
  });

  // ============================================================================
  // Tracking Utilities Tests
  // ============================================================================

  test.describe('Tracking Utilities', () => {
    test('should generate unique click IDs', async ({ page }) => {
      await page.goto('/en');

      const clickIds = await page.evaluate(async () => {
        const { generateClickId } = await import('@/utils/affiliateTracking');
        return [
          generateClickId(),
          generateClickId(123),
          generateClickId('test'),
        ];
      });

      expect(clickIds[0]).toBeTruthy();
      expect(clickIds[1]).toContain('_123_');
      expect(clickIds[2]).toContain('_test_');
      expect(new Set(clickIds).size).toBe(3); // All unique
    });

    test('should build correct UTM parameters', async ({ page }) => {
      await page.goto('/en');

      const utmParams = await page.evaluate(async () => {
        const { buildUTMParams } = await import('@/utils/affiliateTracking');
        return buildUTMParams('signal_page_cta', 123, 'urgent-countdown');
      });

      expect(utmParams.source).toBe('signals_platform');
      expect(utmParams.medium).toBe('cta_button');
      expect(utmParams.campaign).toBe('signal_123');
      expect(utmParams.content).toBe('button_urgent-countdown');
    });

    test('should create session ID', async ({ page }) => {
      await page.goto('/en');

      const sessionId1 = await page.evaluate(async () => {
        const { getSessionId } = await import('@/utils/affiliateTracking');
        return getSessionId();
      });

      const sessionId2 = await page.evaluate(async () => {
        const { getSessionId } = await import('@/utils/affiliateTracking');
        return getSessionId();
      });

      expect(sessionId1).toBeTruthy();
      expect(sessionId2).toBeTruthy();
      expect(sessionId1).toBe(sessionId2); // Should be same within session
    });
  });

  // ============================================================================
  // URL Building Tests
  // ============================================================================

  test.describe('Affiliate URL Building', () => {
    test('should build complete affiliate URL with all parameters', async ({ page }) => {
      await page.goto('/en');

      const url = await page.evaluate(async () => {
        const { buildAffiliateUrl } = await import('@/utils/affiliateTracking');
        return buildAffiliateUrl(
          'test_click_123',
          {
            source: 'signals_platform',
            medium: 'cta_button',
            campaign: 'signal_10',
            content: 'button_urgent',
          },
          { custom_param: 'test_value' }
        );
      });

      expect(url).toContain('one.exnessonelink.com/a/c_8f0nxidtbt');
      expect(url).toContain('cid=test_click_123');
      expect(url).toContain('utm_source=signals_platform');
      expect(url).toContain('utm_medium=cta_button');
      expect(url).toContain('utm_campaign=signal_10');
      expect(url).toContain('utm_content=button_urgent');
      expect(url).toContain('custom_param=test_value');
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  test.describe('End-to-End Integration', () => {
    test('complete user journey: homepage -> signal -> affiliate click', async ({ page, context }) => {
      const trackingCalls: any[] = [];

      await page.route('/api/track-affiliate-click', async (route) => {
        const body = route.request().postDataJSON();
        trackingCalls.push(body);

        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, clickId: body.clickId }),
        });
      });

      // Step 1: Visit homepage
      await page.goto('/en');
      await page.waitForSelector('[data-signal-card]', { timeout: 10000 });

      // Step 2: Click on a signal
      const signalCard = page.locator('[data-signal-card]').first();
      if (await signalCard.count() > 0) {
        await signalCard.click();
      }

      // Step 3: Wait for signal page to load
      await page.waitForTimeout(2000);

      // Step 4: Click CTA button
      const ctaButton = page.locator('button').filter({ hasText: /START|VIEW/i }).first();

      if (await ctaButton.count() > 0) {
        const [newPage] = await Promise.all([
          context.waitForEvent('page'),
          ctaButton.click(),
        ]);

        await page.waitForTimeout(1000);

        // Verify tracking calls were made
        expect(trackingCalls.length).toBeGreaterThan(0);

        // Verify at least one call was for CTA
        const ctaCall = trackingCalls.find((call) => call.source === 'signal_page_cta');
        expect(ctaCall).toBeTruthy();

        // Verify affiliate URL
        const url = newPage.url();
        expect(url).toContain('one.exnessonelink.com');

        await newPage.close();
      }
    });
  });
});
