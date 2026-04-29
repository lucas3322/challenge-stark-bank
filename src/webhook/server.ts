import express, { Request, Response } from 'express';
import starkbank from '../config/starkbank';
import { transferInvoiceCredit } from '../services/transfer.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  res.status(200).send('OK');

  try {
    const signature = req.headers['digital-signature'] as string;
    const content = (req.body as Buffer).toString('utf-8');

    const event = await starkbank.event.parse({ content, signature });

    if (event.subscription !== 'invoice') return;

    const invoice = (event as any).log?.invoice;
    const logType: string = (event as any).log?.type ?? '';

    // 'credited' = production flow; 'paid' = sandbox may only send this
    const TRIGGER_TYPES = ['credited', 'paid'];
    if (!TRIGGER_TYPES.includes(logType) || !invoice) return;

    console.log(`[WebhookServer] Invoice ${invoice.id} ${logType} — triggering transfer.`);
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
