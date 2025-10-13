import { test, expect } from '@playwright/test';

test.describe('News Section', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to news page before each test
    await page.goto('/en/news');
  });

  test('should load news page successfully', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Trading News & Market Analysis/i);
    await expect(page.getByRole('heading', { name: /Trading News & Market Analysis/i })).toBeVisible();

    // Check description text
    await expect(
      page.getByText(/Stay updated with the latest market insights/i),
    ).toBeVisible();
  });

  test('should display news cards', async ({ page }) => {
    // Wait for news cards to load
    await page.waitForSelector('[class*="news-card"], article', {
      timeout: 5000,
    });

    // Check that at least one news card is visible
    const newsCards = page.locator('article');
    const count = await newsCards.count();
    expect(count).toBeGreaterThan(0);

    // Verify news card contains required elements
    const firstCard = newsCards.first();
    await expect(firstCard.locator('img')).toBeVisible(); // Thumbnail
    await expect(firstCard.locator('h3')).toBeVisible(); // Title
    await expect(firstCard.getByRole('link', { name: /Read More/i })).toBeVisible(); // Read more button
  });

  test('should have working category filters', async ({ page }) => {
    // Check that category filters are displayed
    await expect(page.getByRole('button', { name: 'All News' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Market Analysis' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SECP Updates' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Trading Education' })).toBeVisible();

    // Click on a category filter
    await page.getByRole('button', { name: 'Trading Education' }).click();

    // Wait for filter animation
    await page.waitForTimeout(500);

    // Check that the selected category is highlighted
    await expect(page.getByRole('button', { name: 'Trading Education' })).toHaveClass(/bg-primary-500/);

    // Verify articles count display
    await expect(page.getByText(/articles? found/i)).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(/Search news articles/i);
    await expect(searchInput).toBeVisible();

    // Type in search query
    await searchInput.fill('Bitcoin');

    // Wait for search results
    await page.waitForTimeout(500);

    // Check that results are filtered
    await expect(page.getByText(/articles? found/i)).toBeVisible();
  });

  test('should display featured articles section', async ({ page }) => {
    // Check for featured articles heading
    const featuredHeading = page.getByRole('heading', { name: /Featured Articles/i });

    // If featured articles exist, verify they are displayed
    if (await featuredHeading.isVisible()) {
      await expect(featuredHeading).toBeVisible();

      // Check that featured articles are displayed
      const articles = page.locator('article');
      expect(await articles.count()).toBeGreaterThan(0);
    }
  });

  test('should have working news card links', async ({ page }) => {
    // Wait for news cards
    await page.waitForSelector('article', { timeout: 5000 });

    // Click on first "Read More" button
    const firstReadMore = page.getByRole('link', { name: /Read More/i }).first();
    await expect(firstReadMore).toBeVisible();

    // Get the href attribute
    const href = await firstReadMore.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toContain('/news/');
  });

  test('should display newsletter CTA section', async ({ page }) => {
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check for newsletter CTA
    await expect(page.getByRole('heading', { name: /Want to receive news updates/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Subscribe to Newsletter/i })).toBeVisible();
  });

  test('should have responsive category filters on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that category filters are in horizontal scroll
    const filterContainer = page.locator('div', { has: page.getByRole('button', { name: 'All News' }) });
    await expect(filterContainer).toBeVisible();

    // Verify filters are scrollable
    const allNewsBtn = page.getByRole('button', { name: 'All News' });
    await expect(allNewsBtn).toBeVisible();
  });

  test('should display correct category badges on news cards', async ({ page }) => {
    // Wait for news cards
    await page.waitForSelector('article', { timeout: 5000 });

    // Find first news card
    const firstCard = page.locator('article').first();

    // Check that category badge exists
    const badge = firstCard.locator('span[class*="badge"]').first();
    await expect(badge).toBeVisible();

    // Verify badge has text
    const badgeText = await badge.textContent();
    expect(badgeText).toBeTruthy();
  });

  test('should show related symbols on relevant articles', async ({ page }) => {
    // Wait for news cards
    await page.waitForSelector('article', { timeout: 5000 });

    // Look for articles with related symbols
    const relatedSymbolsText = page.getByText(/Related:/i);

    // If related symbols exist, verify they are displayed correctly
    if (await relatedSymbolsText.count() > 0) {
      await expect(relatedSymbolsText.first()).toBeVisible();

      // Check that symbol tags are present
      const symbolTags = page.locator('span[class*="bg-primary"]');
      expect(await symbolTags.count()).toBeGreaterThan(0);
    }
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    // Search for something unlikely to exist
    const searchInput = page.getByPlaceholder(/Search news articles/i);
    await searchInput.fill('zzzznonexistentarticle');

    // Wait for results
    await page.waitForTimeout(500);

    // Check for "no articles found" message
    await expect(page.getByText(/No articles found/i)).toBeVisible();
    await expect(page.getByText(/Try adjusting your filters/i)).toBeVisible();
  });

  test('should maintain filter state after search', async ({ page }) => {
    // Select a category
    await page.getByRole('button', { name: 'Market Analysis' }).click();
    await page.waitForTimeout(300);

    // Verify category is selected
    await expect(page.getByRole('button', { name: 'Market Analysis' })).toHaveClass(/bg-primary-500/);

    // Perform a search
    const searchInput = page.getByPlaceholder(/Search news articles/i);
    await searchInput.fill('trading');
    await page.waitForTimeout(300);

    // Verify category is still selected
    await expect(page.getByRole('button', { name: 'Market Analysis' })).toHaveClass(/bg-primary-500/);
  });
});

test.describe('News Navigation', () => {
  test('should navigate to news page from header', async ({ page }) => {
    // Go to homepage
    await page.goto('/en');

    // Look for News link in navigation (skip if production mode hides menu)
    const newsLink = page.getByRole('link', { name: 'News', exact: true });

    // Only test if navigation is visible (not in production mode)
    if (await newsLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Click news link
      await newsLink.click();

      // Verify we're on news page
      await expect(page).toHaveURL(/\/news/);
      await expect(page.getByRole('heading', { name: /Trading News/i })).toBeVisible();
    } else {
      // Skip test if navigation is hidden (production mode)
      test.skip();
    }
  });

  test('should allow direct navigation to news page', async ({ page }) => {
    // Navigate directly to news page
    await page.goto('/en/news');

    // Verify page loads
    await expect(page).toHaveURL(/\/news/);
    await expect(page.getByRole('heading', { name: /Trading News/i })).toBeVisible();
  });
});

test.describe('News Page Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/en/news');

    // Check main heading
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();

    // Check subheadings
    const subHeadings = page.getByRole('heading', { level: 2 });
    expect(await subHeadings.count()).toBeGreaterThan(0);
  });

  test('should have accessible search input', async ({ page }) => {
    await page.goto('/en/news');

    // Check search input has placeholder
    const searchInput = page.getByPlaceholder(/Search news articles/i);
    await expect(searchInput).toBeVisible();

    // Check input is focusable
    await searchInput.focus();
    await expect(searchInput).toBeFocused();
  });

  test('should have accessible buttons', async ({ page }) => {
    await page.goto('/en/news');

    // Check category filter buttons are accessible
    const allNewsButton = page.getByRole('button', { name: 'All News' });
    await expect(allNewsButton).toBeVisible();

    // Check button is clickable
    await allNewsButton.click();
    await expect(allNewsButton).toHaveClass(/bg-primary-500/);
  });
});

test.describe('News Page Performance', () => {
  test('should load news cards within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/en/news');

    // Wait for news cards to appear
    await page.waitForSelector('article', { timeout: 5000 });

    const loadTime = Date.now() - startTime;

    // Check that page loaded in reasonable time (< 5 seconds)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/en/news');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check for no critical errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('favicon') && // Ignore favicon errors
        !error.includes('DevTools') && // Ignore DevTools messages
        !error.includes('extension'), // Ignore extension errors
    );

    expect(criticalErrors.length).toBe(0);
  });
});
