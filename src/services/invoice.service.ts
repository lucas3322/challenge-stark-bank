import starkbank from '../config/starkbank';
import { getRandomPeople, randomBetween, Person } from '../utils/people';

export interface CreatedInvoice {
  id: string;
  amount: number;
  name: string;
  taxId: string;
}

function buildInvoice(person: Person): object {
  return {
    amount: randomBetween(1000, 50000), // R$ 10,00 – R$ 500,00 in cents
    name: person.name,
    taxId: person.taxId,
    due: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    expiration: 60 * 60 * 24 * 5, // 5 days in seconds
    fine: 2.0,
    interest: 1.0,
    descriptions: [{ key: 'Serviço', value: 'Trial' }],
  };
}

export async function createInvoiceBatch(): Promise<CreatedInvoice[]> {
  const count = randomBetween(8, 12);
  const people = getRandomPeople(count);
  const invoiceData = people.map(buildInvoice);

  console.log(`[InvoiceService] Creating ${count} invoices...`);

  const invoices = await starkbank.invoice.create(invoiceData as any);

  const created: CreatedInvoice[] = invoices.map((inv: any) => ({
    id: inv.id,
    amount: inv.amount,
    name: inv.name,
    taxId: inv.taxId,
  }));

  console.log(`[InvoiceService] Created ${created.length} invoices successfully.`);
  return created;
}
