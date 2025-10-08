import { test, expect } from '@playwright/test';

/**
 * Comprehensive Translation Audit Test
 * Checks all pages, buttons, drills, menus, and signals for untranslated content
 */

test.describe('Translation Audit - Urdu Locale', () => {
  const translationKeyPattern = /\b(common\.|signals\.|modals\.|buttons\.|footer\.|navigation\.)/;

  test('Homepage - Check all elements for translation keys', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Get all text content
    const body = await page.locator('body');
    const textContent = await body.textContent();

    // Check for translation keys
    const hasTranslationKeys = translationKeyPattern.test(textContent || '');

    if (hasTranslationKeys) {
      // Find specific elements with translation keys
      const elements = await page.locator(':text-matches("common\\.|signals\\.|modals\\.|buttons\\.")').all();
      console.log(`Found ${elements.length} elements with translation keys on homepage`);

      for (const element of elements) {
        const text = await element.textContent();
        console.log(`Translation key found: "${text}"`);
      }
    }

    expect(hasTranslationKeys).toBe(false);
  });

  test('Signal Cards - Check action buttons', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Find all action buttons
    const actionButtons = await page.locator('button:has-text("common.actions")').all();

    console.log(`Found ${actionButtons.length} buttons with translation keys`);

    for (const button of actionButtons) {
      const text = await button.textContent();
      console.log(`Button text: "${text}"`);
    }

    expect(actionButtons.length).toBe(0);
  });

  test('Timeline/Changelog - Check all signal displays', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Scroll to changelog section
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(1000);

    // Check for untranslated labels
    const untranslatedLabels = await page.locator('text=/Entry:|Stop Loss:|Take Profit:|Market:|Priority:/').all();

    if (untranslatedLabels.length > 0) {
      console.log(`Found ${untranslatedLabels.length} English labels in timeline`);
    }

    // Check for translation keys in signal cards
    const translationKeys = await page.locator('text=/common\\.|signals\\./').all();

    for (const key of translationKeys) {
      const text = await key.textContent();
      console.log(`Translation key in timeline: "${text}"`);
    }

    expect(translationKeys.length).toBe(0);
  });

  test('Modals - Email Gate', async ({ page }) => {
    await page.goto('http://localhost:5001/ur/signal/4');
    await page.waitForLoadState('networkidle');

    // Try to trigger email gate modal
    // (Implementation depends on your gate trigger logic)

    // Check if modal has translation keys
    const modal = page.locator('[role="dialog"], dialog, .modal');

    if (await modal.isVisible()) {
      const modalText = await modal.textContent();
      const hasKeys = translationKeyPattern.test(modalText || '');

      if (hasKeys) {
        console.log('Modal has translation keys:', modalText);
      }

      expect(hasKeys).toBe(false);
    }
  });

  test('Navigation Menu - Check all menu items', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Check navigation elements
    const nav = page.locator('nav, header');
    const navText = await nav.textContent();

    const hasTranslationKeys = translationKeyPattern.test(navText || '');

    if (hasTranslationKeys) {
      console.log('Navigation has translation keys');
      const keys = await nav.locator('text=/common\\.|navigation\\./').all();

      for (const key of keys) {
        const text = await key.textContent();
        console.log(`Nav translation key: "${text}"`);
      }
    }

    expect(hasTranslationKeys).toBe(false);
  });

  test('Footer - Check all footer elements', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator('footer');
    const footerText = await footer.textContent();

    const hasTranslationKeys = translationKeyPattern.test(footerText || '');

    if (hasTranslationKeys) {
      console.log('Footer has translation keys:', footerText);
    }

    expect(hasTranslationKeys).toBe(false);
  });

  test('Signal Detail Page - Full audit', async ({ page }) => {
    await page.goto('http://localhost:5001/ur/signal/4');
    await page.waitForLoadState('networkidle');

    // Get all text content
    const body = await page.locator('body');
    const textContent = await body.textContent();

    // Find all translation keys
    const matches = textContent?.match(/\b(common\.|signals\.|modals\.|buttons\.)[a-zA-Z.]+/g) || [];

    if (matches.length > 0) {
      console.log(`Found ${matches.length} translation keys on signal detail page:`);
      console.log([...new Set(matches)].join('\n'));
    }

    expect(matches.length).toBe(0);
  });
});

test.describe('Translation Audit - English Locale (Baseline)', () => {
  test('Homepage - Should not have translation keys', async ({ page }) => {
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    const body = await page.locator('body');
    const textContent = await body.textContent();

    const translationKeyPattern = /\b(common\.|signals\.|modals\.|buttons\.)/;
    const hasTranslationKeys = translationKeyPattern.test(textContent || '');

    if (hasTranslationKeys) {
      const matches = textContent?.match(/\b(common\.|signals\.|modals\.|buttons\.)[a-zA-Z.]+/g) || [];
      console.log('Translation keys found in English:', [...new Set(matches)]);
    }

    expect(hasTranslationKeys).toBe(false);
  });
});
