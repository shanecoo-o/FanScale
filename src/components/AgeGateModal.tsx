import React from 'react';
import { ShieldAlert, CheckCircle2, Lock, Flame } from 'lucide-react';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface AgeGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({
  isOpen,
  onConfirm,
  onReject,
}) => {
  if (!isOpen) return null;

  return (
    <ResponsiveDialog
      ariaLabel="Confirmação de maioridade"
      dismissible={false}
      role="alertdialog"
      overlayClassName="critical-dialog bg-black/90"
      panelClassName="max-w-md rounded-2xl bg-stone-900 border border-pink-500/30 p-4 min-[390px]:p-5 sm:rounded-3xl sm:p-8 text-white shadow-2xl text-center space-y-4 sm:space-y-6"
    >
        {/* 18+ Badge Icon */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/40">
          <span className="font-display text-2xl font-black tracking-tight">18+</span>
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 border-2 border-pink-500 text-pink-400">
            <Lock className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Title & Brand */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 px-3 py-1 text-xs font-bold text-pink-400">
            <Flame className="h-3.5 w-3.5 text-pink-500" />
            <span>FanScale Africa • Conteúdo Adulto Exclusivo</span>
          </div>
          <h2 className="font-display text-2xl font-black text-white tracking-tight">
            Confirmação de Maioridade
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            O <strong className="text-pink-400">FanScale</strong> é uma plataforma destinada exclusivamente a pessoas com <strong className="text-white">idade igual ou superior a 18 anos</strong>.
          </p>
        </div>

        {/* Security & Compliance Highlights */}
        <div className="space-y-2.5 rounded-2xl bg-stone-800/80 p-4 text-left border border-stone-700/60 text-xs text-stone-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
            <span>Apenas criadores maiores de idade com identidade (B.I./Passaporte) verificada por KYC.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
            <span>Tolerância zero para menores e conteúdos não consentidos.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
            <span>Pagamentos locais em Meticais via Vodacom M-Pesa e Movitel e-Mola protegidos.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            id="age-gate-accept-btn"
            onClick={onConfirm}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-pink-500/30 hover:from-pink-700 hover:to-rose-600 transition-all hover:scale-[1.02]"
          >
            <span>Tenho 18 Anos ou Mais (Entrar)</span>
          </button>

          <button
            id="age-gate-reject-btn"
            onClick={onReject}
            className="w-full rounded-2xl bg-stone-800 border border-stone-700 py-3 text-xs font-semibold text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
          >
            Sou menor de 18 anos (Sair)
          </button>
        </div>

        <p className="text-[10px] text-stone-500">
          Ao prosseguir, declaras sob tua responsabilidade que tens 18+ anos e concordas com as Políticas de Conteúdo e Moderação da FanScale.
        </p>
    </ResponsiveDialog>
  );
};
