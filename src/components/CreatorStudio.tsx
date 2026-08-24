import React, { useState } from 'react';
import { PageContainer } from './ui/PageContainer';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Coins, 
  PlusCircle, 
  Sparkles, 
  ArrowUpRight, 
  Download, 
  CheckCircle, 
  Settings, 
  Lock, 
  MessageCircle, 
  Eye, 
  Heart,
  BarChart3,
  Bot,
  Star,
  Radio,
  ThumbsUp,
  Award,
  LogOut
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CREATOR_ANALYTICS_DATA } from '../data/mockData';
import { CreatorProfile, Post, CreatorReview } from '../types';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface CreatorStudioProps {
  creator: CreatorProfile;
  posts: Post[];
  reviews?: CreatorReview[];
  onOpenCreateModal: () => void;
  onRequestPayout: (amountMT: number, method: string, phoneOrIban: string) => void;
  onUpdatePricing: (monthlyMT: number, quarterlyMT: number) => void;
  onLogout?: () => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  creator,
  posts,
  reviews = [],
  onOpenCreateModal,
  onRequestPayout,
  onUpdatePricing,
  onLogout,
}) => {
  const [activeStudioTab, setActiveStudioTab] = useState<'overview' | 'content' | 'pricing' | 'reviews' | 'affiliates' | 'ai_assistant'>('overview');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('15000');
  const [payoutMethod, setPayoutMethod] = useState<'mpesa' | 'emola' | 'bank'>('mpesa');
  const [payoutPhone, setPayoutPhone] = useState('849998888');
  const [copiedAffiliate, setCopiedAffiliate] = useState(false);
  
  // Pricing states
  const [monthlyPrice, setMonthlyPrice] = useState(creator.subscriptionPriceMonthly.toString());
  const [quarterlyPrice, setQuarterlyPrice] = useState(creator.subscriptionPriceQuarterly.toString());
  const [savedPricingFeedback, setSavedPricingFeedback] = useState(false);

  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState('Ideias de post de moda com capulana para o fim de semana em Maputo');
  const [aiGeneratedResult, setAiGeneratedResult] = useState<string | null>(
    '🇲🇿 Sugestão FanScale AI:\n\n📸 Visual: Foto elegante em luz dourada na Marginal de Maputo ou Jardim Tunduru vestindo um blazer moderno com detalhes em capulana Samakaka.\n\n✍️ Legenda: "A sofisticação do nosso Moçambique numa peça só ✨ Detalhes que contam a nossa história com o charme de Maputo. Subscritores VIP têm acesso ao guia de lojas locais onde fiz este corte sob medida! 👗🇲🇿"\n\n🏷️ Hashtags: #ModaMaputo #CapulanaVibes #EstiloMoz #FanScaleCreators #MaputoElegante'
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const availableBalanceMT = 35400;
  const earningsThisMonthMT = 18750;
  const totalEarningsMT = 142600;
  const subscribersCount = creator?.subscribersCount ?? 2450;
  const newSubscribersThisMonth = 184;

  const creatorReviews = reviews.filter((r) => r.creatorId === creator.id);
  const ratingAvg = creator.ratingAverage || 4.9;
  const ratingCount = creator.ratingCount || 150;

  const handleCopyAffiliate = () => {
    navigator.clipboard?.writeText(`https://fanscale.com/@${creator.username}?ref=${creator.id}`);
    setCopiedAffiliate(true);
    setTimeout(() => setCopiedAffiliate(false), 2500);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payoutAmount) || 0;
    if (amt <= 0 || amt > availableBalanceMT) return;
    onRequestPayout(amt, payoutMethod, payoutPhone);
    setShowPayoutModal(false);
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePricing(parseFloat(monthlyPrice) || 499, parseFloat(quarterlyPrice) || 1290);
    setSavedPricingFeedback(true);
    setTimeout(() => setSavedPricingFeedback(false), 2500);
  };

  const handleGenerateAiIdea = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiGeneratedResult(
        `🇲🇿 Ideia Gerada para ${creator.category} (${creator.name}):\n\n📌 Título do Post: "Bastidores Exclusivos: Como planeio a minha semana de ${creator.category.toLowerCase()}"\n\n🎯 Formato: Carrossel com 3 fotos em alta definição + vídeo curto mostrando a rotina.\n\n💰 Dica de Monetização: Define como "Apenas Subscritores VIP" e envia uma mensagem privada aos teus 50 fãs mais ativos oferecendo 10% de desconto no plano trimestral de ${quarterlyPrice} MT!\n\n✨ Frase de Engajamento: "Qual é a tua maior meta esta semana? Respondo a todos os subscritores no chat direto!"`
      );
    }, 1200);
  };

  return (
    <PageContainer width="wide" className="space-y-6 py-4 sm:space-y-8 sm:py-6">
      
      {/* Studio Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-stone-900 p-4 text-white shadow-xl sm:flex-row sm:items-center sm:rounded-3xl sm:p-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-pink-600 text-white text-xs font-black">
              FS
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              FanScale Creator Studio 🇲🇿
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Painel de Monetização de {creator.name}
          </h1>
          <p className="text-xs text-stone-400">
            Gere as tuas subscrições, pagamentos M-Pesa, receitas de conteúdos pagos e cresce a tua comunidade.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center">
          <button
            onClick={() => setShowPayoutModal(true)}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-700 sm:px-5"
          >
            <Download className="h-4 w-4" />
            <span>Levantar Dinheiro</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-3 py-2.5 text-center text-xs font-bold text-white shadow-md shadow-pink-500/30 transition-all hover:from-pink-700 hover:to-rose-600 sm:px-5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Novo Conteúdo</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="col-span-2 flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-stone-700 bg-stone-800/90 px-4 py-2.5 text-xs font-bold text-stone-300 transition-all hover:border-rose-800 hover:bg-rose-950/60 hover:text-rose-400 sm:col-span-1"
              title="Terminar sessão da conta de criador"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair da Conta</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        
        {/* Saldo Disponível */}
        <div className="space-y-2 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Saldo Disponível</span>
            <Wallet className="h-4 w-4 text-pink-600" />
          </div>
          <div className="font-display text-2xl font-black text-stone-900">
            {availableBalanceMT.toLocaleString('pt-MZ')} <span className="text-pink-600 text-sm">MT</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Pronto para levantamento M-Pesa
          </p>
        </div>

        {/* Ganhos Este Mês */}
        <div className="space-y-2 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Ganhos Este Mês</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="font-display text-2xl font-black text-stone-900">
            {earningsThisMonthMT.toLocaleString('pt-MZ')} <span className="text-emerald-600 text-sm">MT</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" />
            +24.8% em relação ao mês anterior
          </p>
        </div>

        {/* Subscritores Ativos */}
        <div className="space-y-2 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Subscritores Ativos</span>
            <Users className="h-4 w-4 text-pink-600" />
          </div>
          <div className="font-display text-2xl font-black text-stone-900">
            {subscribersCount.toLocaleString('pt-MZ')}
          </div>
          <p className="text-[11px] text-pink-600 font-semibold">
            +{newSubscribersThisMonth} novos subscritores este mês
          </p>
        </div>

        {/* Ganhos Totais Acumulados */}
        <div className="space-y-2 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Ganhos Totais FanScale</span>
            <Coins className="h-4 w-4 text-amber-500" />
          </div>
          <div className="font-display text-2xl font-black text-stone-900">
            {totalEarningsMT.toLocaleString('pt-MZ')} <span className="text-stone-400 text-sm">MT</span>
          </div>
          <p className="text-[11px] text-stone-500 font-medium">
            Desde a adesão à plataforma
          </p>
        </div>

      </div>

      {/* Studio Nav Tabs */}
      <div className="flex min-w-0 snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain border-b border-pink-100 pb-2 scrollbar-none">
        <button
          onClick={() => setActiveStudioTab('overview')}
          className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeStudioTab === 'overview'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
              : 'text-stone-600 hover:bg-pink-50 hover:text-pink-700'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Gráficos de Receita</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('reviews')}
          className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeStudioTab === 'reviews'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-stone-600 hover:bg-amber-50 hover:text-amber-700'
          }`}
        >
          <Star className={`h-4 w-4 ${activeStudioTab === 'reviews' ? 'fill-white' : 'fill-amber-400 text-amber-400'}`} />
          <span>Reputação & Avaliações ({creatorReviews.length || ratingCount})</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('pricing')}
          className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeStudioTab === 'pricing'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
              : 'text-stone-600 hover:bg-pink-50 hover:text-pink-700'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Preços de Subscrição</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('content')}
          className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeStudioTab === 'content'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
              : 'text-stone-600 hover:bg-pink-50 hover:text-pink-700'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Gestão de Conteúdos & DRM</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('affiliates')}
          className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeStudioTab === 'affiliates'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20'
              : 'text-stone-600 hover:bg-pink-50 hover:text-pink-700'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Programa de Afiliados</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('ai_assistant')}
          className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            activeStudioTab === 'ai_assistant'
              ? 'bg-stone-900 text-white shadow-md'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Bot className="h-4 w-4 text-pink-500" />
          <span>FanScale AI Assistant</span>
        </button>
      </div>

      {/* Tab: Reviews & Feedback */}
      {activeStudioTab === 'reviews' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  <h3 className="font-display text-lg font-bold text-amber-950">
                    Classificação & Reputação do Criador
                  </h3>
                </div>
                <p className="text-xs text-amber-900/80 max-w-xl">
                  Criadores com média superior a 4.8 estrelas recebem maior destaque no Explorar e selo de Criador Verificado 👑.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 border border-amber-200 text-center shadow-sm">
                  <span className="font-display text-2xl font-black text-amber-600 block">
                    {ratingAvg.toFixed(1)} ★
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold">Nota Geral</span>
                </div>

                <div className="rounded-2xl bg-white p-3 border border-rose-200 text-center shadow-sm">
                  <span className="font-display text-2xl font-black text-rose-600 block">
                    {creator.liveRatingAverage ? `${creator.liveRatingAverage.toFixed(1)} ★` : '5.0 ★'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold">Nota das Lives 🔴</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Feed */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-bold text-stone-900">
              Comentários e Críticas Recentes dos Teus Fãs ({creatorReviews.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creatorReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900">{rev.userName}</span>
                          {rev.userBadge && (
                            <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.2 rounded-full">
                              {rev.userBadge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400">@{rev.userHandle} · {rev.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>

                  {rev.liveTitle && (
                    <div className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Radio className="h-2.5 w-2.5" />
                      <span>Live: {rev.liveTitle}</span>
                    </div>
                  )}

                  <p className="text-xs text-stone-700 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-pink-600" /> {rev.likesCount} acharam útil
                    </span>
                    <span className="text-emerald-600 font-semibold">Fã Ativo M-Pesa ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Overview / Revenue Analytics */}
      {activeStudioTab === 'overview' && (
        <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
          
          {/* Main Revenue Chart (8 cols) */}
          <div className="min-w-0 space-y-4 overflow-hidden rounded-2xl border border-pink-100 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-6 lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-base font-bold text-stone-900">
                  Evolução de Receitas Diárias (Meticais)
                </h3>
                <p className="text-xs text-stone-400">
                  Acompanha as entradas de subscrições, PPV e gorjetas
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-semibold text-pink-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-600" />
                  Receita Total
                </span>
              </div>
            </div>

            <div className="h-56 w-full min-w-0 pt-4 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CREATOR_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis width={42} stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(val) => `${val} MT`} />
                  <Tooltip 
                    formatter={(val: any) => [`${(Number(val) || 0).toLocaleString('pt-MZ')} MT`, 'Receita']}
                    contentStyle={{ backgroundColor: '#1E293B', borderRadius: '1rem', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="receita" stroke="#EC4899" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Distribution Breakdown (4 cols) */}
          <div className="space-y-5 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:col-span-4">
            <h3 className="font-display text-base font-bold text-stone-900">
              Fontes de Rendimento
            </h3>

            <div className="space-y-3.5 text-xs">
              
              {/* Subscrições Mensais */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Subscrições Mensais VIP</span>
                  <span className="text-pink-600">65% (12.180 MT)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-pink-600 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              {/* Conteúdos Pagos PPV */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Conteúdos Pagos (PPV)</span>
                  <span className="text-rose-500">20% (3.750 MT)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>

              {/* Gorjetas */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Gorjetas Diretas de Fãs</span>
                  <span className="text-amber-500">10% (1.875 MT)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>

              {/* Mensagens Pagas */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-stone-800">
                  <span>Mensagens Pagas no Chat</span>
                  <span className="text-emerald-500">5% (945 MT)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>

            </div>

            <div className="rounded-2xl bg-pink-50 p-4 border border-pink-100 text-xs text-pink-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-pink-600" />
                Dica FanScale para Criadores
              </span>
              <p className="text-[11px] text-stone-600">
                Criadores que publicam pelo menos 3 conteúdos exclusivos por semana aumentam a renovação de subscrições em 42%!
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Pricing Settings */}
      {activeStudioTab === 'pricing' && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-stone-900">
              Definição de Preços de Subscrição
            </h3>
            <p className="text-xs text-stone-500">
              Define quanto os teus fãs em Moçambique pagam mensalmente e trimestralmente em Meticais (MT).
            </p>
          </div>

          <form onSubmit={handleSavePricing} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Monthly price */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Preço Mensal (MT / mês)
                </label>
                <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 focus-within:border-pink-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500/20">
                  <input
                    type="number"
                    min="50"
                    step="10"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-stone-500 ml-2">MT</span>
                </div>
                <p className="text-[10px] text-stone-400">Recomendado: 250 MT - 600 MT</p>
              </div>

              {/* Quarterly price */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Preço Trimestral (3 meses)
                </label>
                <div className="flex items-center rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 focus-within:border-pink-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500/20">
                  <input
                    type="number"
                    min="150"
                    step="10"
                    value={quarterlyPrice}
                    onChange={(e) => setQuarterlyPrice(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-stone-900 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-stone-500 ml-2">MT</span>
                </div>
                <p className="text-[10px] text-stone-400">Desconto incentivador para fãs fiéis</p>
              </div>

            </div>

            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:from-pink-700 hover:to-rose-600 transition-all flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Guardar Preços</span>
            </button>

            {savedPricingFeedback && (
              <p className="text-xs text-emerald-600 font-bold animate-fade-in">
                ✓ Preços atualizados com sucesso no teu perfil!
              </p>
            )}
          </form>
        </div>
      )}

      {/* Tab: AI Assistant */}
      {activeStudioTab === 'ai_assistant' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-stone-800 bg-stone-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                FanScale AI Creator Assistant 🇲🇿
              </h3>
              <p className="text-xs text-stone-400">
                Gera ideias virais, sugestões de fotos e legendas otimizadas para a audiência moçambicana.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-300">
              O que gostarias de criar ou planear hoje?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Ideias de vídeo de humor sobre o calor de Maputo..."
                className="flex-1 rounded-2xl border border-stone-700 bg-stone-800 px-4 py-3 text-xs text-white placeholder:text-stone-500 focus:border-pink-500 focus:outline-none"
              />
              <button
                onClick={handleGenerateAiIdea}
                disabled={isGeneratingAi || !aiPrompt.trim()}
                className="rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-3 text-xs font-bold text-white hover:from-pink-700 hover:to-rose-600 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGeneratingAi ? 'A Gerar...' : 'Gerar Ideia'}</span>
              </button>
            </div>
          </div>

          {aiGeneratedResult && (
            <div className="rounded-2xl bg-stone-800/80 border border-stone-700 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-pink-400 font-bold">
                <span>Resultado Sugerido:</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(aiGeneratedResult);
                  }}
                  className="hover:underline text-stone-300"
                >
                  Copiar Texto
                </button>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-xs text-stone-200 leading-relaxed">
                {aiGeneratedResult}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab: Content Manager */}
      {activeStudioTab === 'content' && (
        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-stone-900">
              Todas as Tuas Publicações ({posts.length})
            </h3>
            <button
              onClick={onOpenCreateModal}
              className="rounded-full bg-pink-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-pink-700"
            >
              + Adicionar
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {posts.map((post) => (
              <div key={post.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.mediaUrls[0]}
                    alt={post.caption}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 line-clamp-1">
                        {post.caption}
                      </span>
                      {post.visibility === 'subscriber' && (
                        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[9px] font-bold text-pink-700 border border-pink-200">
                          🔒 Subscritores
                        </span>
                      )}
                      {post.visibility === 'ppv' && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-200">
                          💰 PPV {post.priceMT} MT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-pink-600" />
                        {post.likesCount} gostos
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.commentsCount} comentários
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.viewsCount} visualizações
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 block">
                    {post.tipsTotalMT} MT
                  </span>
                  <span className="text-[10px] text-stone-400">em gorjetas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Affiliates & Referrals */}
      {activeStudioTab === 'affiliates' && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Affiliate Header Card */}
          <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 p-6 sm:p-8 text-white border border-stone-700 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
                ✨ Programa de Afiliados FanScale Moçambique
              </span>
            </div>
            
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Ganha 5% de Comissão Vitalícia por cada novo Criador ou Fã que convidares!
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Partilha o teu link único nas tuas redes (Instagram, Twitter/X, TikTok, WhatsApp). Sempre que alguém se registar e subscrever ou publicar, tu recebes comissões automáticas diretamente na tua carteira.
            </p>

            {/* Referral Link Box */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-stone-300">
                O Teu Link Único de Afiliado FanScale
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 rounded-2xl bg-black/40 border border-stone-700 px-4 py-3 text-xs font-mono font-bold text-pink-400 select-all overflow-x-auto">
                  https://fanscale.com/@{creator.username}?ref={creator.id}
                </div>
                <button
                  id="creator-copy-affiliate-link"
                  onClick={handleCopyAffiliate}
                  className="rounded-2xl bg-pink-600 px-6 py-3 text-xs font-bold text-white hover:bg-pink-500 transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-pink-600/30"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{copiedAffiliate ? 'Copiado!' : 'Copiar Link de Convite'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Affiliate Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-1">
              <span className="text-xs font-medium text-stone-500">Cliques no Teu Link</span>
              <div className="font-display text-2xl font-black text-stone-900">1.842</div>
              <span className="text-[10px] text-emerald-600 font-bold">+18% esta semana</span>
            </div>

            <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-1">
              <span className="text-xs font-medium text-stone-500">Registos Convertidos</span>
              <div className="font-display text-2xl font-black text-pink-600">64 criadores / fãs</div>
              <span className="text-[10px] text-stone-400">Taxa de conversão: 3.5%</span>
            </div>

            <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-1">
              <span className="text-xs font-medium text-stone-500">Comissões Acumuladas</span>
              <div className="font-display text-2xl font-black text-emerald-600">4.320 MT</div>
              <span className="text-[10px] text-emerald-600 font-bold">Disponível p/ levantamento M-Pesa</span>
            </div>
          </div>

        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <ResponsiveDialog
          ariaLabel="Pedir levantamento de saldo"
          onClose={() => setShowPayoutModal(false)}
          closeOnBackdrop
          panelClassName="max-w-md rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-pink-100 space-y-5"
        >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display text-base font-bold text-stone-900">
                Pedir Levantamento de Saldo 🇲🇿
              </h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                aria-label="Fechar pedido de levantamento"
                className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div className="rounded-2xl bg-pink-50 p-3.5 text-xs text-pink-900">
                <span className="font-bold block">Saldo Disponível: {availableBalanceMT.toLocaleString('pt-MZ')} MT</span>
                <span className="text-[11px] text-stone-600">Sem taxas de levantamento para M-Pesa e e-Mola. Transferência processada em até 2 horas.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Valor a Levantar (MT)
                </label>
                <input
                  type="number"
                  min="500"
                  max={availableBalanceMT}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs font-bold text-stone-900 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Método de Recebimento
                </label>
                <div className="grid grid-cols-1 gap-2 text-xs font-bold min-[390px]:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('mpesa')}
                    className={`p-2.5 rounded-xl border text-center ${
                      payoutMethod === 'mpesa' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-stone-200'
                    }`}
                  >
                    M-Pesa 🇲🇿
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('emola')}
                    className={`p-2.5 rounded-xl border text-center ${
                      payoutMethod === 'emola' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-stone-200'
                    }`}
                  >
                    e-Mola 🇲🇿
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`p-2.5 rounded-xl border text-center ${
                      payoutMethod === 'bank' ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-stone-200'
                    }`}
                  >
                    Banco BCI / BIM
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {payoutMethod === 'bank' ? 'IBAN ou NIB Moçambicano' : 'Número de Telemóvel (+258)'}
                </label>
                <input
                  type="text"
                  value={payoutPhone}
                  onChange={(e) => setPayoutPhone(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-900 focus:border-pink-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 transition-all"
              >
                Confirmar Pedido de Levantamento ({payoutAmount} MT)
              </button>
            </form>
        </ResponsiveDialog>
      )}

    </PageContainer>
  );
};
