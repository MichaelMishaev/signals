/**
 * Cross-Browser Email Verification Tests
 * Tests the database-backed email verification flow
 */

import { test, expect } from '@playwright/test';

test.describe('Cross-Browser Email Verification', () => {
  const testEmail = '345287@gmail.com'; // Whitelisted test email
  const testName = 'Test User';

  test.beforeEach(async ({ context }) => {
    // Clear all storage before each test
    await context.clearCookies();
  });

  test('should verify email in Browser A and grant access in Browser B', async ({ browser }) => {
    // Simulate two different browsers
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    try {
      // ======================================================================
      // STEP 1: Browser A - First time user submits email
      // ======================================================================
      console.log('Step 1: Browser A - Submitting email for first time');

      await pageA.goto('/en/drill-example');

      // Wait for email gate to appear
      await pageA.waitForSelector('[data-testid="email-popup"]', { timeout: 10000 });

      // Fill in email form
      await pageA.fill('input[type="email"]', testEmail);
      await pageA.fill('input[name="name"]', testName);

      // Submit email
      await pageA.click('button[type="submit"]');

      // Wait for "check your email" message
      await pageA.waitForSelector('text=Check Your Email', { timeout: 5000 });

      console.log('✅ Step 1 complete: Email submitted in Browser A');

      // ======================================================================
      // STEP 2: Browser A - Click magic link to verify
      // ======================================================================
      console.log('Step 2: Browser A - Clicking magic link');

      // In development, the magic link is logged to console
      // For testing, we'll simulate the verification by calling the API directly
      const magicLinkResponse = await pageA.evaluate(async (email) => {
        // First, get the magic link from the API (dev mode returns it)
        const drillResponse = await fetch('/api/auth/drill-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: 'Test User',
            source: 'test',
            action: 'send-magic-link',
            returnUrl: '/en/drill-example'
          }),
        });

        const data = await drillResponse.json();
        return data.developmentLink;
      }, testEmail);

      if (magicLinkResponse) {
        // Click the magic link in Browser A
        await pageA.goto(magicLinkResponse);

        // Should redirect back to drill page with access granted
        await pageA.waitForURL(/\/drill-example/, { timeout: 5000 });

        console.log('✅ Step 2 complete: Email verified in Browser A');
      }

      // ======================================================================
      // STEP 3: Browser A - Verify access granted
      // ======================================================================
      console.log('Step 3: Browser A - Checking access');

      // Should see drill content, not email gate
      const hasDrillContent = await pageA.locator('[data-testid="drill-content"]').count();
      expect(hasDrillContent).toBeGreaterThan(0);

      console.log('✅ Step 3 complete: Browser A has access to drill content');

      // ======================================================================
      // STEP 4: Browser B - New browser, same email
      // ======================================================================
      console.log('Step 4: Browser B - Opening drill page (fresh browser)');

      await pageB.goto('/en/drill-example');

      // Email gate should appear (no cookie in Browser B)
      await pageB.waitForSelector('[data-testid="email-popup"]', { timeout: 10000 });

      console.log('✅ Step 4 complete: Email gate appeared in Browser B (expected)');

      // ======================================================================
      // STEP 5: Browser B - Enter same email
      // ======================================================================
      console.log('Step 5: Browser B - Entering already-verified email');

      // Fill in the SAME email that was verified in Browser A
      await pageB.fill('input[type="email"]', testEmail);
      await pageB.fill('input[name="name"]', testName);

      // Submit email
      await pageB.click('button[type="submit"]');

      // Wait a moment for the DB check to complete
      await pageB.waitForTimeout(1000);

      console.log('✅ Step 5 complete: Email submitted in Browser B');

      // ======================================================================
      // STEP 6: Browser B - Should get instant access (DB-verified)
      // ======================================================================
      console.log('Step 6: Browser B - Checking for instant access');

      // Should NOT see "Check Your Email" message
      // Instead, should get immediate access because email is verified in DB
      const checkEmailMsg = await pageB.locator('text=Check Your Email').count();
      expect(checkEmailMsg).toBe(0);

      // Should see drill content directly
      await pageB.waitForSelector('[data-testid="drill-content"]', { timeout: 5000 });
      const hasDrillContentB = await pageB.locator('[data-testid="drill-content"]').count();
      expect(hasDrillContentB).toBeGreaterThan(0);

      console.log('✅ Step 6 complete: Browser B has instant access (cross-browser verification works!)');

      // ======================================================================
      // VERIFICATION: Check localStorage in both browsers
      // ======================================================================
      console.log('Verification: Checking localStorage in both browsers');

      const storageA = await pageA.evaluate(() => {
        return localStorage.getItem('emailGate');
      });

      const storageB = await pageB.evaluate(() => {
        return localStorage.getItem('emailGate');
      });

      console.log('Browser A localStorage:', storageA);
      console.log('Browser B localStorage:', storageB);

      // Both should have verified flag
      expect(storageA).toContain('"verified":true');
      expect(storageB).toContain('"verified":true');

      console.log('✅ Verification complete: Both browsers have verified status');

    } finally {
      await pageA.close();
      await pageB.close();
      await contextA.close();
      await contextB.close();
    }
  });

  test('should handle case-insensitive email matching', async ({ page }) => {
    console.log('Testing case-insensitive email matching');

    // First, verify with lowercase email
    await page.goto('/en/drill-example');
    await page.waitForSelector('[data-testid="email-popup"]');

    await page.fill('input[type="email"]', testEmail.toLowerCase());
    await page.fill('input[name="name"]', testName);
    await page.click('button[type="submit"]');

    // Get and click magic link
    const magicLink = await page.evaluate(async (email) => {
      const response = await fetch('/api/auth/drill-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'send-magic-link',
          source: 'test',
        }),
      });
      const data = await response.json();
      return data.developmentLink;
    }, testEmail.toLowerCase());

    if (magicLink) {
      await page.goto(magicLink);
    }

    // Clear everything and try with UPPERCASE email
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    await page.goto('/en/drill-example');
    await page.waitForSelector('[data-testid="email-popup"]');

    // Enter email in UPPERCASE
    await page.fill('input[type="email"]', testEmail.toUpperCase());
    await page.fill('input[name="name"]', testName);
    await page.click('button[type="submit"]');

    // Should get instant access (email normalization should match)
    await page.waitForTimeout(1000);

    const hasDrillContent = await page.locator('[data-testid="drill-content"]').count();
    expect(hasDrillContent).toBeGreaterThan(0);

    console.log('✅ Case-insensitive email matching works!');
  });

  test('should not grant access for unverified email', async ({ page }) => {
    console.log('Testing unverified email handling');

    const unverifiedEmail = 'unverified' + Date.now() + '@test.com';

    await page.goto('/en/drill-example');
    await page.waitForSelector('[data-testid="email-popup"]');

    await page.fill('input[type="email"]', unverifiedEmail);
    await page.fill('input[name="name"]', 'Unverified User');
    await page.click('button[type="submit"]');

    // Should see "Check Your Email" (not instant access)
    await page.waitForSelector('text=Check Your Email', { timeout: 5000 });

    // Should NOT have drill content yet
    const hasDrillContent = await page.locator('[data-testid="drill-content"]').count();
    expect(hasDrillContent).toBe(0);

    console.log('✅ Unverified email correctly requires verification');
  });
});
