import { test, expect } from '@playwright/test';

test.describe('Email Gate - Simple Direct Test', () => {
  test('Navigate to signal and click drill tabs', async ({ page }) => {
    console.log('🧪 Starting simple email gate test...');

    // Capture all console logs
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      if (text.includes('[GATE]') || text.includes('[SignalPageClient]') || text.includes('[useGateFlow]') || text.includes('[GateManager]')) {
        console.log('📝 ' + text);
      }
    });

    // Clear localStorage
    await page.goto('http://localhost:5001');
    await page.evaluate(() => localStorage.clear());
    console.log('✅ Cleared localStorage');

    // Navigate directly to signal 17
    await page.goto('http://localhost:5001/signal/17');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for React to hydrate

    console.log('✅ Signal page loaded');

    // Take initial screenshot
    await page.screenshot({ path: 'test-initial-state.png', fullPage: true });

    // Check localStorage after page load
    const stateAfterLoad = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      console.log('🔑 LocalStorage keys:', keys);
      const gateKey = keys.find(k => k.includes('gate_flow_state'));
      if (gateKey) {
        const state = localStorage.getItem(gateKey);
        return { key: gateKey, state: JSON.parse(state || '{}') };
      }
      return { key: null, state: null };
    });
    console.log('📊 Gate state after load:', stateAfterLoad);

    // Find drill tab buttons - try multiple selectors
    console.log('🔍 Looking for drill tab buttons...');

    // Try finding by text content
    const caseStudyButton = page.getByText('CASE_STUDY', { exact: false });
    const analyticsButton = page.getByText('ANALYTICS', { exact: false });
    const blogButton = page.getByText('BLOG', { exact: false });

    const caseStudyCount = await caseStudyButton.count();
    const analyticsCount = await analyticsButton.count();
    const blogCount = await blogButton.count();

    console.log(`📋 Found buttons - CASE_STUDY: ${caseStudyCount}, ANALYTICS: ${analyticsCount}, BLOG: ${blogCount}`);

    // If found, click them
    if (caseStudyCount > 0) {
      console.log('👆 Clicking CASE_STUDY tab...');
      await caseStudyButton.first().click();
      await page.waitForTimeout(1000);

      const stateAfterFirst = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const gateKey = keys.find(k => k.includes('gate_flow_state'));
        if (gateKey) {
          return JSON.parse(localStorage.getItem(gateKey) || '{}');
        }
        return null;
      });
      console.log('📊 State after 1st click:', stateAfterFirst);
      await page.screenshot({ path: 'test-after-first-click.png', fullPage: true });
    }

    if (analyticsCount > 0) {
      console.log('👆 Clicking ANALYTICS tab...');
      await analyticsButton.first().click();
      await page.waitForTimeout(1000);

      const stateAfterSecond = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        const gateKey = keys.find(k => k.includes('gate_flow_state'));
        if (gateKey) {
          return JSON.parse(localStorage.getItem(gateKey) || '{}');
        }
        return null;
      });
      console.log('📊 State after 2nd click:', stateAfterSecond);
      await page.screenshot({ path: 'test-after-second-click.png', fullPage: true });

      // Check if email gate modal is visible
      const emailGateModal = page.locator('[role="dialog"]').filter({ hasText: /enter.*email|verify.*email|email.*gate/i });
      const isModalVisible = await emailGateModal.isVisible().catch(() => false);
      console.log('🚪 Email gate modal visible?', isModalVisible);

      if (isModalVisible) {
        console.log('✅ EMAIL GATE APPEARED!');
        await page.screenshot({ path: 'test-email-gate-shown.png', fullPage: true });
      } else {
        console.log('❌ Email gate did NOT appear');

        // Log all console messages that might be relevant
        console.log('\n📝 All [GATE] related logs:');
        consoleLogs.filter(log => log.includes('[GATE]')).forEach(log => console.log('  ' + log));
      }
    }

    // Final state check
    const finalState = await page.evaluate(() => {
      const keys = Object.keys(localStorage);
      console.log('🔑 Final localStorage keys:', keys);
      const gateKey = keys.find(k => k.includes('gate_flow_state'));
      if (gateKey) {
        return JSON.parse(localStorage.getItem(gateKey) || '{}');
      }
      return null;
    });
    console.log('📊 Final gate state:', finalState);

    // Assert that we should have drill views recorded
    if (finalState) {
      console.log(`✅ drillsViewed: ${finalState.drillsViewed}`);
      expect(finalState.drillsViewed).toBeGreaterThanOrEqual(1);
    } else {
      console.log('❌ No gate state found in localStorage!');
    }
  });
});
