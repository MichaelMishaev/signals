import { test, expect } from '@playwright/test';

test('homepage has no critical console errors', async ({ page }) => {
  const errors: string[] = [];
  const gsapErrors: string[] = [];

  // Capture console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      errors.push(text);

      // Check for GSAP-specific errors
      if (
        text.includes('ScrollTrigger') ||
        text.includes('GSAP') ||
        text.includes("can't access property \"init\"") ||
        text.toLowerCase().includes('gsap')
      ) {
        gsapErrors.push(text);
      }
    }
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    const message = error.message;
    errors.push(message);

    if (
      message.includes('ScrollTrigger') ||
      message.includes('GSAP') ||
      message.includes("can't access property \"init\"") ||
      message.toLowerCase().includes('gsap')
    ) {
      gsapErrors.push(message);
    }
  });

  // Navigate to homepage
  await page.goto('http://localhost:5001/en');

  // Wait a bit for any animations/lazy loading
  await page.waitForTimeout(5000);

  // Log all errors
  console.log('\n=== All Console Errors ===');
  console.log(errors.length > 0 ? errors.join('\n') : 'No errors');

  console.log('\n=== GSAP-Related Errors ===');
  console.log(gsapErrors.length > 0 ? gsapErrors.join('\n') : 'No GSAP errors!');

  // Assert no GSAP errors
  expect(gsapErrors.length, `Found ${gsapErrors.length} GSAP errors`).toBe(0);
});
