import { test, expect } from '@playwright/test';

test.describe('API Comparison - Local vs Production', () => {
  test('Compare API responses', async ({ request }) => {
    console.log('\n========================================');
    console.log('LOCAL API RESPONSE');
    console.log('========================================');

    // Local API
    try {
      const localResponse = await request.get('http://localhost:3000/api/signals?limit=3&status=ACTIVE&locale=en', {
        timeout: 10000
      });
      const localData = await localResponse.json();

      console.log('Status:', localResponse.status());
      console.log('Total signals:', localData.total);
      console.log('Signals returned:', localData.signals?.length);

      if (localData.signals?.[0]) {
        console.log('\nFirst Signal:');
        console.log('  Title:', localData.signals[0].title);
        console.log('  Pair:', localData.signals[0].pair);
        console.log('  Action:', localData.signals[0].action);
        console.log('  Entry:', localData.signals[0].entry);
        console.log('  Author:', localData.signals[0].author);
        console.log('  ID:', localData.signals[0].id);
      }

      console.log('\n========================================');
      console.log('PRODUCTION API RESPONSE');
      console.log('========================================');

      // Prod API
      const prodResponse = await request.get('https://www.pipguru.club/api/signals?limit=3&status=ACTIVE&locale=en', {
        timeout: 10000
      });
      const prodData = await prodResponse.json();

      console.log('Status:', prodResponse.status());
      console.log('Total signals:', prodData.total);
      console.log('Signals returned:', prodData.signals?.length);

      if (prodData.signals?.[0]) {
        console.log('\nFirst Signal:');
        console.log('  Title:', prodData.signals[0].title);
        console.log('  Pair:', prodData.signals[0].pair);
        console.log('  Action:', prodData.signals[0].action);
        console.log('  Entry:', prodData.signals[0].entry);
        console.log('  Author:', prodData.signals[0].author);
        console.log('  ID:', prodData.signals[0].id);
      }

      console.log('\n========================================');
      console.log('COMPARISON');
      console.log('========================================');

      console.log('Same signal count:', localData.signals?.length === prodData.signals?.length);
      console.log('Same first signal ID:', localData.signals?.[0]?.id === prodData.signals?.[0]?.id);
      console.log('Same first signal title:', localData.signals?.[0]?.title === prodData.signals?.[0]?.title);
      console.log('Same first signal pair:', localData.signals?.[0]?.pair === prodData.signals?.[0]?.pair);

      console.log('\n========================================');
      console.log('DATABASE CONNECTION');
      console.log('========================================');

      // Check if using demo mode (demo mode has exactly 7 signals)
      const localUsingDemo = localData.signals?.length === 7 && localData.total === 7;
      const prodUsingDemo = prodData.signals?.length === 7 && prodData.total === 7;

      console.log('Local using demo mode:', localUsingDemo);
      console.log('Prod using demo mode:', prodUsingDemo);
      console.log('Both using same database:',
        localData.signals?.[0]?.id === prodData.signals?.[0]?.id && !localUsingDemo && !prodUsingDemo
      );

    } catch (error) {
      console.error('Error:', error.message);
    }
  });
});
