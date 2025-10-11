import { test, expect } from '@playwright/test';

test.describe('Investigate 500 Error on Email Submission', () => {
  test('Capture detailed error logs when submitting email', async ({ page }) => {
    console.log('\n========================================');
    console.log('🔍 INVESTIGATING 500 ERROR');
    console.log('========================================\n');

    // Capture all console logs from browser
    const browserLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      browserLogs.push(text);
      console.log('🌐 Browser:', text);
    });

    // Capture network responses
    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/auth/')) {
        console.log(`\n📡 API Response: ${response.status()} ${url}`);

        try {
          const body = await response.json();
          console.log('📦 Response body:', JSON.stringify(body, null, 2));
        } catch (e) {
          console.log('⚠️ Could not parse response body');
        }
      }
    });

    // Clear state
    await page.goto('http://localhost:5001');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    console.log('🧹 Cleared all storage\n');

    // Navigate to signal 17
    console.log('🔗 Navigating to signal 17...');
    await page.goto('http://localhost:5001/signal/17');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find drill buttons
    const drillButtons = await page.locator('button:has-text("CASE"), button:has-text("ANALYTICS"), button:has-text("BLOG")').all();
    console.log(`\n📋 Found ${drillButtons.length} drill buttons`);

    if (drillButtons.length >= 2) {
      // Click first drill (free)
      console.log('\n👆 Clicking first drill...');
      await drillButtons[0].click();
      await page.waitForTimeout(1000);

      // Click second drill (should trigger gate)
      console.log('👆 Clicking second drill (should trigger email gate)...');
      await drillButtons[1].click();
      await page.waitForTimeout(2000);

      // Check for email gate
      const emailGate = page.locator('[role="dialog"]');
      const gateCount = await emailGate.count();
      console.log(`\n🚪 Email gate visible: ${gateCount > 0}`);

      if (gateCount > 0) {
        await page.screenshot({ path: 'investigate-gate-appeared.png', fullPage: true });

        // Try to submit email
        console.log('\n📧 Attempting to submit email...');
        const emailInput = page.locator('input[type="email"]');
        const hasEmailInput = await emailInput.count();

        if (hasEmailInput > 0) {
          await emailInput.fill('test@example.com');
          await page.waitForTimeout(500);

          // Find and click submit button
          const submitButton = page.locator('button:has-text("Get Free Access"), button:has-text("Send"), button:has-text("Continue")').first();
          const hasSubmitButton = await submitButton.count();

          if (hasSubmitButton > 0) {
            console.log('🔘 Clicking submit button...');
            await submitButton.click();

            // Wait for API calls to complete
            console.log('⏳ Waiting for API responses...');
            await page.waitForTimeout(3000);

            await page.screenshot({ path: 'investigate-after-submit.png', fullPage: true });

            console.log('\n📝 Browser logs captured:');
            browserLogs
              .filter(log => log.includes('[useGateFlow]') || log.includes('error') || log.includes('Error') || log.includes('500'))
              .forEach(log => console.log('  ' + log));
          } else {
            console.log('❌ Submit button not found');
          }
        } else {
          console.log('❌ Email input not found');
        }
      } else {
        console.log('❌ Email gate did not appear');
        await page.screenshot({ path: 'investigate-no-gate.png', fullPage: true });
      }
    } else {
      console.log('❌ Not enough drill buttons found');
    }

    console.log('\n========================================');
    console.log('🔍 INVESTIGATION COMPLETE');
    console.log('Check server logs for detailed error traces');
    console.log('========================================\n');
  });
});
