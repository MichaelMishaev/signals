import { test, expect } from '@playwright/test';

test.describe('Exness Banner Final Implementation Test', () => {
  const BASE_URL = 'http://localhost:5001/en';

  test('Comprehensive banner verification - Desktop', async ({ page }) => {
    console.log('\n=== STARTING COMPREHENSIVE BANNER TEST ===\n');

    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    console.log('✓ Viewport set to 1920x1080 (Desktop)');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✓ Page loaded');

    // ========================================
    // 1. INITIAL SCREENSHOT
    // ========================================
    console.log('\n--- Step 1: Initial Screenshot ---');
    await page.screenshot({
      path: 'test-results/desktop-initial-full.png',
      fullPage: true
    });
    console.log('✓ Full page screenshot taken: desktop-initial-full.png');

    await page.screenshot({
      path: 'test-results/desktop-initial-viewport.png',
      fullPage: false
    });
    console.log('✓ Viewport screenshot taken: desktop-initial-viewport.png');

    // ========================================
    // 2. DOM STRUCTURE VERIFICATION
    // ========================================
    console.log('\n--- Step 2: DOM Structure Verification ---');

    // Verify side banner location
    const sideBannerInfo = await page.evaluate(() => {
      // Look for the side banner by finding the "Sponsored" text with "Trade with Exness" header
      const sideBannerElements = Array.from(document.querySelectorAll('div')).filter(div => {
        const text = div.textContent || '';
        return text.includes('Sponsored') && text.includes('Trade with Exness');
      });

      if (sideBannerElements.length === 0) {
        return { found: false, message: 'Side banner not found' };
      }

      const sideBanner = sideBannerElements[0];

      // Get the sticky sidebar container
      const stickySidebar = document.querySelector('body > main > section.bg-background-3 > div > div > div.lg\\:col-span-1 > div > div');

      // Check if side banner is inside sticky sidebar
      const isInStickySidebar = stickySidebar?.contains(sideBanner) || false;

      // Get parent hierarchy
      let element = sideBanner;
      const hierarchy: string[] = [];
      while (element && element !== document.body && hierarchy.length < 10) {
        const classes = element.className || 'no-class';
        const tag = element.tagName.toLowerCase();
        hierarchy.push(`${tag}.${classes}`);
        element = element.parentElement as HTMLElement;
      }

      return {
        found: true,
        isInStickySidebar,
        hierarchy: hierarchy.reverse(),
        parentClasses: sideBanner.parentElement?.className || 'none',
        bannerClasses: sideBanner.className
      };
    });

    console.log('Side Banner Analysis:');
    console.log('  Found:', sideBannerInfo.found);
    console.log('  Inside sticky sidebar:', sideBannerInfo.isInStickySidebar);
    console.log('  Banner classes:', sideBannerInfo.bannerClasses);
    console.log('  Parent classes:', sideBannerInfo.parentClasses);
    console.log('  DOM Hierarchy:', sideBannerInfo.hierarchy?.join(' > '));

    // Verify footer banner location
    const footerBannerInfo = await page.evaluate(() => {
      // Find the red risk disclaimer section
      const redSection = document.querySelector('body > main > section.py-12.md\\:py-16.bg-red-50');

      if (!redSection) {
        return { found: false, message: 'Red disclaimer section not found' };
      }

      // Find all previous siblings
      let currentElement = redSection.previousElementSibling;
      let foundFooterBanner = false;
      let footerBannerElement = null;

      // Check the immediate previous sibling for footer banner
      if (currentElement) {
        const text = currentElement.textContent || '';
        if (text.includes('Sponsored') || text.includes('Risk warning')) {
          foundFooterBanner = true;
          footerBannerElement = currentElement;
        }
      }

      if (!foundFooterBanner || !footerBannerElement) {
        return { found: false, message: 'Footer banner not found before red section' };
      }

      // Get hierarchy
      let element = footerBannerElement;
      const hierarchy: string[] = [];
      while (element && element !== document.body && hierarchy.length < 10) {
        const classes = element.className || 'no-class';
        const tag = element.tagName.toLowerCase();
        hierarchy.push(`${tag}.${classes}`);
        element = element.parentElement as HTMLElement;
      }

      return {
        found: true,
        isAboveRedSection: true,
        hierarchy: hierarchy.reverse(),
        bannerClasses: footerBannerElement.className,
        redSectionFound: true
      };
    });

    console.log('\nFooter Banner Analysis:');
    console.log('  Found:', footerBannerInfo.found);
    console.log('  Above red disclaimer:', footerBannerInfo.isAboveRedSection);
    console.log('  Banner classes:', footerBannerInfo.bannerClasses);
    console.log('  DOM Hierarchy:', footerBannerInfo.hierarchy?.join(' > '));

    // ========================================
    // 3. STICKY BEHAVIOR TEST
    // ========================================
    console.log('\n--- Step 3: Sticky Behavior Test ---');

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1000);
    console.log('✓ Scrolled down 800px');

    await page.screenshot({
      path: 'test-results/desktop-after-scroll.png',
      fullPage: false
    });
    console.log('✓ Screenshot taken after scroll: desktop-after-scroll.png');

    // Verify side banner is still visible (sticky behavior)
    const sideBannerVisibleAfterScroll = await page.evaluate(() => {
      const sideBannerElements = Array.from(document.querySelectorAll('div')).filter(div => {
        const text = div.textContent || '';
        return text.includes('Sponsored') && text.includes('Trade with Exness');
      });

      if (sideBannerElements.length === 0) return false;

      const banner = sideBannerElements[0];
      const rect = banner.getBoundingClientRect();

      return {
        visible: rect.top >= 0 && rect.top < window.innerHeight,
        topPosition: rect.top,
        inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight
      };
    });

    console.log('Side Banner after scroll:');
    console.log('  Visible:', sideBannerVisibleAfterScroll);

    // ========================================
    // 4. ROTATION TEST
    // ========================================
    console.log('\n--- Step 4: Banner Rotation Test ---');

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    console.log('✓ Scrolled back to top');

    // Take screenshot at 0s
    await page.screenshot({
      path: 'test-results/desktop-rotation-0s.png',
      fullPage: false
    });
    console.log('✓ Rotation screenshot at 0s');

    // Wait 6 seconds for rotation
    console.log('⏳ Waiting 6 seconds for banner rotation...');
    await page.waitForTimeout(6000);

    await page.screenshot({
      path: 'test-results/desktop-rotation-6s.png',
      fullPage: false
    });
    console.log('✓ Rotation screenshot at 6s');

    // Wait another 6 seconds
    console.log('⏳ Waiting another 6 seconds for next rotation...');
    await page.waitForTimeout(6000);

    await page.screenshot({
      path: 'test-results/desktop-rotation-12s.png',
      fullPage: false
    });
    console.log('✓ Rotation screenshot at 12s');

    // ========================================
    // 5. FOOTER BANNER TEST
    // ========================================
    console.log('\n--- Step 5: Footer Banner Test ---');

    // Scroll to bottom to see footer banner
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);
    console.log('✓ Scrolled to bottom');

    await page.screenshot({
      path: 'test-results/desktop-footer-banner.png',
      fullPage: false
    });
    console.log('✓ Footer banner screenshot taken');

    // Verify footer banner is visible
    const footerBannerVisible = await page.evaluate(() => {
      const redSection = document.querySelector('body > main > section.py-12.md\\:py-16.bg-red-50');
      if (!redSection) return { found: false };

      const footerBanner = redSection.previousElementSibling;
      if (!footerBanner) return { found: false };

      const rect = footerBanner.getBoundingClientRect();
      return {
        found: true,
        visible: rect.top < window.innerHeight && rect.bottom > 0,
        topPosition: rect.top
      };
    });

    console.log('Footer Banner visibility:', footerBannerVisible);
  });

  test('Mobile viewport verification', async ({ page }) => {
    console.log('\n=== MOBILE VIEWPORT TEST ===\n');

    await page.setViewportSize({ width: 375, height: 667 });
    console.log('✓ Viewport set to 375x667 (Mobile)');

    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Initial screenshot
    await page.screenshot({
      path: 'test-results/mobile-initial.png',
      fullPage: false
    });
    console.log('✓ Mobile initial screenshot taken');

    // Verify banners are responsive
    const mobileInfo = await page.evaluate(() => {
      const sideBanners = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.includes('Exness')
      );

      return {
        bannerCount: sideBanners.length,
        bannerSizes: sideBanners.map(img => ({
          width: img.clientWidth,
          height: img.clientHeight,
          alt: img.alt
        }))
      };
    });

    console.log('Mobile banner info:', mobileInfo);

    // Scroll test
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-results/mobile-after-scroll.png',
      fullPage: false
    });
    console.log('✓ Mobile scroll screenshot taken');

    // Footer banner
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-results/mobile-footer.png',
      fullPage: false
    });
    console.log('✓ Mobile footer screenshot taken');

    // Rotation test
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: 'test-results/mobile-rotation-0s.png',
      fullPage: false
    });

    await page.waitForTimeout(6000);

    await page.screenshot({
      path: 'test-results/mobile-rotation-6s.png',
      fullPage: false
    });
    console.log('✓ Mobile rotation test complete');
  });

  test('Generate detailed DOM report', async ({ page }) => {
    console.log('\n=== DOM STRUCTURE REPORT ===\n');

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const domReport = await page.evaluate(() => {
      const report: any = {
        timestamp: new Date().toISOString(),
        checks: {}
      };

      // Check 1: Sticky sidebar structure
      const stickySidebar = document.querySelector('body > main > section.bg-background-3 > div > div > div.lg\\:col-span-1 > div > div');
      report.checks.stickySidebar = {
        exists: !!stickySidebar,
        classes: stickySidebar?.className,
        childCount: stickySidebar?.children.length
      };

      // Check 2: Side banner
      const sideBanners = Array.from(document.querySelectorAll('div')).filter(div => {
        const text = div.textContent || '';
        return text.includes('Sponsored') && text.includes('Trade with Exness');
      });

      if (sideBanners.length > 0) {
        const sideBanner = sideBanners[0];
        report.checks.sideBanner = {
          found: true,
          insideStickySidebar: stickySidebar?.contains(sideBanner),
          classes: sideBanner.className,
          hasImage: sideBanner.querySelector('img') !== null,
          imageAlt: sideBanner.querySelector('img')?.alt,
          imageSrc: sideBanner.querySelector('img')?.src
        };
      } else {
        report.checks.sideBanner = { found: false };
      }

      // Check 3: Red disclaimer section
      const redSection = document.querySelector('body > main > section.py-12.md\\:py-16.bg-red-50');
      report.checks.redSection = {
        exists: !!redSection,
        classes: redSection?.className
      };

      // Check 4: Footer banner
      if (redSection) {
        const footerBanner = redSection.previousElementSibling;
        report.checks.footerBanner = {
          found: !!footerBanner,
          isAboveRedSection: !!footerBanner,
          classes: footerBanner?.className,
          hasImage: footerBanner?.querySelector('img') !== null,
          imageAlt: footerBanner?.querySelector('img')?.alt,
          imageSrc: footerBanner?.querySelector('img')?.src
        };
      }

      // Check 5: All Exness images
      const exnessImages = Array.from(document.querySelectorAll('img')).filter(img =>
        img.alt?.includes('Exness') || img.src?.includes('exness')
      );

      report.checks.allExnessImages = {
        count: exnessImages.length,
        images: exnessImages.map(img => ({
          alt: img.alt,
          src: img.src,
          width: img.clientWidth,
          height: img.clientHeight
        }))
      };

      return report;
    });

    console.log('\n=== DETAILED DOM REPORT ===');
    console.log(JSON.stringify(domReport, null, 2));

    // Write report to file
    await page.evaluate((report) => {
      const reportJson = JSON.stringify(report, null, 2);
      // This will be logged in the test output
      console.log('DOM_REPORT:', reportJson);
    }, domReport);
  });
});
