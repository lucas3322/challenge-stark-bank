import { Router, Request, Response } from 'express';
import starkbank from '../config/starkbank';
import { createInvoiceBatch } from '../services/invoice.service';
import { registerSseClient } from './sse';

const router = Router();

router.get('/balance', async (_req: Request, res: Response) => {
  const balance = await starkbank.balance.get();
  res.json({ amount: balance.amount });
});

router.get('/invoices', async (_req: Request, res: Response) => {
  const invoices = await starkbank.invoice.query({ limit: 20 });
  const result: any[] = [];
  for await (const inv of invoices) {
    result.push({
      id: inv.id,
      name: (inv as any).name,
      taxId: (inv as any).taxId,
      amount: inv.amount,
      status: (inv as any).status,
      due: (inv as any).due,
    });
    if (result.length >= 20) break;
  }
  res.json(result);
});

router.post('/invoices/batch', async (_req: Request, res: Response) => {
  const invoices = await createInvoiceBatch();
  res.json({ created: invoices.length, invoices });
});

router.get('/events', (req: Request, res: Response) => {
  registerSseClient(res);
});

export default router;
