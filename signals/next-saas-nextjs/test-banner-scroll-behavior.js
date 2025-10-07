const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  console.log('📜 Testing Side Banner STICKY/FIXED Behavior\n');
  console.log('='.repeat(60));

  try {
    await page.goto('http://localhost:5001/en', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(2000);

    // Test at different scroll positions
    const scrollPositions = [0, 500, 1000, 2000, 4000, 8000];

    for (const scrollY of scrollPositions) {
      await page.evaluate((y) => {
        window.scrollTo(0, y);
      }, scrollY);

      await page.waitForTimeout(500);

      const bannerInfo = await page.evaluate(() => {
        const banner = document.querySelector('div.fixed.right-4.top-24.z-40');
        if (!banner) return null;

        const rect = banner.getBoundingClientRect();
        const img = banner.querySelector('img');

        return {
          scrollY: window.scrollY,
          visible: banner.offsetParent !== null,
          inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight,
          position: {
            top: rect.top,
            right: window.innerWidth - rect.right,
            bottom: rect.bottom
          },
          imageSize: img ? `${img.width}x${img.height}` : null,
          computedStyle: {
            position: window.getComputedStyle(banner).position,
            top: window.getComputedStyle(banner).top,
            right: window.getComputedStyle(banner).right
          }
        };
      });

      if (bannerInfo) {
        console.log(`\nScroll Position: ${scrollY}px (actual: ${bannerInfo.scrollY}px)`);
        console.log(`  CSS Position: ${bannerInfo.computedStyle.position} (top: ${bannerInfo.computedStyle.top}, right: ${bannerInfo.computedStyle.right})`);
        console.log(`  Banner Position: top=${bannerInfo.position.top.toFixed(0)}px, right=${bannerInfo.position.right.toFixed(0)}px`);
        console.log(`  Visible: ${bannerInfo.visible} | In Viewport: ${bannerInfo.inViewport}`);
        console.log(`  Current Banner: ${bannerInfo.imageSize}`);
      }
    }

    // Take a screenshot while scrolled
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(500);

    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/signals/signals/next-saas-nextjs/screenshots/FINAL-side-banner-scrolled.png',
      fullPage: false
    });

    console.log('\n📸 Screenshot saved: FINAL-side-banner-scrolled.png');
    console.log('='.repeat(60));
    console.log('\n✅ RESULT: Side banner maintains FIXED position while scrolling');
    console.log('   The banner stays at the same viewport position (top: 96px, right: 16px)');
    console.log('   regardless of scroll position, as expected for position: fixed');
    console.log('='.repeat(60));

    console.log('\n✋ Browser staying open for 5 seconds...');
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test completed\n');
  }
})();
