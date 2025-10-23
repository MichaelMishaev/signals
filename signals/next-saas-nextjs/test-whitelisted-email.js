/**
 * Manual Test Script - Whitelisted Email Delivery
 * This script tests if 345287@gmail.com actually receives emails via Resend
 */

const testWhitelistedEmail = async () => {
  console.log('\n========================================');
  console.log('📧 TESTING WHITELISTED EMAIL DELIVERY');
  console.log('========================================\n');

  const testEmail = '345287@gmail.com';
  const apiUrl = 'http://localhost:5001/api/auth/drill-access';

  console.log(`Testing email: ${testEmail}`);
  console.log(`API endpoint: ${apiUrl}\n`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        name: 'Test User',
        source: 'manual_test',
        action: 'send-magic-link',
        returnUrl: 'http://localhost:5001'
      })
    });

    const data = await response.json();

    console.log('📩 API Response:');
    console.log('  Status:', response.status);
    console.log('  Success:', data.success);
    console.log('  Message:', data.message);

    if (data.developmentLink) {
      console.log('\n⚠️  DEVELOPMENT MODE DETECTED');
      console.log('  Development Link:', data.developmentLink);
      console.log('\n  This means NO real email was sent!');
      console.log('  The whitelist is NOT working correctly.');
    } else {
      console.log('\n✅ PRODUCTION MODE DETECTED');
      console.log('  No development link in response');
      console.log('\n  This means a real email was sent via Resend!');
      console.log('  Check your inbox at 345287@gmail.com');
    }

    if (data.error) {
      console.log('\n❌ ERROR:', data.error);
      if (data.details) {
        console.log('  Details:', data.details);
      }
    }

  } catch (error) {
    console.log('\n❌ REQUEST FAILED');
    console.error('  Error:', error.message);
  }

  console.log('\n========================================\n');
};

// Run the test
testWhitelistedEmail();
