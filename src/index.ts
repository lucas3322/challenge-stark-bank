import './config/starkbank';
import path from 'path';
import express from 'express';
import { startInvoiceJob } from './jobs/invoice.job';
import { createWebhookServer } from './webhook/server';
import apiRouter from './api/router';

const PORT = Number(process.env.PORT ?? 3000);

const app = createWebhookServer();

app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`[App] Server listening on http://localhost:${PORT}`);
  startInvoiceJob();
});
