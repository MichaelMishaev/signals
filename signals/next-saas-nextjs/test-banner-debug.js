const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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

  console.log('🔍 Starting Exness Banner Debug Test...\n');

  // Collect console logs
  const consoleMessages = [];
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    console.log('Browser Console:', text);
  });

  // Collect errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.log('❌ Page Error:', error.message);
  });

  try {
    console.log('📍 Navigating to http://localhost:5001/en...');
    await page.goto('http://localhost:5001/en', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✅ Page loaded\n');

    // Wait a bit for any dynamic content
    await page.waitForTimeout(2000);

    // Take initial screenshot
    console.log('📸 Taking initial screenshot...');
    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/signals/signals/next-saas-nextjs/screenshots/banner-debug-full-page.png',
      fullPage: true
    });
    console.log('✅ Saved: screenshots/banner-debug-full-page.png\n');

    // Take viewport screenshot
    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/signals/signals/next-saas-nextjs/screenshots/banner-debug-viewport.png',
      fullPage: false
    });
    console.log('✅ Saved: screenshots/banner-debug-viewport.png\n');

    // Check for side banner
    console.log('🔍 Checking for Side Banner (ExnessBanner)...');
    const sideBannerSelectors = [
      'div.fixed.right-4.top-24.z-40',
      '[class*="ExnessBanner"]',
      'div[class*="fixed"][class*="right-4"]',
      'a[href*="exness"]'
    ];

    for (const selector of sideBannerSelectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} element(s) matching: ${selector}`);

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const boundingBox = await element.boundingBox();
          const isVisible = await element.isVisible();
          const innerHTML = await element.evaluate(el => el.innerHTML.substring(0, 200));
          const classes = await element.evaluate(el => el.className);
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              display: computed.display,
              visibility: computed.visibility,
              opacity: computed.opacity,
              position: computed.position,
              zIndex: computed.zIndex,
              width: computed.width,
              height: computed.height
            };
          });

          console.log(`  Element ${i + 1}:`);
          console.log(`    Classes: ${classes}`);
          console.log(`    Visible: ${isVisible}`);
          console.log(`    Bounding Box:`, boundingBox);
          console.log(`    Computed Styles:`, styles);
          console.log(`    HTML (first 200 chars): ${innerHTML}...\n`);
        }
      } else {
        console.log(`❌ No elements found for: ${selector}`);
      }
    }

    // Check for footer banner
    console.log('\n🔍 Checking for Footer Banner (ExnessFooterBanner)...');
    const footerBannerSelectors = [
      '[class*="ExnessFooterBanner"]',
      'div[class*="footer"][class*="banner"]',
      'a[href*="exness"][class*="footer"]'
    ];

    for (const selector of footerBannerSelectors) {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`✅ Found ${elements.length} element(s) matching: ${selector}`);

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const boundingBox = await element.boundingBox();
          const isVisible = await element.isVisible();
          const innerHTML = await element.evaluate(el => el.innerHTML.substring(0, 200));
          const classes = await element.evaluate(el => el.className);
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              display: computed.display,
              visibility: computed.visibility,
              opacity: computed.opacity,
              position: computed.position,
              width: computed.width,
              height: computed.height
            };
          });

          console.log(`  Element ${i + 1}:`);
          console.log(`    Classes: ${classes}`);
          console.log(`    Visible: ${isVisible}`);
          console.log(`    Bounding Box:`, boundingBox);
          console.log(`    Computed Styles:`, styles);
          console.log(`    HTML (first 200 chars): ${innerHTML}...\n`);
        }
      } else {
        console.log(`❌ No elements found for: ${selector}`);
      }
    }

    // General search for any Exness-related content
    console.log('\n🔍 Searching for any Exness-related content in DOM...');
    const exnessContent = await page.evaluate(() => {
      const bodyHTML = document.body.innerHTML;
      const hasExnessText = bodyHTML.toLowerCase().includes('exness');
      const exnessLinks = Array.from(document.querySelectorAll('a[href*="exness"]')).map(a => ({
        href: a.href,
        text: a.textContent,
        classes: a.className,
        visible: a.offsetParent !== null
      }));

      return { hasExnessText, exnessLinks };
    });

    console.log('Exness text in body:', exnessContent.hasExnessText);
    console.log('Exness links found:', exnessContent.exnessLinks.length);
    if (exnessContent.exnessLinks.length > 0) {
      console.log('Exness links:', JSON.stringify(exnessContent.exnessLinks, null, 2));
    }

    // Check viewport and window size
    console.log('\n📐 Checking viewport and window size...');
    const viewportInfo = await page.evaluate(() => {
      return {
        windowInnerWidth: window.innerWidth,
        windowInnerHeight: window.innerHeight,
        documentWidth: document.documentElement.clientWidth,
        documentHeight: document.documentElement.clientHeight
      };
    });
    console.log('Viewport info:', viewportInfo);

    // Check if there are any fixed/sticky elements on the page
    console.log('\n🔍 Checking for all fixed/sticky positioned elements...');
    const fixedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const fixed = [];
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'sticky') {
          fixed.push({
            tag: el.tagName,
            classes: el.className,
            position: style.position,
            zIndex: style.zIndex,
            top: style.top,
            right: style.right,
            bottom: style.bottom,
            left: style.left,
            innerHTML: el.innerHTML.substring(0, 100)
          });
        }
      });
      return fixed;
    });
    console.log(`Found ${fixedElements.length} fixed/sticky elements:`);
    fixedElements.forEach((el, i) => {
      console.log(`${i + 1}.`, el);
    });

    // Summary
    console.log('\n📊 SUMMARY:');
    console.log('='.repeat(50));
    console.log(`Console Messages: ${consoleMessages.length}`);
    console.log(`Page Errors: ${pageErrors.length}`);
    console.log(`Window Size: ${viewportInfo.windowInnerWidth}x${viewportInfo.windowInnerHeight}`);
    console.log(`Exness Content Present: ${exnessContent.hasExnessText}`);
    console.log(`Exness Links: ${exnessContent.exnessLinks.length}`);
    console.log(`Fixed/Sticky Elements: ${fixedElements.length}`);
    console.log('='.repeat(50));

    if (pageErrors.length > 0) {
      console.log('\n❌ Page Errors:');
      pageErrors.forEach(error => console.log('  -', error));
    }

    // Keep browser open for manual inspection
    console.log('\n✋ Browser will remain open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('❌ Test Error:', error);
  } finally {
    await browser.close();
    console.log('\n✅ Test completed');
  }
})();
