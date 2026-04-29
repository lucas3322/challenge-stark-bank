import '../src/config/starkbank';
import starkbank from '../src/config/starkbank';

async function main() {
  console.log('=== Stark Bank Smoke Test ===\n');

  console.log('1. Checking balance (tests authentication)...');
  const balance = await starkbank.balance.get();
  console.log(`   ✓ Balance: R$ ${(balance.amount / 100).toFixed(2)}\n`);

  console.log('2. Creating 1 test invoice...');
  const invoices = await starkbank.invoice.create([
    {
      amount: 1500, // R$ 15,00
      name: 'Test Person',
      taxId: '012.345.678-90',
      due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    } as any,
  ]);
  const inv = invoices[0];
  console.log(`   ✓ Invoice created!`);
  console.log(`     ID:     ${inv.id}`);
  console.log(`     Amount: R$ ${(inv.amount / 100).toFixed(2)}`);
  console.log(`     Status: ${inv.status}`);
  console.log(`     Link:   ${inv.link}\n`);

  console.log('=== All checks passed! App is ready to run. ===');
}

main().catch((err) => {
  console.error('\n✗ Smoke test failed:', err.message ?? err);
  process.exit(1);
});
