import { test, expect } from '@playwright/test';

test('debug blank page - check for errors and content', async ({ page }) => {
  const consoleMessages: string[] = [];
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  // Capture all console messages
  page.on('console', (msg) => {
    const text = msg.text();
    consoleMessages.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  console.log('\n🔍 Navigating to homepage...');
  await page.goto('http://localhost:5001/en', { waitUntil: 'networkidle' });

  // Wait a bit for any lazy loading
  await page.waitForTimeout(3000);

  console.log('\n📄 Page Title:', await page.title());
  console.log('📍 Current URL:', page.url());

  // Check for main elements
  console.log('\n🔍 Checking for main elements...');

  const mainExists = await page.locator('main').count();
  console.log(`Main element: ${mainExists > 0 ? '✅ Found' : '❌ Not found'}`);

  const bodyContent = await page.locator('body').innerHTML();
  console.log(`Body has content: ${bodyContent.length > 100 ? '✅ Yes' : '❌ No'} (${bodyContent.length} chars)`);

  // Check for specific elements
  const hero = await page.locator('[data-testid="hero"], h1, .hero').count();
  console.log(`Hero/H1 elements: ${hero}`);

  const signals = await page.locator('[data-testid="signals"], .signals').count();
  console.log(`Signal elements: ${signals}`);

  // Get visible text
  const visibleText = await page.locator('body').textContent();
  console.log(`\n📝 Visible text length: ${visibleText?.length || 0} characters`);
  if (visibleText && visibleText.length > 0) {
    console.log('First 200 chars:', visibleText.substring(0, 200));
  }

  // Check computed styles
  const bodyBg = await page.evaluate(() => {
    const body = document.querySelector('body');
    if (body) {
      const styles = window.getComputedStyle(body);
      return {
        background: styles.background,
        backgroundColor: styles.backgroundColor,
        display: styles.display,
        visibility: styles.visibility,
      };
    }
    return null;
  });
  console.log('\n🎨 Body styles:', bodyBg);

  // Check for loading states
  const loadingElements = await page.locator('[data-loading], .loading, [aria-busy="true"]').count();
  console.log(`\n⏳ Loading elements: ${loadingElements}`);

  // Log all console messages
  console.log('\n💬 Console Messages:');
  consoleMessages.forEach(msg => console.log(msg));

  // Log errors
  if (consoleErrors.length > 0) {
    console.log('\n❌ Console Errors:');
    consoleErrors.forEach(err => console.log(err));
  }

  if (pageErrors.length > 0) {
    console.log('\n❌ Page Errors:');
    pageErrors.forEach(err => console.log(err));
  }

  // Take screenshot
  await page.screenshot({
    path: 'test-results/debug-blank-page.png',
    fullPage: true
  });
  console.log('\n📸 Screenshot saved to test-results/debug-blank-page.png');

  // Get DOM structure
  const domStructure = await page.evaluate(() => {
    function getStructure(el: Element, depth = 0): string {
      if (depth > 3) return '';
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : '';
      const classes = el.className ? `.${el.className.split(' ').join('.')}` : '';
      const children = Array.from(el.children)
        .map(child => getStructure(child, depth + 1))
        .filter(Boolean)
        .join('\n');
      return `${'  '.repeat(depth)}${tag}${id}${classes}\n${children}`;
    }
    const body = document.querySelector('body');
    return body ? getStructure(body) : 'No body found';
  });

  console.log('\n🌳 DOM Structure (first 3 levels):');
  console.log(domStructure);

  // Check network requests
  const apiCalls = await page.evaluate(() => {
    return (window as any).__apiCalls || 'No API tracking found';
  });
  console.log('\n🌐 API Calls:', apiCalls);
});
