import React, { useState } from 'react';
import { X, Coins, Sparkles, Heart } from 'lucide-react';
import { PaymentProvider } from '../types';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface TipModalProps {
  creatorId: string;
  creatorName: string;
  walletBalanceMT: number;
  onClose: () => void;
  onConfirmTip: (creatorId: string, amountMT: number, provider: PaymentProvider, message: string) => void;
}

export const TipModal: React.FC<TipModalProps> = ({
  creatorId,
  creatorName,
  walletBalanceMT,
  onClose,
  onConfirmTip,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [provider, setProvider] = useState<PaymentProvider>('mpesa');

  const presetAmounts = [50, 100, 250, 500, 1000];
  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount <= 0) return;
    onConfirmTip(creatorId, finalAmount, provider, message);
  };

  return (
    <ResponsiveDialog
      ariaLabel={`Enviar gorjeta a ${creatorName}`}
      onClose={onClose}
      closeOnBackdrop
      panelClassName="relative max-w-md overflow-y-auto rounded-3xl bg-white shadow-2xl border border-pink-100 p-5 sm:p-6 space-y-5"
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-stone-900">
                Enviar Gorjeta a {creatorName}
              </h3>
              <p className="text-[11px] text-stone-400">
                Apoio direto em Meticais (MT) 🇲🇿
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar envio de gorjeta"
            className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Preset Chips */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">
              Escolhe o Valor da Gorjeta
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`rounded-2xl py-2.5 text-xs font-bold transition-all ${
                    !customAmount && selectedAmount === amt
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20 scale-105'
                      : 'border border-pink-100 bg-stone-50 text-stone-700 hover:bg-pink-50 hover:text-pink-700'
                  }`}
                >
                  {amt} MT
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-stone-500">
              Ou digita outro valor personalizado (MT):
            </label>
            <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2 focus-within:border-pink-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500/20">
              <input
                type="number"
                min="10"
                step="10"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                placeholder="Ex: 300"
                className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none"
              />
              <span className="text-xs font-bold text-stone-500 ml-2">MT</span>
            </div>
          </div>

          {/* Optional Message */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">
              Mensagem de Apoio (Opcional)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Adorei o teu último conteúdo, continua com o excelente trabalho! 🔥"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-1 gap-2 text-xs font-semibold min-[390px]:grid-cols-3">
              <button
                type="button"
                onClick={() => setProvider('mpesa')}
                className={`p-2 rounded-xl border text-center ${
                  provider === 'mpesa'
                    ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                M-Pesa 🇲🇿
              </button>
              <button
                type="button"
                onClick={() => setProvider('emola')}
                className={`p-2 rounded-xl border text-center ${
                  provider === 'emola'
                    ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                e-Mola 🇲🇿
              </button>
              <button
                type="button"
                onClick={() => setProvider('bank_transfer')}
                className={`p-2 rounded-xl border text-center ${
                  provider === 'bank_transfer'
                    ? 'border-pink-600 bg-pink-50 text-pink-700 font-bold'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                Carteira ({walletBalanceMT} MT)
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={finalAmount <= 0}
            className="w-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-3 text-xs font-bold text-white shadow-lg shadow-pink-500/30 hover:from-pink-700 hover:to-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Heart className="h-4 w-4 fill-white" />
            <span>Enviar Gorjeta de {finalAmount} MT</span>
          </button>

        </form>
    </ResponsiveDialog>
  );
};
