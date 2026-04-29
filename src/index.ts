import './config/starkbank';
import { startInvoiceJob } from './jobs/invoice.job';
import { createWebhookServer } from './webhook/server';

const PORT = Number(process.env.PORT ?? 3000);

const app = createWebhookServer();

app.listen(PORT, () => {
  console.log(`[App] Webhook server listening on port ${PORT}`);
  startInvoiceJob();
});
