import { EventEmitter } from 'events';
import { Response } from 'express';

export interface WebhookEvent {
  invoiceId: string;
  name: string;
  amount: number;
  fee: number;
  type: string;
  timestamp: string;
}

class SseBus extends EventEmitter {}
export const sseBus = new SseBus();

export function registerSseClient(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (data: WebhookEvent) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  sseBus.on('event', send);

  res.on('close', () => {
    sseBus.off('event', send);
  });
}
