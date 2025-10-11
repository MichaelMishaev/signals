import { test } from '@playwright/test';

test('show fresh homepage with signals', async ({ page, context }) => {
  // Clear browser cache
  await context.clearCookies();

  console.log('Navigating to fresh homepage...');
  await page.goto('http://localhost:5001/en', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await page.waitForTimeout(5000);

  // Force reload
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/FRESH-HOMEPAGE.png',
    fullPage: true
  });

  const cards = await page.locator('[data-signal-card]').count();
  console.log(`Signal cards visible: ${cards}`);

  // Get all signal pair names
  const pairs = await page.locator('[data-signal-card] h4').allTextContents();
  console.log('Signal pairs:', pairs);
});
