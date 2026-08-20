import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, ShieldCheck, X, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentProvider } from '../types';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface PaymentPromptModalProps {
  provider: PaymentProvider;
  amountMT: number;
  phone: string;
  itemDescription: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentPromptModal: React.FC<PaymentPromptModalProps> = ({
  provider,
  amountMT,
  phone,
  itemDescription,
  onSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<'prompt' | 'processing' | 'success'>('prompt');
  const [pin, setPin] = useState('');
  const [countdown, setCountdown] = useState(30);

  const providerName = 
    provider === 'mpesa' ? 'Vodacom M-Pesa' :
    provider === 'emola' ? 'Movitel e-Mola' :
    provider === 'mkesh' ? 'Tmcel mKesh' : 'Pagamento FanScale';

  const providerColor = 
    provider === 'mpesa' ? 'bg-red-600' :
    provider === 'emola' ? 'bg-amber-500' :
    provider === 'mkesh' ? 'bg-blue-600' : 'bg-pink-600';

  useEffect(() => {
    if (step === 'prompt') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleAuthorize = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#F43F5E', '#10B981', '#F59E0B']
      });
      setTimeout(() => {
        onSuccess();
      }, 1800);
    }, 1500);
  };

  return (
    <ResponsiveDialog
      ariaLabel={`Confirmar pagamento com ${providerName}`}
      onClose={onCancel}
      role="alertdialog"
      panelClassName="relative max-w-sm overflow-y-auto rounded-3xl bg-stone-900 text-white shadow-2xl border border-stone-800 p-5 sm:p-6 space-y-5"
    >
        {/* Top Provider Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${providerColor} text-white font-bold text-xs`}>
              {provider === 'mpesa' ? 'M' : provider === 'emola' ? 'eM' : 'mK'}
            </span>
            <span className="font-display text-xs font-bold text-white">
              {providerName}
            </span>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cancelar pagamento"
            className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step: Prompt Dialog (USSD Simulation) */}
        {step === 'prompt' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-stone-800/90 border border-stone-700 p-4 text-stone-100 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-pink-400 font-bold font-sans">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5 animate-pulse" />
                  Notificação USSD enviada para +258 {phone}
                </span>
                <span>{countdown}s</span>
              </div>
              <p className="text-stone-200">
                Pagar <strong className="text-white font-bold">{amountMT} MT</strong> a <strong className="text-pink-400">FanScale Moçambique</strong> para &quot;{itemDescription}&quot;?
              </p>
              <p className="text-[11px] text-stone-400 font-sans">
                Introduza o seu PIN {provider.toUpperCase()} de 4 dígitos para confirmar.
              </p>
            </div>

            {/* PIN keypad simulation */}
            <div className="space-y-2" aria-label="PIN de pagamento">
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-800 border border-stone-700 text-base font-bold text-pink-400"
                  >
                    {pin[i] ? '•' : ''}
                  </div>
                ))}
              </div>

              {/* Quick keypad */}
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Limpar', '0', 'OK'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === 'Limpar') setPin('');
                      else if (key === 'OK') {
                        if (pin.length > 0) handleAuthorize();
                      } else if (pin.length < 4) {
                        setPin((prev) => prev + key);
                      }
                    }}
                    className="rounded-xl bg-stone-800/60 py-2 text-xs font-bold text-stone-200 hover:bg-stone-700 active:scale-95 transition-all"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAuthorize}
              className="w-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-3 text-xs font-bold text-white shadow-lg shadow-pink-500/30 hover:from-pink-700 hover:to-rose-600 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Confirmar Pagamento de {amountMT} MT</span>
            </button>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-10 w-10 text-pink-500 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="font-display text-sm font-bold text-white">
                A processar pagamento com {providerName}...
              </h4>
              <p className="text-xs text-stone-400">
                Aguarde a confirmação da rede móvel de Moçambique.
              </p>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h4 className="font-display text-base font-bold text-white">
              Pagamento Confirmado com Sucesso! 🇲🇿
            </h4>
            <p className="text-xs text-stone-300">
              Foram debitados {amountMT} MT via {providerName}. O teu conteúdo exclusivo está agora desbloqueado!
            </p>
          </div>
        )}

    </ResponsiveDialog>
  );
};
