import express, { Request, Response } from 'express';
import starkbank from '../config/starkbank';
import { transferInvoiceCredit } from '../services/transfer.service';
import { sseBus } from '../api/sse';

const router = express.Router();

// Prevents double-transfer when both 'paid' and 'credited' events fire for the same invoice
const processedInvoices = new Set<string>();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  res.status(200).send('OK');

  try {
    const signature = req.headers['digital-signature'] as string;
    const content = (req.body as Buffer).toString('utf-8');

    const event = await starkbank.event.parse({ content, signature });

    if (event.subscription !== 'invoice') return;

    const invoice = (event as any).log?.invoice;
    const logType: string = (event as any).log?.type ?? '';

    const TRIGGER_TYPES = ['credited', 'paid'];
    if (!TRIGGER_TYPES.includes(logType) || !invoice) return;

    if (processedInvoices.has(invoice.id)) {
      console.log(`[WebhookServer] Invoice ${invoice.id} already processed — skipping duplicate.`);
      return;
    }
    processedInvoices.add(invoice.id);

    console.log(`[WebhookServer] Invoice ${invoice.id} ${logType} — triggering transfer.`);
    sseBus.emit('event', {
      invoiceId: invoice.id,
      name: invoice.name,
      amount: invoice.amount,
      fee: invoice.fee ?? 0,
      type: logType,
      timestamp: new Date().toISOString(),
    });
    await transferInvoiceCredit(invoice.id, invoice.amount, invoice.fee ?? 0);
  } catch (err) {
    console.error('[WebhookServer] Error processing event:', err);
  }
});

export function createWebhookServer(): express.Application {
  const app = express();
  app.use('/webhook', express.raw({ type: 'application/json' }), router);
  return app;
}
