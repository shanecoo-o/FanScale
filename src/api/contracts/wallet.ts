import type { CursorPage, IsoUtcTimestamp, Money, OpaqueId } from './common';

export interface WalletSummary {
  accountId: OpaqueId;
  available: Money;
  pending: Money;
  reserved: Money;
  paid: Money;
  asOf: IsoUtcTimestamp;
}

export interface LedgerTransactionSummary {
  id: OpaqueId;
  type: string;
  direction: 'credit' | 'debit';
  amount: Money;
  status: 'pending' | 'posted' | 'reversed' | 'failed';
  occurredAt: IsoUtcTimestamp;
}

export interface WalletTransaction extends LedgerTransactionSummary {
  description: string;
  externalReference?: string;
}

export type WalletTransactionPage = CursorPage<LedgerTransactionSummary>;
