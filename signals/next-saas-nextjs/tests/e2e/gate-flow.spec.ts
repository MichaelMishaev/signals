/**
 * Gate Flow E2E Tests
 * Tests the complete email and broker gate flow
 */

import { test, expect } from '@playwright/test';

// ============================================================================
// SETUP & HELPERS
// ============================================================================

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test
  await page.goto('http://localhost:5001');
  await page.evaluate(() => localStorage.clear());
});

const viewSignal = async (page, signalNumber: number) => {
  // Click on a signal to view drill-down
  await page.click(`[data-testid="signal-${signalNumber}"]`);
  // Wait for drill page to load
  await page.waitForSelector('[data-testid="signal-drill"]', { timeout: 5000 });
};

const submitEmail = async (page, email: string) => {
  await page.fill('input[type="email"]', email);
  await page.click('button[type="submit"]');
};

// ============================================================================
// EMAIL GATE TESTS
// ============================================================================

test.describe('Email Gate Flow', () => {
  test('should show email gate on 4th drill attempt', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // View first 3 signals - no gate
    for (let i = 1; i <= 3; i++) {
      await viewSignal(page, i);
      await page.goBack();

      // Should NOT see email gate
      await expect(page.locator('text=Unlock Unlimited Signals')).not.toBeVisible();
    }

    // View 4th signal - gate should appear
    await viewSignal(page, 4);

    // Should see email gate
    await expect(page.locator('text=Unlock Unlimited Signals')).toBeVisible();
  });

  test('should NOT show email gate before 4th drill', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // View 1st signal
    await viewSignal(page, 1);

    // Should NOT see email gate
    await expect(page.locator('text=Unlock Unlimited Signals')).not.toBeVisible();

    // Navigate back
    await page.goBack();

    // View 2nd signal
    await viewSignal(page, 2);

    // Should still NOT see email gate
    await expect(page.locator('text=Unlock Unlimited Signals')).not.toBeVisible();
  });

  test('should accept email and grant access to drills 4-9', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // View 3 signals
    for (let i = 1; i <= 3; i++) {
      await viewSignal(page, i);
      await page.goBack();
    }

    // View 4th signal - gate appears
    await viewSignal(page, 4);
    await expect(page.locator('text=Unlock Unlimited Signals')).toBeVisible();

    // Submit email
    await submitEmail(page, 'test@example.com');

    // Gate should close
    await expect(page.locator('text=Unlock Unlimited Signals')).not.toBeVisible();

    // Should now see signal 4
    await expect(page.locator('[data-testid="signal-drill"]')).toBeVisible();

    // Should be able to view signals 5-9 without gate
    await page.goBack();
    for (let i = 5; i <= 9; i++) {
      await viewSignal(page, i);
      await expect(page.locator('text=Unlock Unlimited Signals')).not.toBeVisible();
      await page.goBack();
    }
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // Trigger email gate
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i < 4) await page.goBack();
    }

    // Try invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');

    // Should show error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();

    // Try valid email
    await page.fill('input[type="email"]', 'valid@example.com');
    await page.click('button[type="submit"]');

    // Should close gate
    await expect(page.locator('text=Unlock Unlimited Signals')).not.toBeVisible();
  });

  test('should persist email state across page reloads', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // Trigger and submit email gate
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i < 4) await page.goBack();
    }
    await submitEmail(page, 'test@example.com');

    // Reload page
    await page.reload();

    // Should still have email access (no gate on signal 5)
    await viewSignal(page, 5);
    await expect(page.locator('text=Unlock Unlimited Signals')).not.toBeVisible();
  });
});

// ============================================================================
// BROKER GATE TESTS
// ============================================================================

test.describe('Broker Gate Flow', () => {
  test('should show broker gate on 10th drill attempt', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // View first 3 signals
    for (let i = 1; i <= 3; i++) {
      await viewSignal(page, i);
      await page.goBack();
    }

    // Submit email at 4th signal
    await viewSignal(page, 4);
    await submitEmail(page, 'test@example.com');
    await page.goBack();

    // View signals 5-9 - no broker gate
    for (let i = 5; i <= 9; i++) {
      await viewSignal(page, i);
      await expect(page.locator('text=Upgrade to Premium Access')).not.toBeVisible();
      await page.goBack();
    }

    // View 10th signal - broker gate should appear
    await viewSignal(page, 10);
    await expect(page.locator('text=Upgrade to Premium Access')).toBeVisible();
  });

  test('should NOT show broker gate before 10th drill', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // Complete email gate
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i < 4) await page.goBack();
    }
    await submitEmail(page, 'test@example.com');
    await page.goBack();

    // View signal 5
    await viewSignal(page, 5);

    // Should NOT see broker gate
    await expect(page.locator('text=Upgrade to Premium Access')).not.toBeVisible();
  });

  test('should display pricing tiers in broker gate', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // Trigger broker gate (view 10 signals)
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i === 4) {
        await submitEmail(page, 'test@example.com');
      }
      if (i < 4) await page.goBack();
      else await page.goBack();
    }

    for (let i = 5; i <= 10; i++) {
      await viewSignal(page, i);
      if (i < 10) await page.goBack();
    }

    // Should see broker gate with pricing
    await expect(page.locator('text=Upgrade to Premium Access')).toBeVisible();
    await expect(page.locator('text=$10 deposit')).toBeVisible();
    await expect(page.locator('text=$30 deposit')).toBeVisible();
    await expect(page.locator('text=$150 deposit')).toBeVisible();
  });

  test('should open broker URL in new tab when clicking CTA', async ({ page, context }) => {
    await page.goto('http://localhost:5001');

    // Trigger broker gate
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i === 4) await submitEmail(page, 'test@example.com');
      if (i < 10) await page.goBack();
    }

    for (let i = 5; i <= 10; i++) {
      await viewSignal(page, i);
      if (i < 10) await page.goBack();
    }

    // Wait for new page event
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('text=Open Broker Account'),
    ]);

    // Verify new page URL contains broker domain
    const url = newPage.url();
    expect(url).toContain('broker-signup-url.com');
    expect(url).toContain('clickid='); // Should have tracking ID
  });
});

// ============================================================================
// COMPLETE FLOW TESTS
// ============================================================================

test.describe('Complete Gate Flow', () => {
  test('should enforce full flow: Anonymous → Email → Broker', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // ===== STAGE 1: Anonymous (Drills 1-3) =====
    await viewSignal(page, 1);
    await expect(page.locator('[data-testid="signal-drill"]')).toBeVisible();
    await page.goBack();

    await viewSignal(page, 2);
    await expect(page.locator('[data-testid="signal-drill"]')).toBeVisible();
    await page.goBack();

    await viewSignal(page, 3);
    await expect(page.locator('[data-testid="signal-drill"]')).toBeVisible();
    await page.goBack();

    // ===== GATE 1: Email Gate =====
    await viewSignal(page, 4);
    await expect(page.locator('text=Unlock Unlimited Signals')).toBeVisible();
    await submitEmail(page, 'user@example.com');
    await expect(page.locator('[data-testid="signal-drill"]')).toBeVisible();
    await page.goBack();

    // ===== STAGE 2: Email User (Drills 5-9) =====
    for (let i = 5; i <= 9; i++) {
      await viewSignal(page, i);
      await expect(page.locator('[data-testid="signal-drill"]')).toBeVisible();
      await expect(page.locator('text=Upgrade to Premium Access')).not.toBeVisible();
      await page.goBack();
    }

    // ===== GATE 2: Broker Gate =====
    await viewSignal(page, 10);
    await expect(page.locator('text=Upgrade to Premium Access')).toBeVisible();
  });

  test('should count drills correctly across page navigations', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // View 2 signals
    await viewSignal(page, 1);
    await page.goBack();
    await viewSignal(page, 2);
    await page.goBack();

    // Reload page
    await page.reload();

    // View 1 more signal (should be 3rd total)
    await viewSignal(page, 3);
    await page.goBack();

    // Next signal should trigger email gate (4th)
    await viewSignal(page, 4);
    await expect(page.locator('text=Unlock Unlimited Signals')).toBeVisible();
  });

  test('should NOT double-count same signal view', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // View signal 1
    await viewSignal(page, 1);
    await page.goBack();

    // View signal 1 again (refresh)
    await viewSignal(page, 1);
    await page.goBack();

    // View signal 1 third time
    await viewSignal(page, 1);
    await page.goBack();

    // View different signals
    await viewSignal(page, 2);
    await page.goBack();
    await viewSignal(page, 3);
    await page.goBack();

    // 4th unique signal should trigger gate (not 4th total view)
    await viewSignal(page, 4);
    await expect(page.locator('text=Unlock Unlimited Signals')).toBeVisible();
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

test.describe('Edge Cases', () => {
  test('should handle localStorage being cleared mid-session', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // View 3 signals and submit email
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i === 4) await submitEmail(page, 'test@example.com');
      if (i < 4) await page.goBack();
      else await page.goBack();
    }

    // Clear localStorage
    await page.evaluate(() => localStorage.clear());

    // Reload
    await page.reload();

    // Should be back to anonymous state (email gate on 4th view)
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i === 4) {
        await expect(page.locator('text=Unlock Unlimited Signals')).toBeVisible();
      }
      if (i < 4) await page.goBack();
    }
  });

  test('should handle session expiry (24 hours)', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // Set up state with expired session
    await page.evaluate(() => {
      const expiredState = {
        hasEmail: true,
        hasBrokerAccount: false,
        drillsViewed: 5,
        drillsViewedAfterEmail: 2,
        sessionStart: Date.now() - (25 * 60 * 60 * 1000), // 25 hours ago
        emailProvidedAt: Date.now() - (25 * 60 * 60 * 1000),
        brokerVerifiedAt: null,
        brokerClickId: null,
        lastBannerShown: null,
        bannerDismissCount: 0,
        drillHistory: []
      };
      localStorage.setItem('gate_flow_state', JSON.stringify(expiredState));
    });

    // Reload to apply expired state
    await page.reload();

    // Should reset drill count but keep email
    // TODO: Verify behavior matches specification
  });
});

// ============================================================================
// VISUAL REGRESSION TESTS
// ============================================================================

test.describe('Visual Tests', () => {
  test('email gate modal appearance', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // Trigger email gate
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i < 4) await page.goBack();
    }

    // Screenshot email gate
    await expect(page.locator('text=Unlock Unlimited Signals')).toBeVisible();
    await page.screenshot({ path: 'test-results/email-gate-modal.png' });
  });

  test('broker gate modal appearance', async ({ page }) => {
    await page.goto('http://localhost:5001');

    // Trigger broker gate
    for (let i = 1; i <= 4; i++) {
      await viewSignal(page, i);
      if (i === 4) await submitEmail(page, 'test@example.com');
      await page.goBack();
    }

    for (let i = 5; i <= 10; i++) {
      await viewSignal(page, i);
      if (i < 10) await page.goBack();
    }

    // Screenshot broker gate
    await expect(page.locator('text=Upgrade to Premium Access')).toBeVisible();
    await page.screenshot({ path: 'test-results/broker-gate-modal.png' });
  });
});
