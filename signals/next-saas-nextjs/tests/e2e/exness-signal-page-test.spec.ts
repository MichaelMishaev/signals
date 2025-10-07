import { test, expect } from '@playwright/test';

test.describe('Exness Banners on Signal Detail Page', () => {
  // Use an actual signal ID from the test data
  const SIGNAL_PAGE_URL = 'http://localhost:5001/en/signal/1';

  test('Desktop - Comprehensive banner verification on signal page', async ({ page }) => {
    console.log('\n=== SIGNAL PAGE BANNER TEST - DESKTOP ===\n');

    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('✓ Viewport set to 1920x1080 (Desktop)');

    // Navigate to signal detail page
    await page.goto(SIGNAL_PAGE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('✓ Signal detail page loaded');

    // ========================================
    // 1. INITIAL SCREENSHOTS
    // ========================================
    console.log('\n--- Step 1: Initial Screenshots ---');

    await page.screenshot({
      path: 'test-results/signal-page-desktop-full.png',
      fullPage: true
    });
    console.log('✓ Full page screenshot: signal-page-desktop-full.png');

    await page.screenshot({
      path: 'test-results/signal-page-desktop-viewport.png',
      fullPage: false
    });
    console.log('✓ Viewport screenshot: signal-page-desktop-viewport.png');

    // ========================================
    // 2. VERIFY SIDE BANNER IN SIDEBAR
    // ========================================
    console.log('\n--- Step 2: Side Banner DOM Verification ---');

    const sideBannerAnalysis = await page.evaluate(() => {
      // Find all images with Exness in alt text
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.toLowerCase().includes('exness') || img.src?.toLowerCase().includes('exness')
      );

      // Find vertical banner (side banner - taller than wide)
      const verticalBanner = exnessImages.find(img => {
        const rect = img.getBoundingClientRect();
        return rect.height > rect.width;
      });

      if (!verticalBanner) {
        return { found: false, message: 'Vertical Exness banner not found' };
      }

      // Check if it's in an aside element or sidebar
      let element: HTMLElement | null = verticalBanner;
      let inAside = false;
      let inLgColSpan3 = false;
      const hierarchy: string[] = [];

      while (element && element !== document.body && hierarchy.length < 15) {
        const tag = element.tagName.toLowerCase();
        const classes = element.className || '';
        hierarchy.push(`${tag}[${classes}]`);

        if (tag === 'aside') inAside = true;
        if (classes.includes('lg:col-span-3')) inLgColSpan3 = true;

        element = element.parentElement;
      }

      // Get banner position
      const rect = verticalBanner.getBoundingClientRect();

      // Check if parent has sticky classes
      const parentElement = verticalBanner.closest('div');
      const hasSticky = parentElement?.className.includes('sticky') || false;

      return {
        found: true,
        inAside,
        inLgColSpan3,
        hasSticky,
        dimensions: {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          isVisible: rect.top >= 0 && rect.top < window.innerHeight
        },
        bannerInfo: {
          alt: verticalBanner.alt,
          src: verticalBanner.src
        },
        hierarchy: hierarchy.reverse()
      };
    });

    console.log('Side Banner Analysis:');
    console.log('  Found:', sideBannerAnalysis.found);
    console.log('  In <aside>:', sideBannerAnalysis.inAside);
    console.log('  In lg:col-span-3:', sideBannerAnalysis.inLgColSpan3);
    console.log('  Has sticky parent:', sideBannerAnalysis.hasSticky);
    console.log('  Dimensions:', sideBannerAnalysis.dimensions);
    console.log('  Banner info:', sideBannerAnalysis.bannerInfo);
    console.log('  DOM Hierarchy:');
    sideBannerAnalysis.hierarchy?.forEach((item: string, index: number) => {
      console.log(`    ${index}: ${item}`);
    });

    // ========================================
    // 3. SCROLL TEST - STICKY BEHAVIOR
    // ========================================
    console.log('\n--- Step 3: Sticky Behavior Test ---');

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
    console.log('✓ Scrolled down 800px');

    await page.screenshot({
      path: 'test-results/signal-page-after-scroll.png',
      fullPage: false
    });
    console.log('✓ Screenshot after scroll: signal-page-after-scroll.png');

    // Check if side banner is still visible
    const bannerAfterScroll = await page.evaluate(() => {
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.toLowerCase().includes('exness') || img.src?.toLowerCase().includes('exness')
      );

      const verticalBanner = exnessImages.find(img => {
        const rect = img.getBoundingClientRect();
        return rect.height > rect.width;
      });

      if (!verticalBanner) return { found: false };

      const rect = verticalBanner.getBoundingClientRect();
      return {
        found: true,
        position: {
          top: rect.top,
          bottom: rect.bottom,
          isInViewport: rect.top >= 0 && rect.bottom <= window.innerHeight,
          isPartiallyVisible: rect.top < window.innerHeight && rect.bottom > 0
        }
      };
    });

    console.log('Side Banner after scroll:');
    console.log('  Found:', bannerAfterScroll.found);
    console.log('  Position:', bannerAfterScroll.position);

    // ========================================
    // 4. FOOTER BANNER VERIFICATION
    // ========================================
    console.log('\n--- Step 4: Footer Banner Verification ---');

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    console.log('✓ Scrolled to bottom');

    await page.screenshot({
      path: 'test-results/signal-page-footer-banner.png',
      fullPage: false
    });
    console.log('✓ Footer banner screenshot: signal-page-footer-banner.png');

    const footerBannerAnalysis = await page.evaluate(() => {
      // Find horizontal banner (footer - wider than tall)
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.toLowerCase().includes('exness') || img.src?.toLowerCase().includes('exness')
      );

      const horizontalBanner = exnessImages.find(img => {
        const rect = img.getBoundingClientRect();
        return rect.width > rect.height;
      });

      if (!horizontalBanner) {
        return { found: false, message: 'Horizontal Exness banner not found' };
      }

      const rect = horizontalBanner.getBoundingClientRect();

      // Check if it's above the sticky action button
      const stickyButton = document.querySelector('.fixed.bottom-0');
      const stickyButtonRect = stickyButton?.getBoundingClientRect();

      // Get hierarchy
      let element: HTMLElement | null = horizontalBanner;
      const hierarchy: string[] = [];

      while (element && element !== document.body && hierarchy.length < 15) {
        const tag = element.tagName.toLowerCase();
        const classes = element.className || '';
        hierarchy.push(`${tag}[${classes}]`);
        element = element.parentElement;
      }

      return {
        found: true,
        dimensions: {
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
          isVisible: rect.top < window.innerHeight && rect.bottom > 0
        },
        bannerInfo: {
          alt: horizontalBanner.alt,
          src: horizontalBanner.src
        },
        isAboveStickyButton: stickyButtonRect ? rect.bottom < stickyButtonRect.top : false,
        stickyButtonPosition: stickyButtonRect?.top,
        hierarchy: hierarchy.reverse()
      };
    });

    console.log('Footer Banner Analysis:');
    console.log('  Found:', footerBannerAnalysis.found);
    console.log('  Dimensions:', footerBannerAnalysis.dimensions);
    console.log('  Banner info:', footerBannerAnalysis.bannerInfo);
    console.log('  Above sticky button:', footerBannerAnalysis.isAboveStickyButton);
    console.log('  Sticky button position:', footerBannerAnalysis.stickyButtonPosition);
    console.log('  DOM Hierarchy:');
    footerBannerAnalysis.hierarchy?.forEach((item: string, index: number) => {
      console.log(`    ${index}: ${item}`);
    });

    // ========================================
    // 5. ROTATION TEST
    // ========================================
    console.log('\n--- Step 5: Banner Rotation Test ---');

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    console.log('✓ Scrolled back to top');

    // Scroll down to see the side banner
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);

    // Get initial banner src
    const initialBanner = await page.evaluate(() => {
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.toLowerCase().includes('exness') || img.src?.toLowerCase().includes('exness')
      );
      const verticalBanner = exnessImages.find(img => {
        const rect = img.getBoundingClientRect();
        return rect.height > rect.width;
      });
      return verticalBanner?.src;
    });

    await page.screenshot({
      path: 'test-results/signal-page-rotation-0s.png',
      fullPage: false
    });
    console.log('✓ Rotation screenshot at 0s');
    console.log('  Initial banner:', initialBanner);

    // Wait 6 seconds for rotation
    console.log('⏳ Waiting 6 seconds for rotation...');
    await page.waitForTimeout(6000);

    const rotatedBanner = await page.evaluate(() => {
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.toLowerCase().includes('exness') || img.src?.toLowerCase().includes('exness')
      );
      const verticalBanner = exnessImages.find(img => {
        const rect = img.getBoundingClientRect();
        return rect.height > rect.width;
      });
      return verticalBanner?.src;
    });

    await page.screenshot({
      path: 'test-results/signal-page-rotation-6s.png',
      fullPage: false
    });
    console.log('✓ Rotation screenshot at 6s');
    console.log('  Rotated banner:', rotatedBanner);
    console.log('  Banner changed:', initialBanner !== rotatedBanner);

    // Wait another 6 seconds
    console.log('⏳ Waiting another 6 seconds for next rotation...');
    await page.waitForTimeout(6000);

    const secondRotation = await page.evaluate(() => {
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.toLowerCase().includes('exness') || img.src?.toLowerCase().includes('exness')
      );
      const verticalBanner = exnessImages.find(img => {
        const rect = img.getBoundingClientRect();
        return rect.height > rect.width;
      });
      return verticalBanner?.src;
    });

    await page.screenshot({
      path: 'test-results/signal-page-rotation-12s.png',
      fullPage: false
    });
    console.log('✓ Rotation screenshot at 12s');
    console.log('  Second rotation banner:', secondRotation);
    console.log('  Banner changed again:', rotatedBanner !== secondRotation);
  });

  test('Mobile - Banner verification on signal page', async ({ page }) => {
    console.log('\n=== SIGNAL PAGE BANNER TEST - MOBILE ===\n');

    await page.setViewportSize({ width: 375, height: 667 });
    console.log('✓ Viewport set to 375x667 (Mobile)');

    await page.goto(SIGNAL_PAGE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    console.log('✓ Signal page loaded');

    // Initial screenshot
    await page.screenshot({
      path: 'test-results/signal-page-mobile-initial.png',
      fullPage: false
    });
    console.log('✓ Mobile initial screenshot');

    // Analyze banners on mobile
    const mobileBannerInfo = await page.evaluate(() => {
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.toLowerCase().includes('exness') || img.src?.toLowerCase().includes('exness')
      );

      return {
        bannerCount: exnessImages.length,
        banners: exnessImages.map(img => {
          const rect = img.getBoundingClientRect();
          return {
            alt: img.alt,
            src: img.src,
            width: rect.width,
            height: rect.height,
            orientation: rect.height > rect.width ? 'vertical' : 'horizontal',
            isVisible: rect.top < window.innerHeight && rect.bottom > 0
          };
        })
      };
    });

    console.log('Mobile Banner Analysis:');
    console.log('  Total Exness banners:', mobileBannerInfo.bannerCount);
    mobileBannerInfo.banners.forEach((banner: any, index: number) => {
      console.log(`  Banner ${index + 1}:`);
      console.log(`    Orientation: ${banner.orientation}`);
      console.log(`    Size: ${banner.width}x${banner.height}`);
      console.log(`    Visible: ${banner.isVisible}`);
      console.log(`    Alt: ${banner.alt}`);
    });

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    await page.screenshot({
      path: 'test-results/signal-page-mobile-footer.png',
      fullPage: false
    });
    console.log('✓ Mobile footer screenshot');

    // Full page screenshot
    await page.screenshot({
      path: 'test-results/signal-page-mobile-full.png',
      fullPage: true
    });
    console.log('✓ Mobile full page screenshot');
  });
});
