import React from 'react';
import { LogOut, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AuthUser } from '../types';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  user,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <ResponsiveDialog
      ariaLabel="Confirmar saída da conta"
      onClose={onClose}
      closeOnBackdrop
      role="alertdialog"
      panelClassName="relative max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-100"
    >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar confirmação de saída"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
          title="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
            <LogOut className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-display text-xl font-extrabold text-stone-900">
              Sair da Conta?
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Tens a certeza de que desejas terminar sessão no <span className="font-bold text-pink-600">FanScale</span>?
            </p>
          </div>

          {/* User Preview Box */}
          {user && (
            <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-3.5 border border-stone-200/80 text-left">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-pink-500/30"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                <p className="text-[11px] text-stone-500 truncate">@{user.username}</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Saldo Seguro: {(user.walletBalanceMT || 0).toLocaleString('pt-MZ')} MT (M-Pesa)
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-left border border-amber-200">
            <ShieldCheck className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-[11px] text-amber-900 leading-tight">
              Os teus conteúdos, subscrições ativas e saldo na carteira permanecerão seguros e disponíveis no teu próximo login.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="cancel-logout-btn"
              type="button"
              onClick={onClose}
              className="min-h-11 flex-1 rounded-full border border-stone-200 bg-white py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="confirm-logout-btn"
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/30 transition-colors hover:bg-rose-700"
            >
              <LogOut className="h-4 w-4" />
              <span>Sim, Sair da Conta</span>
            </button>
          </div>
        </div>
    </ResponsiveDialog>
  );
};
