import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Filter, 
  Sparkles,
  Calendar,
  Search,
  X,
  RotateCcw,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Share2,
  Receipt,
  HelpCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { WalletTransaction, PaymentProvider, UserRole } from '../types';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface WalletViewProps {
  userRole: UserRole;
  walletBalanceMT: number;
  transactions: WalletTransaction[];
  onDeposit: (amountMT: number, provider: PaymentProvider, phone: string) => void;
  onRequestPayout: (amountMT: number, method: string, phoneOrIban: string) => void;
}

type DateRangePreset = 'all' | 'today' | 'last7days' | 'this_month' | 'last_month' | 'custom';
type TransactionTypeFilter = 'all' | 'deposit' | 'payout' | 'subscription' | 'tip' | 'ppv_unlock' | 'creator_revenue';
type FlowFilter = 'all' | 'credit' | 'debit';
type SortOrder = 'newest' | 'oldest' | 'highest' | 'lowest';

export const WalletView: React.FC<WalletViewProps> = ({
  userRole,
  walletBalanceMT = 0,
  transactions = [],
  onDeposit,
  onRequestPayout,
}) => {
  const [activeWalletMode, setActiveWalletMode] = useState<'fan' | 'creator'>(userRole === 'creator' ? 'creator' : 'fan');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('1000');
  const [depositProvider, setDepositProvider] = useState<PaymentProvider>('mpesa');
  const [depositPhone, setDepositPhone] = useState('841234567');

  // Advanced Filtering States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<TransactionTypeFilter>('all');
  const [filterFlow, setFilterFlow] = useState<FlowFilter>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [datePreset, setDatePreset] = useState<DateRangePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Selected Transaction for Receipt / Detail Modal
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [exportFeedbackToast, setExportFeedbackToast] = useState<string | null>(null);

  const creatorAvailableBalance = 35400;

  // Base reference date for 2026 platform demo environment: 2026-08-18
  const CURRENT_DEMO_DATE_STR = '2026-08-18';

  // Helper to extract comparable date object or YYYY-MM-DD string from a transaction
  const getTxDateString = (tx: WalletTransaction): string => {
    if (tx.rawDate) return tx.rawDate.substring(0, 10);
    // Parse formats like '18 Ago 2026, 11:20' or '17 Ago 2026'
    const monthMap: Record<string, string> = {
      'Jan': '01', 'Fev': '02', 'Mar': '03', 'Abr': '04', 'Mai': '05', 'Jun': '06',
      'Jul': '07', 'Ago': '08', 'Set': '09', 'Out': '10', 'Nov': '11', 'Dez': '12'
    };
    const parts = tx.date.split(' ');
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const monStr = parts[1];
      const year = parts[2].replace(',', '');
      const mon = monthMap[monStr] || '08';
      return `${year}-${mon}-${day}`;
    }
    return '2026-08-18';
  };

  // Quick Preset Selection Handler
  const handleDatePresetChange = (preset: DateRangePreset) => {
    setDatePreset(preset);
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      setStartDate('2026-08-18');
      setEndDate('2026-08-18');
    } else if (preset === 'last7days') {
      setStartDate('2026-08-12');
      setEndDate('2026-08-18');
    } else if (preset === 'this_month') {
      setStartDate('2026-08-01');
      setEndDate('2026-08-31');
    } else if (preset === 'last_month') {
      setStartDate('2026-07-01');
      setEndDate('2026-07-31');
    }
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterFlow('all');
    setFilterProvider('all');
    setFilterStatus('all');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setSortOrder('newest');
  };

  const isAnyFilterActive = 
    searchQuery.trim() !== '' ||
    filterType !== 'all' ||
    filterFlow !== 'all' ||
    filterProvider !== 'all' ||
    filterStatus !== 'all' ||
    datePreset !== 'all' ||
    startDate !== '' ||
    endDate !== '' ||
    sortOrder !== 'newest';

  // Advanced Filter Logic
  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter((tx) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(query);
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesRef = tx.referenceNumber.toLowerCase().includes(query);
        const matchesAmount = tx.amountMT.toString().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesRef && !matchesAmount) {
          return false;
        }
      }

      // 2. Transaction Type Filter
      if (filterType !== 'all') {
        if (tx.type !== filterType) {
          return false;
        }
      }

      // 3. Flow Filter (Credit vs Debit)
      if (filterFlow === 'credit' && !tx.isCredit) return false;
      if (filterFlow === 'debit' && tx.isCredit) return false;

      // 4. Payment Provider Filter
      if (filterProvider !== 'all') {
        if (tx.provider !== filterProvider) return false;
      }

      // 5. Status Filter
      if (filterStatus !== 'all') {
        if (tx.status !== filterStatus) return false;
      }

      // 6. Date Range Filtering
      const txDateStr = getTxDateString(tx);

      if (datePreset === 'today') {
        if (txDateStr !== '2026-08-18') return false;
      } else if (datePreset === 'last7days') {
        if (txDateStr < '2026-08-12' || txDateStr > '2026-08-18') return false;
      } else if (datePreset === 'this_month') {
        if (txDateStr < '2026-08-01' || txDateStr > '2026-08-31') return false;
      } else if (datePreset === 'last_month') {
        if (txDateStr < '2026-07-01' || txDateStr > '2026-07-31') return false;
      } else if (startDate || endDate) {
        if (startDate && txDateStr < startDate) return false;
        if (endDate && txDateStr > endDate) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'newest') {
        const dateA = getTxDateString(a);
        const dateB = getTxDateString(b);
        return dateB.localeCompare(dateA);
      }
      if (sortOrder === 'oldest') {
        const dateA = getTxDateString(a);
        const dateB = getTxDateString(b);
        return dateA.localeCompare(dateB);
      }
      if (sortOrder === 'highest') {
        return b.amountMT - a.amountMT;
      }
      if (sortOrder === 'lowest') {
        return a.amountMT - b.amountMT;
      }
      return 0;
    });
  }, [
    transactions,
    searchQuery,
    filterType,
    filterFlow,
    filterProvider,
    filterStatus,
    datePreset,
    startDate,
    endDate,
    sortOrder
  ]);

  // Financial Metrics for the Filtered Set
  const filteredMetrics = useMemo(() => {
    const totalCredit = filteredTransactions
      .filter((t) => t.isCredit)
      .reduce((sum, t) => sum + t.amountMT, 0);
    const totalDebit = filteredTransactions
      .filter((t) => !t.isCredit)
      .reduce((sum, t) => sum + t.amountMT, 0);
    const netTotal = totalCredit - totalDebit;

    return {
      count: filteredTransactions.length,
      totalCredit,
      totalDebit,
      netTotal
    };
  }, [filteredTransactions]);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;
    onDeposit(amt, depositProvider, depositPhone);
    setShowDepositModal(false);
  };

  const handleExportStatement = (format: 'csv' | 'pdf') => {
    const msg = format === 'csv' 
      ? `Extrato de ${filteredTransactions.length} transações exportado em formato CSV (.csv) com sucesso!`
      : `Relatório fiscal em PDF gerado com sucesso para conformidade Moçambique.`;
    setExportFeedbackToast(msg);
    setTimeout(() => setExportFeedbackToast(null), 4000);
  };

  const getProviderBadge = (provider: PaymentProvider) => {
    switch (provider) {
      case 'mpesa':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            M-Pesa
          </span>
        );
      case 'emola':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            e-Mola
          </span>
        );
      case 'mkesh':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            mKesh
          </span>
        );
      case 'card':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700 border border-stone-300">
            <CreditCard className="h-2.5 w-2.5" />
            SIMO / Banco
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'Depósito / Recarga';
      case 'payout':
        return 'Levantamento';
      case 'subscription':
        return 'Subscrição VIP';
      case 'tip':
        return 'Gorjeta Direta';
      case 'ppv_unlock':
        return 'Desbloqueio PPV';
      case 'creator_revenue':
        return 'Receita de Criador';
      default:
        return type;
    }
  };

  return (
    <div className="mx-auto max-w-5xl min-w-0 space-y-6 px-3 py-4 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8">
      
      {/* Toast Notification */}
      {exportFeedbackToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 rounded-2xl bg-stone-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-pink-500/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{exportFeedbackToast}</span>
        </div>
      )}

      {/* Wallet Switcher & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="break-words font-display text-xl font-extrabold text-stone-900 sm:text-2xl">
                Carteira Digital FanScale 🇲🇿
              </h1>
              <p className="text-xs text-stone-500">
                Gere os teus pagamentos móveis M-Pesa, e-Mola, histórico e relatórios em Meticais (MT).
              </p>
            </div>
          </div>
        </div>

        {/* Fan / Creator Wallet Tabs */}
        <div className="flex items-center rounded-full bg-stone-100 p-1 border border-stone-200 shadow-inner self-start sm:self-auto">
          <button
            onClick={() => setActiveWalletMode('fan')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeWalletMode === 'fan'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Carteira de Fã
          </button>
          <button
            onClick={() => setActiveWalletMode('creator')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeWalletMode === 'creator'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Carteira de Criador
          </button>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-pink-500/20 px-3 py-1 text-[11px] font-bold text-pink-400 border border-pink-500/30">
                {activeWalletMode === 'fan' ? 'Saldo para Subscrições & PPV' : 'Saldo Disponível para Levantamento'}
              </span>
              <span className="text-[10px] text-stone-400">
                Moeda: Meticais (MZN)
              </span>
            </div>

            <div>
              <span className="text-xs text-stone-400 font-medium">Saldo Atual</span>
              <div className="font-display text-3xl sm:text-4xl font-black text-white">
                {activeWalletMode === 'fan'
                  ? (walletBalanceMT ?? 0).toLocaleString('pt-MZ')
                  : (creatorAvailableBalance ?? 0).toLocaleString('pt-MZ')}{' '}
                <span className="text-pink-500 text-xl font-bold">MT</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              {activeWalletMode === 'fan'
                ? 'Utilizável instantaneamente em gorjetas durante lives, conteúdos PPV e subscrições mensais a criadores de Moçambique.'
                : 'Podes transferir os teus ganhos diretamente para a tua conta M-Pesa, e-Mola ou conta bancária nacional.'}
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            {activeWalletMode === 'fan' ? (
              <>
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-pink-500/30 transition-[background-color,transform] hover:from-pink-700 hover:to-rose-600 active:scale-95 sm:w-auto"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Adicionar Fundos (M-Pesa)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-[background-color,transform] hover:bg-emerald-700 active:scale-95 sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  <span>Levantar para M-Pesa</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-pink-600/20 blur-2xl pointer-events-none" />
      </div>

      {/* Payment Methods Supported Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-pink-100 bg-white p-3.5 text-center space-y-1 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-black text-xs mx-auto">
            M
          </div>
          <span className="font-bold text-xs text-stone-900 block">Vodacom M-Pesa</span>
          <span className="text-[10px] text-stone-400">Depósito & Saque Instantâneo</span>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-3.5 text-center space-y-1 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-black text-xs mx-auto">
            eM
          </div>
          <span className="font-bold text-xs text-stone-900 block">Movitel e-Mola</span>
          <span className="text-[10px] text-stone-400">Todas as províncias</span>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-3.5 text-center space-y-1 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-black text-xs mx-auto">
            mK
          </div>
          <span className="font-bold text-xs text-stone-900 block">Tmcel mKesh</span>
          <span className="text-[10px] text-stone-400">Pagamentos móveis seguros</span>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-white p-3.5 text-center space-y-1 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white font-bold text-xs mx-auto">
            <CreditCard className="h-4 w-4" />
          </div>
          <span className="font-bold text-xs text-stone-900 block">Cartões Bancários</span>
          <span className="text-[10px] text-stone-400">Visa, Mastercard, SIMO MZ</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADVANCED TRANSACTION FILTERING & HISTORY SECTION */}
      {/* ======================================================== */}
      <div className="rounded-3xl border border-pink-100 bg-white p-5 sm:p-7 shadow-sm space-y-6">
        
        {/* Header & Main Search Bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-2 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-stone-900">
                Histórico & Filtragem Avançada
              </h2>
              {isAnyFilterActive && (
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                  Filtros Ativos ({filteredTransactions.length})
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              Filtra as tuas transações por tipo, intervalo de datas, método de pagamento e fluxo financeiro.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Export Statement */}
            <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-2xl border border-stone-200">
              <button
                onClick={() => handleExportStatement('csv')}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-white hover:text-pink-700 transition-all shadow-none hover:shadow-sm"
                title="Exportar dados filtrados em CSV"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={() => handleExportStatement('pdf')}
                className="flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-white hover:text-pink-700 transition-all shadow-none hover:shadow-sm"
                title="Gerar extrato PDF para contabilidade"
              >
                <FileText className="h-3.5 w-3.5 text-rose-600" />
                <span className="hidden sm:inline">Extrato PDF</span>
              </button>
            </div>

            {/* Toggle Advanced Filters Drawer */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-bold transition-all border ${
                showAdvancedFilters || isAnyFilterActive
                  ? 'bg-pink-50 text-pink-700 border-pink-300'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-pink-600" />
              <span>{showAdvancedFilters ? 'Ocultar Filtros' : 'Filtros Avançados'}</span>
              {showAdvancedFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Real-time Search and Flow Quick Tabs */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Search Input (7 cols) */}
          <div className="relative lg:col-span-7">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Pesquisar por título, criador, descrição ou Ref (ex: MP-894...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 pl-10 pr-9 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-pink-500 focus:bg-white focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Limpar pesquisa"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Flow Pills (Credit / Debit) (5 cols) */}
          <div className="flex items-center justify-between gap-1.5 rounded-2xl border border-stone-200 bg-stone-100 p-1 sm:justify-end lg:col-span-5">
            <button
              onClick={() => setFilterFlow('all')}
              className={`flex-1 sm:flex-none rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                filterFlow === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Todos os Fluxos
            </button>
            <button
              onClick={() => setFilterFlow('credit')}
              className={`flex-1 sm:flex-none rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                filterFlow === 'credit' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <ArrowDownLeft className="h-3 w-3" />
              <span>Entradas (+)</span>
            </button>
            <button
              onClick={() => setFilterFlow('debit')}
              className={`flex-1 sm:flex-none rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                filterFlow === 'debit' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <ArrowUpRight className="h-3 w-3" />
              <span>Saídas (-)</span>
            </button>
          </div>
        </div>

        {/* 1. Filter by Type Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Filtrar por Tipo de Transação
            </label>
            <span className="text-[11px] text-stone-400">
              {filterType === 'all' ? 'Todos os tipos selecionados' : getTypeLabel(filterType)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  : 'border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Todos os Tipos
            </button>

            <button
              onClick={() => setFilterType('deposit')}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'deposit'
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>Depósitos (Recargas)</span>
            </button>

            <button
              onClick={() => setFilterType('payout')}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'payout'
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Download className="h-3.5 w-3.5 text-rose-500" />
              <span>Levantamentos (Saques)</span>
            </button>

            <button
              onClick={() => setFilterType('subscription')}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'subscription'
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>Subscrições VIP</span>
            </button>

            <button
              onClick={() => setFilterType('tip')}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'tip'
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>Gorjetas</span>
            </button>

            <button
              onClick={() => setFilterType('ppv_unlock')}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'ppv_unlock'
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>Conteúdo PPV</span>
            </button>

            <button
              onClick={() => setFilterType('creator_revenue')}
              className={`rounded-full px-3.5 py-1.5 font-bold transition-all flex items-center gap-1.5 ${
                filterType === 'creator_revenue'
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>Receitas Criador</span>
            </button>
          </div>
        </div>

        {/* 2. Filter by Date Range Section */}
        <div className="space-y-3 rounded-2xl bg-stone-50/80 p-4 border border-stone-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-pink-600" />
              <span className="text-xs font-bold text-stone-800">
                Intervalo de Datas & Período
              </span>
            </div>

            {/* Quick Period Tabs */}
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {[
                { key: 'all', label: 'Todo o Período' },
                { key: 'today', label: 'Hoje (18 Ago)' },
                { key: 'last7days', label: 'Últimos 7 dias' },
                { key: 'this_month', label: 'Este Mês (Ago 2026)' },
                { key: 'last_month', label: 'Mês Passado (Jul 2026)' },
                { key: 'custom', label: 'Personalizado' },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => handleDatePresetChange(p.key as DateRangePreset)}
                  className={`rounded-full px-2.5 py-1 font-semibold transition-all ${
                    datePreset === p.key
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Interval Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-stone-200/60 items-end">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-stone-600">
                Data Inicial (De):
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-stone-600">
                Data Final (Até):
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset('custom');
                }}
                className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-900 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setDatePreset('all');
                }}
                className="flex-1 rounded-xl border border-stone-300 bg-white py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors text-center"
              >
                Limpar Datas
              </button>
              <button
                type="button"
                onClick={() => handleDatePresetChange('this_month')}
                className="flex-1 rounded-xl bg-pink-50 border border-pink-200 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-colors text-center"
              >
                Mês Atual
              </button>
            </div>
          </div>
        </div>

        {/* 3. Expandable Advanced Filter Drawer (Provider, Status, Sort) */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-pink-50/50 border border-pink-100 animate-in fade-in zoom-in-95 duration-150">
            {/* Filter by Provider */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Método / Provedor Móvel
              </label>
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs font-semibold text-stone-800 focus:border-pink-500 focus:outline-none"
              >
                <option value="all">Todos os Provedores</option>
                <option value="mpesa">Vodacom M-Pesa 🇲🇿</option>
                <option value="emola">Movitel e-Mola 🇲🇿</option>
                <option value="mkesh">Tmcel mKesh 🇲🇿</option>
                <option value="card">Cartão / Banco SIMO</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Estado da Transação
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs font-semibold text-stone-800 focus:border-pink-500 focus:outline-none"
              >
                <option value="all">Todos os Estados</option>
                <option value="completed">Concluída com Sucesso</option>
                <option value="pending">Pendente de Confirmação</option>
                <option value="failed">Falhada / Rejeitada</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
                Ordenar Resultados
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="w-full rounded-xl border border-stone-200 bg-white p-2.5 text-xs font-semibold text-stone-800 focus:border-pink-500 focus:outline-none"
              >
                <option value="newest">Mais Recentes Primeiro</option>
                <option value="oldest">Mais Antigas Primeiro</option>
                <option value="highest">Maior Valor (MT)</option>
                <option value="lowest">Menor Valor (MT)</option>
              </select>
            </div>
          </div>
        )}

        {/* 4. Filter Summary & Metrics Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-stone-900 p-4 text-white shadow-md">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                Transações
              </span>
              <span className="font-display font-black text-base text-white">
                {filteredMetrics.count} <span className="text-[11px] font-normal text-stone-400">de {transactions.length}</span>
              </span>
            </div>

            <div className="h-7 w-px bg-stone-700 hidden sm:block" />

            <div>
              <span className="text-[10px] text-emerald-400 block uppercase font-bold tracking-wider flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Total Entradas (+)
              </span>
              <span className="font-display font-bold text-sm text-emerald-400">
                +{filteredMetrics.totalCredit.toLocaleString('pt-MZ')} MT
              </span>
            </div>

            <div className="h-7 w-px bg-stone-700 hidden sm:block" />

            <div>
              <span className="text-[10px] text-rose-400 block uppercase font-bold tracking-wider flex items-center gap-1">
                <TrendingDown className="h-3 w-3" /> Total Saídas (-)
              </span>
              <span className="font-display font-bold text-sm text-rose-400">
                -{filteredMetrics.totalDebit.toLocaleString('pt-MZ')} MT
              </span>
            </div>

            <div className="h-7 w-px bg-stone-700 hidden md:block" />

            <div className="hidden md:block">
              <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">
                Fluxo Líquido do Período
              </span>
              <span className={`font-display font-bold text-sm ${filteredMetrics.netTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {filteredMetrics.netTotal >= 0 ? '+' : ''}
                {filteredMetrics.netTotal.toLocaleString('pt-MZ')} MT
              </span>
            </div>
          </div>

          {isAnyFilterActive && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 rounded-full bg-stone-800 px-3.5 py-1.5 text-xs font-bold text-pink-400 hover:bg-stone-700 transition-colors border border-stone-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>

        {/* 5. Transaction List / Table */}
        <div className="divide-y divide-stone-100">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                <Filter className="h-6 w-6" />
              </div>
              <h4 className="font-display text-base font-bold text-stone-900">
                Nenhuma transação encontrada
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Não encontramos movimentações para os filtros de tipo, provedor ou intervalo de datas selecionados.
              </p>
              <button
                onClick={handleResetFilters}
                className="rounded-full bg-pink-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:bg-pink-700 transition-colors"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <button
                type="button"
                key={tx.id} 
                onClick={() => setSelectedTransaction(tx)}
                className="group flex w-full min-w-0 flex-col items-stretch gap-3 rounded-2xl px-2.5 py-3.5 text-left transition-colors hover:bg-pink-50/40 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between min-[430px]:gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
                      tx.isCredit
                        ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
                        : 'bg-stone-100 text-stone-700 ring-1 ring-stone-200'
                    }`}
                  >
                    {tx.isCredit ? (
                      <ArrowDownLeft className="h-5 w-5 stroke-[2.5]" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-pink-600 transition-colors truncate">
                        {tx.title}
                      </h4>
                      {getProviderBadge(tx.provider)}
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">
                      {tx.description}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono">
                      Ref: <span className="font-bold text-stone-600">{tx.referenceNumber}</span> · {getTypeLabel(tx.type)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-end justify-between gap-3 pl-14 text-left min-[430px]:block min-[430px]:space-y-0.5 min-[430px]:pl-0 min-[430px]:text-right">
                  <span
                    className={`font-display text-sm sm:text-base font-black block ${
                      tx.isCredit ? 'text-emerald-600' : 'text-stone-900'
                    }`}
                  >
                    {tx.isCredit ? '+' : '-'}
                    {(tx.amountMT ?? 0).toLocaleString('pt-MZ')} <span className="text-xs font-semibold">MT</span>
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    {tx.date}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block">
                    ✓ Concluído
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* TRANSACTION RECEIPT & DETAIL MODAL */}
      {/* ======================================================== */}
      {selectedTransaction && (
        <ResponsiveDialog
          ariaLabel="Comprovativo de transação"
          onClose={() => setSelectedTransaction(null)}
          closeOnBackdrop
          panelClassName="max-w-md rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-pink-100 space-y-5"
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-stone-900">
                    Comprovativo de Transação 🇲🇿
                  </h3>
                  <span className="text-[10px] text-stone-400">FanScale Moçambique</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                aria-label="Fechar comprovativo"
                className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Amount Box */}
            <div className="rounded-2xl bg-stone-50 p-5 text-center space-y-1.5 border border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Valor Total Processado
              </span>
              <div className={`font-display text-3xl font-black ${selectedTransaction.isCredit ? 'text-emerald-600' : 'text-stone-900'}`}>
                {selectedTransaction.isCredit ? '+' : '-'}
                {selectedTransaction.amountMT.toLocaleString('pt-MZ')} <span className="text-pink-600 text-xl">MT</span>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Transação Liquidada com Sucesso</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex min-w-0 items-start justify-between gap-3 py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Título do Serviço:</span>
                <span className="min-w-0 break-words font-bold text-stone-900 text-right">{selectedTransaction.title}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Tipo de Movimento:</span>
                <span className="font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-lg">
                  {getTypeLabel(selectedTransaction.type)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Método de Pagamento:</span>
                <div>{getProviderBadge(selectedTransaction.provider)}</div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Nº de Referência Móvel:</span>
                <span className="font-mono font-bold text-stone-900">{selectedTransaction.referenceNumber}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Data e Hora:</span>
                <span className="font-medium text-stone-800">{selectedTransaction.date}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Descrição / Nota:</span>
                <span className="text-stone-600 text-right max-w-xs">{selectedTransaction.description}</span>
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleExportStatement('pdf');
                  setSelectedTransaction(null);
                }}
                className="flex-1 rounded-full bg-pink-600 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:bg-pink-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Descarregar Recibo PDF</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`Recibo FanScale Ref: ${selectedTransaction.referenceNumber} - ${selectedTransaction.amountMT} MT`);
                  setExportFeedbackToast('Dados do comprovativo copiados para a área de transferência!');
                  setSelectedTransaction(null);
                  setTimeout(() => setExportFeedbackToast(null), 3000);
                }}
                className="rounded-full border border-stone-200 bg-white p-2.5 text-stone-700 hover:bg-stone-50 transition-colors"
                title="Partilhar Comprovativo"
                aria-label="Partilhar comprovativo"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
        </ResponsiveDialog>
      )}

      {/* ======================================================== */}
      {/* DEPOSIT MODAL (RECARREGAR CARTEIRA M-PESA) */}
      {/* ======================================================== */}
      {showDepositModal && (
        <ResponsiveDialog
          ariaLabel="Recarregar carteira FanScale"
          onClose={() => setShowDepositModal(false)}
          closeOnBackdrop
          panelClassName="max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-pink-100 space-y-5"
        >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-stone-900">
                  Recarregar Carteira FanScale 🇲🇿
                </h3>
                <p className="text-[11px] text-stone-400">Vodacom M-Pesa · Movitel e-Mola · Tmcel mKesh</p>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                aria-label="Fechar recarga de carteira"
                className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Valor a Recarregar (MT)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['500', '1000', '2500'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                        depositAmount === amt ? 'bg-pink-600 text-white border-pink-600' : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {amt} MT
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="50"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs font-bold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Método de Recarga Móvel
                </label>
                <div className="grid grid-cols-1 gap-2 text-xs font-bold min-[390px]:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setDepositProvider('mpesa')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      depositProvider === 'mpesa' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    M-Pesa 🇲🇿
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositProvider('emola')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      depositProvider === 'emola' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    e-Mola 🇲🇿
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositProvider('mkesh')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      depositProvider === 'mkesh' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    mKesh 🇲🇿
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Número de Telemóvel (+258)
                </label>
                <input
                  type="text"
                  value={depositPhone}
                  onChange={(e) => setDepositPhone(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-3 text-xs font-bold text-white shadow-md shadow-pink-500/30 hover:from-pink-700 hover:to-rose-600 transition-all"
              >
                Continuar para Confirmação no Telemóvel
              </button>
            </form>
        </ResponsiveDialog>
      )}

      {/* ======================================================== */}
      {/* WITHDRAW MODAL FOR CREATOR */}
      {/* ======================================================== */}
      {showWithdrawModal && (
        <ResponsiveDialog
          ariaLabel="Levantar rendimento de criador"
          onClose={() => setShowWithdrawModal(false)}
          closeOnBackdrop
          role="alertdialog"
          panelClassName="max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-pink-100 space-y-5"
        >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display text-base font-bold text-stone-900">
                Levantar Rendimento de Criador 🇲🇿
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                aria-label="Fechar levantamento"
                className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700">
              <p>
                O teu saldo de criador de <strong>{creatorAvailableBalance.toLocaleString('pt-MZ')} MT</strong> será transferido diretamente para o teu M-Pesa, e-Mola ou conta bancária em Moçambique.
              </p>
              <button
                onClick={() => {
                  onRequestPayout(15000, 'mpesa', '849998888');
                  setShowWithdrawModal(false);
                }}
                className="w-full rounded-full bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
              >
                Confirmar Levantamento de 15.000 MT via M-Pesa
              </button>
            </div>
        </ResponsiveDialog>
      )}

    </div>
  );
};
