import { test, expect } from '@playwright/test';

test('investigate signal page 404', async ({ page }) => {
  // Set up console and network logging
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('response', response => {
    console.log(`Response: ${response.status()} ${response.url()}`);
  });
  page.on('requestfailed', request => {
    console.log('Failed request:', request.url(), request.failure()?.errorText);
  });

  // Navigate to the signal page
  console.log('Navigating to http://localhost:5001/en/signal/1');
  await page.goto('http://localhost:5001/en/signal/1', { waitUntil: 'networkidle' });

  // Take a screenshot
  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/signal-page-debug.png', fullPage: true });

  // Check if 404 page is showing
  const pageText = await page.textContent('body');
  console.log('Page contains 404:', pageText?.includes('404'));
  console.log('Page contains Opps:', pageText?.includes('Opps'));

  // Check if the signal page loaded
  const hasSignalContent = await page.locator('h1').count();
  console.log('Number of h1 elements:', hasSignalContent);

  // Check the current URL
  console.log('Current URL:', page.url());

  // Try to check if API is responding
  const apiResponse = await page.request.get('http://localhost:5001/api/signals/1?locale=en');
  console.log('API Response Status:', apiResponse.status());
  const apiData = await apiResponse.json();
  console.log('API Response Data:', JSON.stringify(apiData, null, 2));
});
