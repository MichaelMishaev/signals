import { test, expect } from '@playwright/test';

/**
 * Compare Local vs Production Signal Display
 * This test checks for differences between local and prod environments
 */

test.describe('Local vs Production Comparison', () => {
  const PROD_URL = 'https://www.pipguru.club/en';
  const LOCAL_URL = 'http://localhost:3000/en';

  test('Compare signals on homepage - Local vs Prod', async ({ page, context }) => {
    console.log('\n=== TESTING LOCAL ENVIRONMENT ===');

    // Test Local Environment
    await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });

    // Wait for signals to load
    await page.waitForSelector('[data-testid="signal-card"], .signal-card, article', { timeout: 10000 });

    // Get all signals on local
    const localSignals = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="signal-card"], .signal-card, article');
      return Array.from(cards).map((card, index) => ({
        index,
        html: card.innerHTML.substring(0, 200), // First 200 chars
        text: card.textContent?.substring(0, 200),
        hasClickHandler: !!card.onclick || card.getAttribute('onclick') !== null,
        clickable: card.tagName === 'A' || card.tagName === 'BUTTON' || card.style.cursor === 'pointer',
      }));
    });

    console.log('Local Signals Found:', localSignals.length);
    console.log('First Local Signal:', localSignals[0]);

    // Check API response on local
    const localApiResponse = await page.goto(`${LOCAL_URL.replace('/en', '')}/api/signals?limit=5&status=ACTIVE&locale=en`);
    const localApiData = await localApiResponse?.json();

    console.log('Local API Response:', JSON.stringify(localApiData, null, 2));

    console.log('\n=== TESTING PRODUCTION ENVIRONMENT ===');

    // Test Production Environment
    const prodPage = await context.newPage();
    await prodPage.goto(PROD_URL, { waitUntil: 'networkidle' });

    // Wait for signals to load
    await prodPage.waitForSelector('[data-testid="signal-card"], .signal-card, article', { timeout: 10000 });

    // Get all signals on prod
    const prodSignals = await prodPage.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid="signal-card"], .signal-card, article');
      return Array.from(cards).map((card, index) => ({
        index,
        html: card.innerHTML.substring(0, 200),
        text: card.textContent?.substring(0, 200),
        hasClickHandler: !!card.onclick || card.getAttribute('onclick') !== null,
        clickable: card.tagName === 'A' || card.tagName === 'BUTTON' || card.style.cursor === 'pointer',
      }));
    });

    console.log('Prod Signals Found:', prodSignals.length);
    console.log('First Prod Signal:', prodSignals[0]);

    // Check API response on prod
    const prodApiResponse = await prodPage.goto('https://www.pipguru.club/api/signals?limit=5&status=ACTIVE&locale=en');
    const prodApiData = await prodApiResponse?.json();

    console.log('Prod API Response:', JSON.stringify(prodApiData, null, 2));

    // COMPARISON
    console.log('\n=== COMPARISON RESULTS ===');
    console.log('Signal Count - Local:', localSignals.length, 'Prod:', prodSignals.length);
    console.log('First Signal Match:', localSignals[0]?.text === prodSignals[0]?.text);
    console.log('Local First Signal Clickable:', localSignals[0]?.clickable);
    console.log('Prod First Signal Clickable:', prodSignals[0]?.clickable);

    // Compare API data
    if (localApiData && prodApiData) {
      console.log('API Signals - Local:', localApiData.signals?.length, 'Prod:', prodApiData.signals?.length);
      console.log('First API Signal Match:',
        JSON.stringify(localApiData.signals?.[0]) === JSON.stringify(prodApiData.signals?.[0])
      );
    }

    await prodPage.close();
  });

  test('Check if signals are clickable - Production', async ({ page }) => {
    await page.goto(PROD_URL, { waitUntil: 'networkidle' });

    // Wait for signals
    await page.waitForSelector('[data-testid="signal-card"], .signal-card, article', { timeout: 10000 });

    // Try to click the first signal
    const firstSignal = page.locator('[data-testid="signal-card"], .signal-card, article').first();

    const isVisible = await firstSignal.isVisible();
    console.log('First signal visible:', isVisible);

    // Get computed styles
    const styles = await firstSignal.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        cursor: computed.cursor,
        pointerEvents: computed.pointerEvents,
        display: computed.display,
        tagName: el.tagName,
      };
    });

    console.log('First signal styles:', styles);

    // Check if it has click handlers
    const hasHandlers = await firstSignal.evaluate((el) => {
      return {
        onclick: !!el.onclick,
        onclickAttr: el.getAttribute('onclick'),
        hasEventListeners: !!el.getEventListeners?.('click')?.length,
        isLink: el.tagName === 'A',
        href: el.getAttribute('href'),
      };
    });

    console.log('First signal handlers:', hasHandlers);

    // Try to click and see what happens
    try {
      await firstSignal.click({ timeout: 5000 });
      console.log('Click succeeded');
      await page.waitForTimeout(2000);
      console.log('Current URL after click:', page.url());
    } catch (error) {
      console.log('Click failed:', error.message);
    }
  });

  test('Check API endpoint directly', async ({ request }) => {
    console.log('\n=== DIRECT API COMPARISON ===');

    // Local API
    const localResponse = await request.get('http://localhost:3000/api/signals?limit=5&status=ACTIVE&locale=en');
    const localData = await localResponse.json();
    console.log('Local API Status:', localResponse.status());
    console.log('Local API Data:', JSON.stringify(localData, null, 2));

    // Prod API
    const prodResponse = await request.get('https://www.pipguru.club/api/signals?limit=5&status=ACTIVE&locale=en');
    const prodData = await prodResponse.json();
    console.log('Prod API Status:', prodResponse.status());
    console.log('Prod API Data:', JSON.stringify(prodData, null, 2));

    // Compare
    console.log('\nAPI Comparison:');
    console.log('Same signal count:', localData.signals?.length === prodData.signals?.length);
    console.log('Same first signal title:', localData.signals?.[0]?.title === prodData.signals?.[0]?.title);
  });

  test('Check environment variables and database connection', async ({ page }) => {
    // Check local
    await page.goto('http://localhost:3000/api/signals?limit=1');
    const localResponse = await page.textContent('body');
    const localJson = JSON.parse(localResponse || '{}');

    console.log('\nLocal Environment:');
    console.log('Using demo mode:', !localJson.signals || localJson.signals.length === 7);
    console.log('Signal count:', localJson.signals?.length);

    // Check prod
    const prodPage = await page.context().newPage();
    await prodPage.goto('https://www.pipguru.club/api/signals?limit=1');
    const prodResponse = await prodPage.textContent('body');
    const prodJson = JSON.parse(prodResponse || '{}');

    console.log('\nProduction Environment:');
    console.log('Using demo mode:', !prodJson.signals || prodJson.signals.length === 7);
    console.log('Signal count:', prodJson.signals?.length);

    await prodPage.close();
  });
});
