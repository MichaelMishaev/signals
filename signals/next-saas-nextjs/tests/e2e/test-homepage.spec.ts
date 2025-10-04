import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:5001/en');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot
  await page.screenshot({ path: 'homepage-test.png', fullPage: true });
  
  // Check if page loaded without errors
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check for main content
  const mainContent = await page.locator('main').count();
  console.log('Main content found:', mainContent > 0);
  
  expect(mainContent).toBeGreaterThan(0);
});
