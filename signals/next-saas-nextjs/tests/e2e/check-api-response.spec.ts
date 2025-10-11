import { test } from '@playwright/test';

test('check if API is returning signals', async ({ page }) => {
  // Intercept API calls
  page.on('response', async response => {
    if (response.url().includes('/api/signals')) {
      console.log('API URL:', response.url());
      console.log('Status:', response.status());
      try {
        const data = await response.json();
        console.log('Response data:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('Could not parse response');
      }
    }
  });

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });

  await page.waitForTimeout(5000);

  // Check if signals feed is visible
  const signalsFeed = await page.locator('text=Latest Signals').count();
  console.log('\nSignals feed header visible:', signalsFeed > 0);

  const signalCards = await page.locator('[data-signal-card]').count();
  console.log('Signal cards visible:', signalCards);

  // Check for loading state
  const loading = await page.locator('text=Loading').count();
  console.log('Loading indicator:', loading > 0);

  // Check for no signals message
  const noSignals = await page.locator('text=/No.*signals/i').count();
  console.log('No signals message:', noSignals > 0);

  await page.screenshot({ path: '/Users/michaelmishayev/Desktop/signals/homepage-check.png', fullPage: true });
});
