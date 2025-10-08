// Paste this in browser console to debug gate state
console.log('=== GATE STATE DEBUG ===');
console.log('pending_email_verification:', localStorage.getItem('pending_email_verification'));

const gateKeys = Object.keys(localStorage).filter(k => k.startsWith('gate_flow_state'));
console.log('Gate flow state keys:', gateKeys);

gateKeys.forEach(key => {
  const data = JSON.parse(localStorage.getItem(key));
  console.log(`${key}:`, {
    hasEmail: data.hasEmail,
    hasBrokerAccount: data.hasBrokerAccount,
    drillsViewed: data.drillsViewed,
    userEmail: data.userEmail
  });
});
