import cron from 'node-cron';
import { createInvoiceBatch } from '../services/invoice.service';

const CRON_EVERY_3_HOURS = '0 */3 * * *';
const RUNTIME_HOURS = 24;
const TOTAL_RUNS = RUNTIME_HOURS / 3; // 8 runs

let runCount = 0;
let task: cron.ScheduledTask | null = null;

async function runBatch(): Promise<void> {
  runCount++;
  console.log(`[InvoiceJob] Run ${runCount}/${TOTAL_RUNS} started at ${new Date().toISOString()}`);

  try {
    await createInvoiceBatch();
  } catch (err) {
    console.error('[InvoiceJob] Error creating invoices:', err);
  }

  if (runCount >= TOTAL_RUNS) {
    console.log('[InvoiceJob] 24 hours completed. Stopping invoice job.');
    task?.stop();
  }
}

export function startInvoiceJob(): void {
  console.log('[InvoiceJob] Scheduling invoice job — every 3 hours for 24 hours.');

  // Fire once immediately on start
  void runBatch();

  task = cron.schedule(CRON_EVERY_3_HOURS, () => {
    if (runCount < TOTAL_RUNS) {
      void runBatch();
    }
  });
}
