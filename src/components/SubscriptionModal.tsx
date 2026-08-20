import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, Lock, CreditCard, Wallet, Smartphone } from 'lucide-react';
import { CreatorProfile, PaymentProvider } from '../types';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface SubscriptionModalProps {
  creator: CreatorProfile;
  walletBalanceMT: number;
  onClose: () => void;
  onConfirmSubscription: (creatorId: string, plan: 'monthly' | 'quarterly', provider: PaymentProvider, phoneOrCard: string, amountMT: number) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  creator,
  walletBalanceMT,
  onClose,
  onConfirmSubscription,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly'>('monthly');
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('841234567');
  const [cardNumber, setCardNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const priceMT = selectedPlan === 'monthly' ? creator.subscriptionPriceMonthly : creator.subscriptionPriceQuarterly;
  const canUseWallet = walletBalanceMT >= priceMT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const paymentDetail = selectedProvider === 'card' ? cardNumber : selectedProvider === 'wallet' ? 'Carteira FanScale' : phoneNumber;

    setTimeout(() => {
      setIsProcessing(false);
      onConfirmSubscription(creator.id, selectedPlan, selectedProvider, paymentDetail, priceMT);
    }, 400);
  };

  return (
    <ResponsiveDialog
      ariaLabel={`Subscrever ${creator.name}`}
      onClose={onClose}
      closeOnBackdrop
      panelClassName="relative max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl border border-pink-100"
    >
        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 p-6 text-white">
          <button
            onClick={onClose}
            aria-label="Fechar subscrição"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors sm:right-4 sm:top-4"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-lg font-bold text-white">
                  Subscrever {creator.name}
                </h3>
                {creator.verified && (
                  <CheckCircle className="h-4 w-4 fill-white text-pink-600" />
                )}
              </div>
              <p className="text-xs text-white/90 font-medium">
                @{creator.username} · Moçambique 🇲🇿
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-stone-800">
          
          {/* VIP Benefits Checklist */}
          <div className="rounded-2xl bg-pink-50/70 border border-pink-100 p-4 space-y-2">
            <span className="text-xs font-bold text-pink-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-pink-600" />
              Benefícios incluídos nesta subscrição:
            </span>
            <ul className="text-xs text-stone-700 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-white text-[10px] font-bold">✓</span>
                <span>Acesso total a todas as publicações e fotos exclusivas</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-white text-[10px] font-bold">✓</span>
                <span>Vídeos privados e transmissões ao vivo</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-white text-[10px] font-bold">✓</span>
                <span>Mensagens diretas e respostas no chat</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-white text-[10px] font-bold">✓</span>
                <span>Apoio direto a criadores moçambicanos</span>
              </li>
            </ul>
          </div>

          {/* Plan Choice (Monthly vs Quarterly) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Escolhe o Plano
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Monthly */}
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`rounded-2xl border p-3.5 transition-all text-left ${
                  selectedPlan === 'monthly'
                    ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20'
                    : 'border-stone-200 hover:border-pink-200'
                }`}
              >
                <span className="block text-xs font-bold text-stone-900">
                  1 Mês (Renovável)
                </span>
                <div className="font-display text-lg font-black text-pink-600 mt-1">
                  {creator.subscriptionPriceMonthly} <span className="text-xs">MT/mês</span>
                </div>
                <span className="text-[10px] text-stone-400">Cancela a qualquer momento</span>
              </button>

              {/* Quarterly */}
              <button
                type="button"
                onClick={() => setSelectedPlan('quarterly')}
                className={`relative rounded-2xl border p-3.5 transition-all text-left ${
                  selectedPlan === 'quarterly'
                    ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20'
                    : 'border-stone-200 hover:border-pink-200'
                }`}
              >
                <span className="absolute -top-2.5 right-2 rounded-full bg-pink-600 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow-sm">
                  Poupa 15%
                </span>
                <span className="block text-xs font-bold text-stone-900">
                  3 Meses (Trimestre)
                </span>
                <div className="font-display text-lg font-black text-pink-600 mt-1">
                  {creator.subscriptionPriceQuarterly} <span className="text-xs">MT</span>
                </div>
                <span className="text-[10px] text-stone-400">Apenas {Math.round(creator.subscriptionPriceQuarterly / 3)} MT/mês</span>
              </button>

            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700">
                Método de Pagamento em Moçambique
              </label>
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                100% Seguro
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              {/* M-Pesa */}
              <button
                type="button"
                onClick={() => setSelectedProvider('mpesa')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                  selectedProvider === 'mpesa'
                    ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20 font-bold'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white font-black text-[10px]">
                  M
                </span>
                <span className="text-xs font-bold text-stone-900 mt-1">M-Pesa</span>
                <span className="text-[9px] text-stone-400">Vodacom 84/85</span>
              </button>

              {/* e-Mola */}
              <button
                type="button"
                onClick={() => setSelectedProvider('emola')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                  selectedProvider === 'emola'
                    ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20 font-bold'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white font-black text-[10px]">
                  eM
                </span>
                <span className="text-xs font-bold text-stone-900 mt-1">e-Mola</span>
                <span className="text-[9px] text-stone-400">Movitel 86/87</span>
              </button>

              {/* mKesh */}
              <button
                type="button"
                onClick={() => setSelectedProvider('mkesh')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                  selectedProvider === 'mkesh'
                    ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20 font-bold'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white font-black text-[10px]">
                  mK
                </span>
                <span className="text-xs font-bold text-stone-900 mt-1">mKesh</span>
                <span className="text-[9px] text-stone-400">Tmcel 82/83</span>
              </button>

              {/* Carteira FanScale */}
              <button
                type="button"
                onClick={() => setSelectedProvider('bank_transfer')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all ${
                  selectedProvider === 'bank_transfer'
                    ? 'border-pink-600 bg-pink-50/60 ring-2 ring-pink-500/20 font-bold'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Wallet className="h-6 w-6 text-pink-600" />
                <span className="text-xs font-bold text-stone-900 mt-1">Carteira</span>
                <span className="text-[9px] text-pink-700 font-semibold">{walletBalanceMT} MT</span>
              </button>

            </div>
          </div>

          {/* Provider Specific Input (Phone / Card / Wallet Notice) */}
          {selectedProvider !== 'bank_transfer' && selectedProvider !== 'card' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-700">
                Número de Telemóvel ({selectedProvider === 'mpesa' ? 'Vodacom' : selectedProvider === 'emola' ? 'Movitel' : 'Tmcel'})
              </label>
              <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 focus-within:border-pink-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500/20">
                <span className="text-xs font-bold text-stone-500 mr-2">+258</span>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="84 123 4567"
                  className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-stone-400">
                Irás receber uma notificação USSD no telemóvel para autorizar com o teu PIN {selectedProvider.toUpperCase()}.
              </p>
            </div>
          ) : selectedProvider === 'bank_transfer' ? (
            <div className="rounded-2xl border border-pink-200 bg-pink-50/50 p-3 text-xs text-stone-700">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">Saldo Atual:</span>
                <span className="font-bold text-stone-900">{walletBalanceMT} MT</span>
              </div>
              <div className="flex items-center justify-between font-bold text-pink-700">
                <span>Total a debitar:</span>
                <span>{priceMT} MT</span>
              </div>
              {!canUseWallet && (
                <p className="mt-2 text-[11px] text-red-600 font-medium">
                  Saldo insuficiente na carteira. Por favor escolhe M-Pesa ou recarrega a tua carteira primeiro.
                </p>
              )}
            </div>
          ) : null}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || (selectedProvider === 'bank_transfer' && !canUseWallet)}
            className="w-full rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-3 text-xs font-extrabold text-white shadow-lg shadow-pink-500/30 hover:from-pink-700 hover:to-rose-600 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isProcessing ? 'A comunicar com o telemóvel...' : `Subscrever Agora — ${priceMT} MT`}
          </button>

          <p className="text-center text-[10px] text-stone-400">
            Ao subscreveres concordas com os Termos de Serviço FanScale Moçambique.
          </p>

        </form>

    </ResponsiveDialog>
  );
};
