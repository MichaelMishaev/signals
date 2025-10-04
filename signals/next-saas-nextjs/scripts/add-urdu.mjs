// Add Urdu translations
async function main() {
  const base = 'http://localhost:5001';
  
  const sigs = await fetch(`${base}/api/signals`).then(r => r.json());
  console.log(`Updating ${sigs.signals.length} signals...`);
  
  for (const s of sigs.signals) {
    await fetch(`${base}/api/signals/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_ur: `[اردو] ${s.title}`,
        content_ur: `[اردو] ${s.content}`,
        author_ur: `[اردو] ${s.author}`,
      }),
    });
    console.log(`✅ ${s.pair}`);
  }
  
  const drills = await fetch(`${base}/api/drills`).then(r => r.json());
  console.log(`\nUpdating ${drills.drills.length} drills...`);
  
  for (const d of drills.drills) {
    await fetch(`${base}/api/drills/${d.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_ur: `[اردو] ${d.title}`,
        description_ur: `[اردو] ${d.description}`,
        content_ur: `[اردو] ${d.content}`,
      }),
    });
    console.log(`✅ ${d.title}`);
  }
  
  console.log('\n🎉 Done!');
}

main();
