import starkbank from '../config/starkbank';

const STARK_BANK_ACCOUNT = {
  bankCode: '20018183',
  branchCode: '0001',
  accountNumber: '6341320293482496',
  name: 'Stark Bank S.A.',
  taxId: '20.018.183/0001-80',
  accountType: 'payment',
} as const;

export async function transferInvoiceCredit(
  invoiceId: string,
  amount: number,
  fee: number,
): Promise<void> {
  const netAmount = amount - fee;

  if (netAmount <= 0) {
    console.warn(`[TransferService] Net amount is zero or negative for invoice ${invoiceId}. Skipping.`);
    return;
  }

  console.log(
    `[TransferService] Invoice ${invoiceId} paid. Amount: ${amount}, Fee: ${fee}, Net: ${netAmount}`,
  );

  const transfers = await starkbank.transfer.create([
    {
      amount: netAmount,
      bankCode: STARK_BANK_ACCOUNT.bankCode,
      branchCode: STARK_BANK_ACCOUNT.branchCode,
      accountNumber: STARK_BANK_ACCOUNT.accountNumber,
      name: STARK_BANK_ACCOUNT.name,
      taxId: STARK_BANK_ACCOUNT.taxId,
      accountType: STARK_BANK_ACCOUNT.accountType,
      tags: [`invoice:${invoiceId}`],
    } as any,
  ]);

  console.log(`[TransferService] Transfer created: ${transfers[0].id}`);
}
