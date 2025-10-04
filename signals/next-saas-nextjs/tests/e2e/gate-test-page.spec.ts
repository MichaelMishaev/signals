/**
 * Gate Test Page Navigation Test
 * Check if the gate test page loads correctly
 */

import { test, expect } from '@playwright/test';

test('gate test page should load', async ({ page }) => {
  // Try direct URL
  await page.goto('http://localhost:5001/en/gate-test');

  // Wait for page to load
  await page.waitForTimeout(2000);

  // Check current URL
  const currentUrl = page.url();
  console.log('Current URL:', currentUrl);

  // Take screenshot
  await page.screenshot({ path: 'test-results/gate-test-page-load.png', fullPage: true });

  // Check if page title exists
  const title = await page.textContent('h1');
  console.log('Page title:', title);

  // Verify we're on the right page
  expect(currentUrl).toContain('gate-test');
});

test('check if gate-test directory exists in file system', async ({ page }) => {
  // This test will help us debug the routing issue
  await page.goto('http://localhost:5001/en');

  await page.waitForTimeout(1000);

  console.log('Homepage loaded, now trying to navigate to gate-test');

  // Try to navigate programmatically
  await page.goto('http://localhost:5001/en/gate-test', { waitUntil: 'networkidle' });

  const url = page.url();
  console.log('Final URL:', url);

  // Check page content
  const body = await page.textContent('body');
  console.log('Body contains:', body?.substring(0, 200));

  await page.screenshot({ path: 'test-results/gate-test-navigation.png', fullPage: true });
});
