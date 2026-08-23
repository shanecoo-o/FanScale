import React, { useEffect, useState } from 'react';
import { PageContainer } from './ui/PageContainer';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  DollarSign, 
  Lock,
  Eye,
  FileText,
  LogOut
} from 'lucide-react';
import { AdminReport, KycRequest } from '../types';

interface AdminDashboardProps {
  reports: AdminReport[];
  kycRequests: KycRequest[];
  onResolveReport: (reportId: string, action: 'keep' | 'remove') => void;
  onResolveKyc: (kycId: string, action: 'approve' | 'reject') => void;
  onLogout?: () => void;
  initialTab?: 'metrics' | 'reports' | 'kyc';
  onTabChange?: (tab: 'metrics' | 'reports' | 'kyc') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  reports = [],
  kycRequests = [],
  onResolveReport,
  onResolveKyc,
  onLogout,
  initialTab = 'metrics',
  onTabChange,
}) => {
  const [adminTab, setAdminTab] = useState<'metrics' | 'reports' | 'kyc'>(initialTab);

  useEffect(() => {
    setAdminTab(initialTab);
  }, [initialTab]);

  const selectAdminTab = (tab: 'metrics' | 'reports' | 'kyc') => {
    setAdminTab(tab);
    onTabChange?.(tab);
  };

  const safeReports = reports || [];
  const safeKyc = kycRequests || [];

  const stats = {
    totalUsers: 142850,
    totalCreators: 3240,
    activeSubscriptions: 48920,
    gmvMT: 18450000,
    platformRevenueMT: 3690000, // 20% platform commission (80% to creators)
    creatorsPaidOutMT: 14760000, // 80%
    pendingReportsCount: safeReports.filter(r => r.status === 'pending').length,
    pendingKycCount: safeKyc.filter(k => k.status === 'pending').length
  };

  return (
    <PageContainer width="wide" className="space-y-6 py-4 sm:space-y-8 sm:py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-stone-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-pink-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              FanScale Moçambique
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Painel de Administração & Moderação
          </h1>
          <p className="text-xs text-stone-400">
            Controlo de métricas financeiras, conformidade legal de Moçambique e verificação de criadores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            ● Plataforma Operacional
          </span>

          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-full border border-stone-700 bg-stone-800/90 px-4 py-1.5 text-xs font-bold text-stone-300 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800 transition-all flex items-center gap-1.5"
              title="Terminar sessão de administrador"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair da Conta</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin KPI Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* GMV */}
        <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Volume Total Transacionado (GMV)</span>
          <div className="font-display text-2xl font-black text-stone-900">
            {(stats.gmvMT / 1000000).toFixed(2)}M <span className="text-pink-600 text-sm">MT</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Processado via M-Pesa & e-Mola</span>
        </div>

        {/* Platform Revenue */}
        <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Receita FanScale (15%)</span>
          <div className="font-display text-2xl font-black text-pink-600">
            {(stats.platformRevenueMT / 1000000).toFixed(2)}M <span className="text-stone-900 text-sm">MT</span>
          </div>
          <span className="text-[10px] text-stone-400">Comissão de plataforma</span>
        </div>

        {/* Subscriptions */}
        <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Subscrições VIP Ativas</span>
          <div className="font-display text-2xl font-black text-stone-900">
            {stats.activeSubscriptions.toLocaleString('pt-MZ')}
          </div>
          <span className="text-[10px] text-stone-400">Em 3.240 criadores</span>
        </div>

        {/* Pending Moderation */}
        <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-1">
          <span className="text-xs text-stone-500 font-medium">Itens Pendentes de Revisão</span>
          <div className="font-display text-2xl font-black text-amber-600">
            {stats.pendingReportsCount + stats.pendingKycCount}
          </div>
          <span className="text-[10px] text-amber-700 font-bold">
            {stats.pendingKycCount} KYC + {stats.pendingReportsCount} Denúncias
          </span>
        </div>

      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-pink-100 pb-2" aria-label="Secções administrativas">
        <button
          onClick={() => selectAdminTab('metrics')}
          aria-current={adminTab === 'metrics' ? 'page' : undefined}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            adminTab === 'metrics'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-pink-50'
          }`}
        >
          Visão Geral & Métricas
        </button>

        <button
          onClick={() => selectAdminTab('kyc')}
          aria-current={adminTab === 'kyc' ? 'page' : undefined}
          className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            adminTab === 'kyc'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-pink-50'
          }`}
        >
          <span>Verificação de Criadores (KYC)</span>
          {stats.pendingKycCount > 0 && (
            <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.2 text-[9px] text-white">
              {stats.pendingKycCount}
            </span>
          )}
        </button>

        <button
          onClick={() => selectAdminTab('reports')}
          aria-current={adminTab === 'reports' ? 'page' : undefined}
          className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            adminTab === 'reports'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-pink-50'
          }`}
        >
          <span>Moderação de Denúncias</span>
          {stats.pendingReportsCount > 0 && (
            <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.2 text-[9px] text-white">
              {stats.pendingReportsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab: KYC Verifications */}
      {adminTab === 'kyc' && (
        <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm space-y-4 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-display text-base font-bold text-stone-900">
              Solicitações de Verificação de Identidade (Moçambique 🇲🇿)
            </h3>
            <span className="text-xs text-stone-400">
              Conformidade com idade mínima e identidade real
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {kycRequests.map((req) => (
              <div key={req.id} className="flex flex-col justify-between gap-4 py-4 lg:flex-row lg:items-center">
                <div className="flex min-w-0 items-start gap-3">
                  <img
                    src={req.creatorAvatar}
                    alt={req.creatorName}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-pink-500/20"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-stone-900">
                        {req.creatorName}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        @{req.creatorHandle}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {req.status === 'approved' ? 'Aprovado ✓' : 'Pendente de Revisão'}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-col gap-1 break-words text-[11px] text-stone-500 min-[430px]:flex-row min-[430px]:flex-wrap min-[430px]:gap-x-3">
                      <span>Doc: <strong>{req.idDocumentType}</strong> ({req.documentNumber})</span>
                      <span>NUÍT: <strong>{req.nuitNumber}</strong></span>
                      <span>Telemóvel: <strong>{req.phone}</strong></span>
                    </div>
                  </div>
                </div>

                {req.status === 'pending' ? (
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                    <button
                      onClick={() => onResolveKyc(req.id, 'approve')}
                      className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      Aprovar Criador
                    </button>
                    <button
                      onClick={() => onResolveKyc(req.id, 'reject')}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100"
                    >
                      Recusar
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-emerald-600">
                    Verificado ✓
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Content Reports */}
      {adminTab === 'reports' && (
        <div className="rounded-3xl border border-pink-100 bg-white p-4 shadow-sm space-y-4 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-display text-base font-bold text-stone-900">
              Fila de Moderação e Denúncias de Conteúdo
            </h3>
            <span className="text-xs text-stone-400">
              Proteção de menores e prevenção de fraude
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {reports.map((rep) => (
              <div key={rep.id} className="flex flex-col justify-between gap-4 py-4 lg:flex-row lg:items-center">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                      Motivo: {rep.reason.toUpperCase()}
                    </span>
                    <span className="font-bold text-xs text-stone-900">
                      {rep.reportedCreator}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Denunciado por {rep.reporterName} · {rep.date}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700">
                    &quot;{rep.postCaption}&quot;
                  </p>
                </div>

                {rep.status === 'pending' ? (
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                    <button
                      onClick={() => onResolveReport(rep.id, 'keep')}
                      className="rounded-full bg-stone-100 px-4 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-200"
                    >
                      Manter Post
                    </button>
                    <button
                      onClick={() => onResolveReport(rep.id, 'remove')}
                      className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Remover Conteúdo
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-stone-400">
                    Revisado ({rep.status})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Metrics overview */}
      {adminTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900">
              Distribuição Geográfica de Utilizadores 🇲🇿
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span>Maputo Cidade & Província</span>
                <span className="text-pink-600">54% (77.100)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Sofala (Beira)</span>
                <span className="text-pink-600">18% (25.700)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Nampula</span>
                <span className="text-pink-600">15% (21.400)</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Inhambane & Outras</span>
                <span className="text-pink-600">13% (18.650)</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-display text-base font-bold text-stone-900">
              Canais de Pagamento Móvel
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-bold">
                <span>Vodacom M-Pesa</span>
                <span className="text-red-600">68%</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Movitel e-Mola</span>
                <span className="text-amber-600">22%</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Tmcel mKesh & Cartões</span>
                <span className="text-blue-600">10%</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
};
