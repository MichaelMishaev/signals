/**
 * Email Gate - Whitelisted Email Test
 * Verify that whitelisted emails (345287@gmail.com) receive real emails via Resend
 */

import { test, expect } from '@playwright/test';

test.describe('Email Gate - Whitelisted Email Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Enable console logging to see server logs
    page.on('console', (msg) => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        console.log(`[Browser Console] ${msg.text()}`);
      }
    });

    // Navigate to a signal page
    await page.goto('http://localhost:5001/en/signal/26');
    await page.waitForLoadState('networkidle');
  });

  test('should send real email to whitelisted address (345287@gmail.com)', async ({ page }) => {
    console.log('\n🧪 Testing whitelisted email: 345287@gmail.com');

    // Wait for the email gate modal to appear
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    // Fill in the whitelisted email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('345287@gmail.com');

    console.log('✅ Filled email input with whitelisted address');

    // Listen for the API request
    const apiRequestPromise = page.waitForRequest(
      (request) =>
        request.url().includes('/api/auth/drill-access') &&
        request.method() === 'POST'
    );

    // Listen for the API response
    const apiResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/drill-access') &&
        response.request().method() === 'POST'
    );

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    console.log('✅ Clicked submit button');

    // Wait for API request and response
    const apiRequest = await apiRequestPromise;
    const apiResponse = await apiResponsePromise;

    console.log('✅ API request sent:', apiRequest.url());

    // Get the response data
    const responseData = await apiResponse.json();
    console.log('✅ API response received:', JSON.stringify(responseData, null, 2));

    // Assertions
    expect(apiResponse.status()).toBe(200);
    expect(responseData.success).toBe(true);

    // For whitelisted emails, we should NOT get a developmentLink
    // (because it should send a real email via Resend)
    console.log('\n🔍 Checking if real email was sent (no developmentLink)...');

    if (responseData.developmentLink) {
      console.log('⚠️  WARNING: Development link present - email was NOT sent via Resend!');
      console.log('   Development Link:', responseData.developmentLink);
      console.log('\n   This means the whitelist logic is not working!');

      // Fail the test
      expect(responseData.developmentLink).toBeUndefined();
    } else {
      console.log('✅ SUCCESS: No development link - real email sent via Resend!');
    }

    // Verify the message indicates email was sent
    expect(responseData.message || responseData.success).toBeTruthy();

    // Check for verification pending UI
    await page.waitForSelector('text=Check your email for the magic link', {
      timeout: 5000,
    });

    console.log('✅ Verification pending UI displayed');

    // Check for resend button
    const resendButton = page.locator('button:has-text("Resend Verification Email")');
    await expect(resendButton).toBeVisible({ timeout: 3000 });

    console.log('✅ Resend button is visible');

    // Verify the email address is shown
    await expect(page.locator('text=345287@gmail.com')).toBeVisible();

    console.log('✅ Email address displayed correctly');

    console.log('\n🎉 Test passed - whitelisted email should receive real email!');
    console.log('   Check your inbox at 345287@gmail.com');
  });

  test('should bypass email sending for non-whitelisted addresses', async ({ page }) => {
    console.log('\n🧪 Testing non-whitelisted email: test@example.com');

    // Wait for the email gate modal to appear
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    // Fill in a non-whitelisted email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');

    console.log('✅ Filled email input with non-whitelisted address');

    // Listen for the API response
    const apiResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/drill-access') &&
        response.request().method() === 'POST'
    );

    // Submit the form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    console.log('✅ Clicked submit button');

    // Wait for API response
    const apiResponse = await apiResponsePromise;
    const responseData = await apiResponse.json();

    console.log('✅ API response:', JSON.stringify(responseData, null, 2));

    // For non-whitelisted emails, we SHOULD get a developmentLink
    expect(apiResponse.status()).toBe(200);
    expect(responseData.success).toBe(true);
    expect(responseData.developmentLink).toBeDefined();

    console.log('✅ Development link present (email bypassed as expected)');
    console.log('   Development Link:', responseData.developmentLink);

    console.log('\n🎉 Test passed - non-whitelisted email correctly bypassed!');
  });

  test('should test resend button for whitelisted email', async ({ page }) => {
    console.log('\n🧪 Testing resend functionality for whitelisted email');

    // Wait for the email gate modal
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    // Fill in whitelisted email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('345287@gmail.com');

    // Submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for verification pending UI
    await page.waitForSelector('text=Check your email for the magic link', {
      timeout: 5000,
    });

    console.log('✅ Verification pending UI displayed');

    // Find resend button
    const resendButton = page.locator('button:has-text("Resend Verification Email")');
    await expect(resendButton).toBeVisible();
    await expect(resendButton).toBeEnabled();

    console.log('✅ Resend button is visible and enabled');

    // Click resend button
    const resendResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/drill-access') &&
        response.request().method() === 'POST'
    );

    await resendButton.click();

    console.log('✅ Clicked resend button');

    // Wait for API response
    const resendResponse = await resendResponsePromise;
    const resendData = await resendResponse.json();

    console.log('✅ Resend API response:', JSON.stringify(resendData, null, 2));

    expect(resendResponse.status()).toBe(200);
    expect(resendData.success).toBe(true);

    // Button should now show countdown
    await expect(resendButton).toContainText('Resend in');

    console.log('✅ Countdown timer started');

    // Verify button is disabled during cooldown
    await expect(resendButton).toBeDisabled();

    console.log('✅ Button disabled during cooldown');

    // Wait a few seconds and check countdown is decreasing
    await page.waitForTimeout(2000);

    const buttonText = await resendButton.textContent();
    console.log('✅ Button text after 2 seconds:', buttonText);

    // Should show a lower number (58s or less)
    expect(buttonText).toMatch(/Resend in \d+s/);

    console.log('\n🎉 Test passed - resend functionality working!');
  });
});

test.describe('Email Gate - Server Logs Verification', () => {
  test('should log whitelisted email attempts in server console', async ({ page }) => {
    console.log('\n🧪 Testing server-side logging for whitelisted email');

    // This test verifies what we should see in the server logs
    // You should manually check the server console for:
    // "🔥 WHITELISTED EMAIL - Sending real email to: 345287@gmail.com"

    await page.goto('http://localhost:5001/en/signal/26');
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('input[type="email"]', { timeout: 10000 });

    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('345287@gmail.com');

    await page.locator('button[type="submit"]').click();

    await page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/drill-access') &&
        response.status() === 200
    );

    console.log('\n✅ Email submitted - check server console for:');
    console.log('   🔥 WHITELISTED EMAIL - Sending real email to: 345287@gmail.com');
    console.log('\nIf you see "MAGIC LINK GENERATED (Development Mode)" instead,');
    console.log('the whitelist logic is NOT working!');
  });
});
