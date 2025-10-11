import { test } from '@playwright/test';

test('highlight the clickable signal cards', async ({ page, context }) => {
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Scroll to signals section
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(1000);

  // Inject CSS to highlight the clickable signal cards
  await page.addStyleTag({
    content: `
      [data-signal-card] {
        outline: 5px solid red !important;
        outline-offset: 5px;
        animation: pulse 1s infinite;
      }

      [data-signal-card] button {
        outline: 3px solid lime !important;
        outline-offset: 3px;
      }

      @keyframes pulse {
        0%, 100% { outline-color: red; }
        50% { outline-color: orange; }
      }

      /* Highlight the sidebar */
      .lg\\:col-span-1 {
        background: rgba(255, 0, 0, 0.1) !important;
      }
    `
  });

  await page.waitForTimeout(1000);

  // Take screenshot with highlights
  await page.screenshot({
    path: '/Users/michaelmishayev/Desktop/signals/CLICKABLE-AREAS-HIGHLIGHTED.png',
    fullPage: true
  });

  console.log('\n✅ Screenshot saved showing clickable areas in RED outline');
  console.log('✅ Buttons are shown with GREEN outline');
  console.log('✅ The sidebar has a light red background');
});
