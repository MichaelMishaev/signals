// Test translation system end-to-end
async function main() {
  const base = 'http://localhost:5001';

  console.log('🧪 Testing Translation System Flow\n');
  console.log('=' .repeat(60));

  // ========================================
  // TEST 1: Signal Translation Flow
  // ========================================
  console.log('\n📈 TEST 1: Signal Translation Flow');
  console.log('-'.repeat(60));

  // Step 1: Fetch signal ID 1
  console.log('\n1️⃣ Fetching Signal ID 1...');
  const signalBefore = await fetch(`${base}/api/signals/1`).then(r => r.json());
  console.log('   Before:');
  console.log(`   ├─ Title EN: ${signalBefore.signal.title}`);
  console.log(`   ├─ Title UR: ${signalBefore.signal.title_ur || '(empty)'}`);
  console.log(`   ├─ Content EN: ${signalBefore.signal.content.substring(0, 50)}...`);
  console.log(`   └─ Content UR: ${signalBefore.signal.content_ur ? signalBefore.signal.content_ur.substring(0, 50) + '...' : '(empty)'}`);

  // Step 2: Update with new Urdu translation
  console.log('\n2️⃣ Updating Urdu translation...');
  const timestamp = new Date().toISOString();
  const newUrduTitle = `[TESTED ${timestamp}] اردو عنوان`;
  const newUrduContent = `[TESTED ${timestamp}] یہ ایک ٹیسٹ ترجمہ ہے جو تصدیق کرتا ہے کہ نظام صحیح طریقے سے کام کر رہا ہے`;

  const updateResponse = await fetch(`${base}/api/signals/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title_ur: newUrduTitle,
      content_ur: newUrduContent,
    }),
  });

  if (updateResponse.ok) {
    console.log('   ✅ Update successful!');
  } else {
    console.log(`   ❌ Update failed: ${updateResponse.status} ${updateResponse.statusText}`);
    const error = await updateResponse.text();
    console.log(`   Error: ${error}`);
    return;
  }

  // Step 3: Verify update
  console.log('\n3️⃣ Verifying update...');
  const signalAfter = await fetch(`${base}/api/signals/1`).then(r => r.json());
  console.log('   After:');
  console.log(`   ├─ Title UR: ${signalAfter.signal.title_ur}`);
  console.log(`   └─ Content UR: ${signalAfter.signal.content_ur.substring(0, 50)}...`);

  const titleMatch = signalAfter.signal.title_ur === newUrduTitle;
  const contentMatch = signalAfter.signal.content_ur === newUrduContent;

  if (titleMatch && contentMatch) {
    console.log('\n   ✅ SIGNAL TEST PASSED: Translation updated and verified!');
  } else {
    console.log('\n   ❌ SIGNAL TEST FAILED: Translation mismatch!');
    console.log(`   Title match: ${titleMatch}`);
    console.log(`   Content match: ${contentMatch}`);
    return;
  }

  // ========================================
  // TEST 2: Drill Translation Flow
  // ========================================
  console.log('\n\n📚 TEST 2: Drill Translation Flow');
  console.log('-'.repeat(60));

  // Step 1: Fetch drill ID 1
  console.log('\n1️⃣ Fetching Drill ID 1...');
  const drillBefore = await fetch(`${base}/api/drills/1`).then(r => r.json());
  console.log('   Before:');
  console.log(`   ├─ Title EN: ${drillBefore.drill.title}`);
  console.log(`   ├─ Title UR: ${drillBefore.drill.title_ur || '(empty)'}`);
  console.log(`   ├─ Description EN: ${drillBefore.drill.description?.substring(0, 50)}...`);
  console.log(`   └─ Description UR: ${drillBefore.drill.description_ur ? drillBefore.drill.description_ur.substring(0, 50) + '...' : '(empty)'}`);

  // Step 2: Update with new Urdu translation
  console.log('\n2️⃣ Updating Urdu translation...');
  const drillTimestamp = new Date().toISOString();
  const newDrillUrduTitle = `[TESTED ${drillTimestamp}] ڈرل کا اردو عنوان`;
  const newDrillUrduDesc = `[TESTED ${drillTimestamp}] یہ ایک ڈرل کی تفصیل ہے`;

  const drillUpdateResponse = await fetch(`${base}/api/drills/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title_ur: newDrillUrduTitle,
      description_ur: newDrillUrduDesc,
    }),
  });

  if (drillUpdateResponse.ok) {
    console.log('   ✅ Update successful!');
  } else {
    console.log(`   ❌ Update failed: ${drillUpdateResponse.status} ${drillUpdateResponse.statusText}`);
    const error = await drillUpdateResponse.text();
    console.log(`   Error: ${error}`);
    return;
  }

  // Step 3: Verify update
  console.log('\n3️⃣ Verifying update...');
  const drillAfter = await fetch(`${base}/api/drills/1`).then(r => r.json());
  console.log('   After:');
  console.log(`   ├─ Title UR: ${drillAfter.drill.title_ur}`);
  console.log(`   └─ Description UR: ${drillAfter.drill.description_ur}`);

  const drillTitleMatch = drillAfter.drill.title_ur === newDrillUrduTitle;
  const drillDescMatch = drillAfter.drill.description_ur === newDrillUrduDesc;

  if (drillTitleMatch && drillDescMatch) {
    console.log('\n   ✅ DRILL TEST PASSED: Translation updated and verified!');
  } else {
    console.log('\n   ❌ DRILL TEST FAILED: Translation mismatch!');
    console.log(`   Title match: ${drillTitleMatch}`);
    console.log(`   Description match: ${drillDescMatch}`);
    return;
  }

  // ========================================
  // FINAL RESULTS
  // ========================================
  console.log('\n\n' + '='.repeat(60));
  console.log('🎉 ALL TESTS PASSED!');
  console.log('='.repeat(60));
  console.log('\n✅ Translation system is working correctly:');
  console.log('   • Signal translations can be updated and saved');
  console.log('   • Drill translations can be updated and saved');
  console.log('   • Changes persist in the database');
  console.log('   • PUT endpoints correctly handle Urdu fields');
  console.log('\n📝 Next steps:');
  console.log('   1. Visit http://localhost:5001/admin/translations');
  console.log('   2. Click "Translate" on any signal');
  console.log('   3. Edit Urdu translations using the ✏️ buttons');
  console.log('   4. Verify changes are saved and displayed\n');
}

main().catch(error => {
  console.error('\n❌ Test failed with error:', error);
  process.exit(1);
});
