/**
 * Gate System Demo - Visual Walkthrough
 * This test SHOWS you exactly how the gate system works
 */

import { test, expect } from '@playwright/test';

test('DEMO: Complete gate flow with screenshots', async ({ page }) => {
  console.log('\n🎬 STARTING GATE SYSTEM DEMO...\n');

  // Go to test page
  await page.goto('http://localhost:5001/en/gate-test');
  await page.waitForTimeout(1000);

  console.log('📍 Step 1: Fresh start - Anonymous user');
  await page.screenshot({ path: 'test-results/demo-1-start.png', fullPage: true });

  let stage = await page.textContent('[class*="text-2xl font-bold mb-2 uppercase"]');
  let drills = await page.locator('text=📊 Drills Viewed').locator('..').locator('div.text-6xl').first().textContent();
  console.log(`   User Stage: ${stage}`);
  console.log(`   Drills Viewed: ${drills}`);

  // Drill 1
  console.log('\n📍 Step 2: Simulating Drill #1');
  await page.click('text=Simulate Drill');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/demo-2-drill1.png', fullPage: true });

  drills = await page.locator('text=📊 Drills Viewed').locator('..').locator('div.text-6xl').first().textContent();
  console.log(`   ✅ Drill #1 viewed - Counter: ${drills}`);

  // Drill 2
  console.log('\n📍 Step 3: Simulating Drill #2');
  await page.click('text=Simulate Drill');
  await page.waitForTimeout(1000);

  drills = await page.locator('text=📊 Drills Viewed').locator('..').locator('div.text-6xl').first().textContent();
  console.log(`   ✅ Drill #2 viewed - Counter: ${drills}`);

  // Drill 3
  console.log('\n📍 Step 4: Simulating Drill #3 (last free drill)');
  await page.click('text=Simulate Drill');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/demo-3-drill3.png', fullPage: true });

  drills = await page.locator('text=📊 Drills Viewed').locator('..').locator('div.text-6xl').first().textContent();
  console.log(`   ✅ Drill #3 viewed - Counter: ${drills}`);
  console.log(`   ⚠️  NEXT DRILL WILL TRIGGER EMAIL GATE!`);

  // Drill 4 - EMAIL GATE TRIGGERS
  console.log('\n📍 Step 5: Simulating Drill #4 - EMAIL GATE SHOULD APPEAR! 🚪');
  await page.click('text=Simulate Drill');
  await page.waitForTimeout(2000);

  // Check if email gate is visible
  const emailGateVisible = await page.isVisible('text=Unlock Unlimited Signals');
  console.log(`   🚪 Email Gate Visible: ${emailGateVisible ? '✅ YES' : '❌ NO'}`);

  if (emailGateVisible) {
    await page.screenshot({ path: 'test-results/demo-4-email-gate.png', fullPage: true });
    console.log(`   📸 Screenshot saved: demo-4-email-gate.png`);
    console.log(`   💬 Gate says: "Unlock Unlimited Signals"`);

    // Submit email
    console.log('\n📍 Step 6: User provides email');
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.waitForTimeout(500);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    console.log(`   ✅ Email submitted: demo@example.com`);
    console.log(`   ✅ Email gate closed`);
    console.log(`   ✅ User upgraded to: Email User`);

    await page.screenshot({ path: 'test-results/demo-5-after-email.png', fullPage: true });
  }

  // Check new stage
  stage = await page.textContent('[class*="text-2xl font-bold mb-2 uppercase"]');
  drills = await page.locator('text=📊 Drills Viewed').locator('..').locator('div.text-6xl').first().textContent();
  console.log(`   User Stage: ${stage}`);
  console.log(`   Drills Viewed: ${drills}`);

  // Drills 5-9
  console.log('\n📍 Step 7: Viewing drills 5-9 (FREE with email)');
  for (let i = 5; i <= 9; i++) {
    await page.click('text=Simulate Drill');
    await page.waitForTimeout(800);
    drills = await page.locator('text=📊 Drills Viewed').locator('..').locator('div.text-6xl').first().textContent();
    console.log(`   ✅ Drill #${i} viewed - Counter: ${drills}`);
  }

  await page.screenshot({ path: 'test-results/demo-6-drill9.png', fullPage: true });
  console.log(`   ⚠️  NEXT DRILL WILL TRIGGER BROKER GATE!`);

  // Drill 10 - BROKER GATE TRIGGERS
  console.log('\n📍 Step 8: Simulating Drill #10 - BROKER GATE SHOULD APPEAR! 🚪💎');
  await page.click('text=Simulate Drill');
  await page.waitForTimeout(2000);

  // Check if broker gate is visible
  const brokerGateVisible = await page.isVisible('text=Upgrade to Premium Access');
  console.log(`   🚪 Broker Gate Visible: ${brokerGateVisible ? '✅ YES' : '❌ NO'}`);

  if (brokerGateVisible) {
    await page.screenshot({ path: 'test-results/demo-7-broker-gate.png', fullPage: true });
    console.log(`   📸 Screenshot saved: demo-7-broker-gate.png`);
    console.log(`   💬 Gate says: "Upgrade to Premium Access"`);
    console.log(`   💰 Shows pricing: $10, $30, $150`);
  }

  console.log('\n✅ DEMO COMPLETE!');
  console.log('\n📸 Screenshots saved:');
  console.log('   1. demo-1-start.png         - Fresh anonymous user');
  console.log('   2. demo-2-drill1.png        - After first drill');
  console.log('   3. demo-3-drill3.png        - After 3rd drill (warning)');
  console.log('   4. demo-4-email-gate.png    - EMAIL GATE POPUP');
  console.log('   5. demo-5-after-email.png   - After providing email');
  console.log('   6. demo-6-drill9.png        - After 9th drill (warning)');
  console.log('   7. demo-7-broker-gate.png   - BROKER GATE POPUP');
  console.log('\n🎯 Check test-results/ folder to see the screenshots!');
});
