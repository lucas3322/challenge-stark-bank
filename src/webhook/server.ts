import express, { Request, Response } from 'express';
import starkbank from '../config/starkbank';
import { transferInvoiceCredit } from '../services/transfer.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  res.status(200).send('OK');

  try {
    const signature = req.headers['digital-signature'] as string;
    const body = JSON.stringify(req.body);

    const event = await starkbank.event.parse({ content: body, signature });

    if (event.subscription !== 'invoice') return;

    const invoice = (event as any).log?.invoice;
    const logType: string = (event as any).log?.type ?? '';

    if (logType !== 'credited' || !invoice) return;

    await transferInvoiceCredit(invoice.id, invoice.amount, invoice.fee ?? 0);
  } catch (err) {
    console.error('[WebhookServer] Error processing event:', err);
  }
});

export function createWebhookServer(): express.Application {
  const app = express();
  app.use(express.json());
  app.use('/webhook', router);
  return app;
}
