import { test } from '@playwright/test';

test('visual check - highlight text elements', async ({ page }) => {
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });

  // Wait for content
  await page.waitForTimeout(2000);

  // Inject CSS to highlight all text elements
  await page.addStyleTag({
    content: `
      /* Highlight all text */
      * {
        outline: 1px solid red !important;
      }

      /* Make all text visible with contrasting color */
      h1, h2, h3, h4, h5, h6, p, span, div, a, button {
        color: yellow !important;
        background: rgba(0, 0, 0, 0.5) !important;
      }
    `
  });

  // Take screenshot
  await page.screenshot({
    path: 'test-results/visual-check-highlighted.png',
    fullPage: true
  });

  console.log('📸 Screenshot with highlighted elements saved');

  // Now check actual computed styles of hero text
  const heroText = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (h1) {
      const styles = window.getComputedStyle(h1);
      return {
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        visibility: styles.visibility,
        display: styles.display,
        opacity: styles.opacity,
        textContent: h1.textContent?.substring(0, 100),
      };
    }
    return null;
  });

  console.log('🎨 Hero H1 styles:', heroText);

  //  Check what's actually visible
  const mainContent = await page.locator('main').textContent();
  console.log(`\n📝 Main content preview (first 500 chars):`);
  console.log(mainContent?.substring(0, 500));
});
