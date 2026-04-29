import { transferInvoiceCredit } from '../services/transfer.service';

jest.mock('../config/starkbank', () => ({
  __esModule: true,
  default: {
    transfer: {
      create: jest.fn().mockResolvedValue([{ id: 'mock-transfer-id' }]),
    },
  },
}));

import starkbankMock from '../config/starkbank';
const mockCreate = starkbankMock.transfer.create as jest.Mock;

describe('transferInvoiceCredit', () => {
  beforeEach(() => mockCreate.mockClear());

  it('creates a transfer with the correct net amount', async () => {
    await transferInvoiceCredit('inv-001', 10000, 100);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ amount: 9900 }),
      ]),
    );
  });

  it('skips transfer when net amount is zero or negative', async () => {
    await transferInvoiceCredit('inv-002', 100, 100);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('tags the transfer with the invoice id', async () => {
    await transferInvoiceCredit('inv-003', 5000, 50);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ tags: ['invoice:inv-003'] }),
      ]),
    );
  });
});
