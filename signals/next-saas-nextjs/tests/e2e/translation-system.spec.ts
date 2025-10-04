import { test, expect } from '@playwright/test';

test.describe('Translation System - English & Urdu', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should load English homepage at /en', async ({ page }) => {
    await page.goto('http://localhost:5001/en');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check for English content in Hero section
    await expect(page.getByText('Professional Trading Signals')).toBeVisible();
    await expect(page.getByText('for Pakistani Markets')).toBeVisible();
    await expect(page.getByText('Real-time alerts')).toBeVisible();

    // Check for English content in SignalsFeed
    await expect(page.getByText('Latest Trading Signals')).toBeVisible();
    await expect(page.getByText('LIVE SIGNALS')).toBeVisible();

    // Verify language switcher is visible
    await expect(page.getByRole('button', { name: /English/i })).toBeVisible();

    console.log('✅ English homepage loaded successfully');
  });

  test('should load Urdu homepage at /ur with RTL layout', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check for Urdu content in Hero section
    await expect(page.getByText('پیشہ ورانہ تجارتی سگنل')).toBeVisible();
    await expect(page.getByText('پاکستانی منڈیوں کے لیے')).toBeVisible();

    // Check for Urdu content in SignalsFeed
    await expect(page.getByText('تازہ ترین تجارتی سگنل')).toBeVisible();
    await expect(page.getByText('لائیو سگنل')).toBeVisible();

    // Verify RTL direction
    const htmlElement = await page.locator('html');
    const dir = await htmlElement.getAttribute('dir');
    expect(dir).toBe('rtl');

    // Verify language switcher shows Urdu
    await expect(page.getByRole('button', { name: /اردو/i })).toBeVisible();

    console.log('✅ Urdu homepage loaded successfully with RTL layout');
  });

  test('should switch from English to Urdu using language switcher', async ({ page }) => {
    // Start on English page
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    // Verify we're on English
    await expect(page.getByText('Professional Trading Signals')).toBeVisible();

    // Click language switcher
    await page.click('button:has-text("English")');

    // Wait for dropdown to appear
    await page.waitForTimeout(500);

    // Click Urdu option
    await page.click('button:has-text("اردو")');

    // Wait for navigation
    await page.waitForURL('**/ur**');
    await page.waitForLoadState('networkidle');

    // Verify we're now on Urdu page
    await expect(page.getByText('پیشہ ورانہ تجارتی سگنل')).toBeVisible();

    // Verify URL changed to /ur
    expect(page.url()).toContain('/ur');

    console.log('✅ Language switching from English to Urdu works');
  });

  test('should switch from Urdu to English using language switcher', async ({ page }) => {
    // Start on Urdu page
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Verify we're on Urdu
    await expect(page.getByText('پیشہ ورانہ تجارتی سگنل')).toBeVisible();

    // Click language switcher
    await page.click('button:has-text("اردو")');

    // Wait for dropdown
    await page.waitForTimeout(500);

    // Click English option
    await page.click('button:has-text("English")');

    // Wait for navigation
    await page.waitForURL('**/en**');
    await page.waitForLoadState('networkidle');

    // Verify we're now on English page
    await expect(page.getByText('Professional Trading Signals')).toBeVisible();

    // Verify URL changed to /en
    expect(page.url()).toContain('/en');

    console.log('✅ Language switching from Urdu to English works');
  });

  test('should display translated SignalsFeed components in English', async ({ page }) => {
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');

    // Check all English translations in SignalsFeed
    await expect(page.getByText('Latest Trading Signals')).toBeVisible();
    await expect(page.getByText('LIVE SIGNALS')).toBeVisible();
    await expect(page.getByText('ALL')).toBeVisible();
    await expect(page.getByText('FOREX')).toBeVisible();
    await expect(page.getByText('CRYPTO')).toBeVisible();
    await expect(page.getByText('For Subscribers Only')).toBeVisible();
    await expect(page.getByText('Upgrade to Premium')).toBeVisible();

    console.log('✅ SignalsFeed English translations working');
  });

  test('should display translated SignalsFeed components in Urdu', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Check all Urdu translations in SignalsFeed
    await expect(page.getByText('تازہ ترین تجارتی سگنل')).toBeVisible();
    await expect(page.getByText('لائیو سگنل')).toBeVisible();
    await expect(page.getByText('تمام')).toBeVisible();
    await expect(page.getByText('فاریکس')).toBeVisible();
    await expect(page.getByText('کرپٹو')).toBeVisible();
    await expect(page.getByText('صرف سبسکرائبرز کے لیے')).toBeVisible();
    await expect(page.getByText('پریمیم میں اپ گریڈ کریں')).toBeVisible();

    console.log('✅ SignalsFeed Urdu translations working');
  });

  test('should preserve RTL layout throughout Urdu page', async ({ page }) => {
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');

    // Check HTML dir attribute
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');

    // Check lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('ur');

    console.log('✅ RTL layout preserved correctly');
  });

  test('should handle direct navigation to /en and /ur', async ({ page }) => {
    // Test direct navigation to English
    await page.goto('http://localhost:5001/en');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Professional Trading Signals')).toBeVisible();

    // Test direct navigation to Urdu
    await page.goto('http://localhost:5001/ur');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('پیشہ ورانہ تجارتی سگنل')).toBeVisible();

    console.log('✅ Direct navigation to both locales works');
  });
});
