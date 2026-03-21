export interface PaymentMethod {
  id: string;
  label: string;
  type: 'pix' | 'card' | 'bank';
  last4?: string;
}

export interface DepositIntent {
  id: string;
  amount: number;
  methodId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm-pix', label: 'PIX', type: 'pix' },
  { id: 'pm-card', label: 'Cartão •••• 4242', type: 'card', last4: '4242' },
];

export const depositPresets = [20, 50, 100, 200, 500] as const;

export const withdrawPresets = [50, 100, 200, 500] as const;

export const walletLimits = {
  minDeposit: 10,
  maxDeposit: 50000,
  minWithdraw: 20,
  maxWithdraw: 10000,
  dailyWithdrawRemaining: 7500,
};
