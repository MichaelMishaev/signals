const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  console.log('🔍 Checking Footer Banner by scrolling...\n');

  try {
    await page.goto('http://localhost:5001/en', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(2000);

    // Scroll to bottom
    console.log('📜 Scrolling to bottom of page...');
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(2000);

    // Take screenshot at bottom
    console.log('📸 Taking screenshot at bottom of page...');
    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/signals/signals/next-saas-nextjs/screenshots/banner-footer-view.png',
      fullPage: false
    });
    console.log('✅ Saved: screenshots/banner-footer-view.png\n');

    // Check footer banner position
    const footerBannerInfo = await page.evaluate(() => {
      const exnessLinks = Array.from(document.querySelectorAll('a[href*="exness"]'));
      return exnessLinks.map((link, i) => {
        const img = link.querySelector('img');
        const rect = link.getBoundingClientRect();
        const offsetTop = link.offsetTop;

        return {
          index: i,
          href: link.href,
          width: img ? img.getAttribute('width') : null,
          height: img ? img.getAttribute('height') : null,
          alt: img ? img.alt : null,
          offsetTop: offsetTop,
          boundingBox: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            inViewport: rect.top >= 0 && rect.top <= window.innerHeight
          }
        };
      });
    });

    console.log('📊 Exness Banner Information:');
    console.log('='.repeat(60));
    footerBannerInfo.forEach(info => {
      console.log(`\nBanner ${info.index + 1}:`);
      console.log(`  Size: ${info.width}x${info.height}`);
      console.log(`  Alt: ${info.alt}`);
      console.log(`  Offset from top: ${info.offsetTop}px`);
      console.log(`  In viewport: ${info.boundingBox.inViewport}`);
      console.log(`  Bounding box: top=${info.boundingBox.top}, left=${info.boundingBox.left}`);
    });
    console.log('='.repeat(60));

    // Identify which is side banner and which is footer
    const sideBanner = footerBannerInfo.find(b => b.width === '120' && b.height === '600');
    const footerBanner = footerBannerInfo.find(b => b.width === '728' && b.height === '90');

    console.log('\n🎯 Banner Identification:');
    console.log(`Side Banner (120x600): ${sideBanner ? '✅ Found at offset ' + sideBanner.offsetTop + 'px' : '❌ Not found'}`);
    console.log(`Footer Banner (728x90): ${footerBanner ? '✅ Found at offset ' + footerBanner.offsetTop + 'px' : '❌ Not found'}`);

    if (footerBanner) {
      // Scroll to footer banner
      console.log('\n📜 Scrolling to footer banner...');
      await page.evaluate((top) => {
        window.scrollTo(0, top - 200);
      }, footerBanner.offsetTop);

      await page.waitForTimeout(1000);

      await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/signals/signals/next-saas-nextjs/screenshots/banner-footer-focused.png',
        fullPage: false
      });
      console.log('✅ Saved: screenshots/banner-footer-focused.png');
    }

    console.log('\n✋ Browser will remain open for 15 seconds...');
    await page.waitForTimeout(15000);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test completed');
  }
})();
