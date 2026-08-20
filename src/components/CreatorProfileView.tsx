import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Lock, 
  Heart, 
  MessageCircle, 
  Share2, 
  Coins, 
  Grid, 
  List, 
  Sparkles, 
  ShieldCheck, 
  Star,
  Radio,
  ThumbsUp,
  Award,
  Video,
  Send,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { CreatorProfile, Post, CreatorReview, LiveSession } from '../types';
import { PostCard } from './PostCard';

interface CreatorProfileViewProps {
  creator: CreatorProfile;
  posts: Post[];
  reviews?: CreatorReview[];
  liveSessions?: LiveSession[];
  onBack: () => void;
  onFollowToggle: (creatorId: string) => void;
  onOpenSubscribeModal: (creatorId: string) => void;
  onOpenTipModal: (creatorId: string, creatorName: string) => void;
  onOpenMessageWithCreator: (creatorId: string) => void;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenPpvUnlockModal: (post: Post) => void;
  onReportPost: (post: Post) => void;
  onOpenRateModal: (creator: CreatorProfile, liveId?: string) => void;
  onLikeReview?: (reviewId: string) => void;
  onOpenLiveRoom?: (session: LiveSession) => void;
  onLogout?: () => void;
}

export const CreatorProfileView: React.FC<CreatorProfileViewProps> = ({
  creator,
  posts,
  reviews = [],
  liveSessions = [],
  onBack,
  onFollowToggle,
  onOpenSubscribeModal,
  onOpenTipModal,
  onOpenMessageWithCreator,
  onLikePost,
  onSavePost,
  onAddComment,
  onOpenPpvUnlockModal,
  onReportPost,
  onOpenRateModal,
  onLikeReview,
  onOpenLiveRoom,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'exclusive' | 'ppv' | 'reviews' | 'lives'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('feed');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'lives' | 'vip' | '5stars'>('all');

  // Filter posts belonging to this creator
  const creatorPosts = posts.filter((p) => p.creatorId === creator.id || p.creator.username === creator.username);
  
  // Filter reviews for this creator
  const creatorReviews = reviews.filter((r) => r.creatorId === creator.id);

  // Filtered reviews
  const filteredReviews = creatorReviews.filter((r) => {
    if (reviewFilter === 'lives') return !!r.liveId;
    if (reviewFilter === 'vip') return r.isVerifiedSubscriber;
    if (reviewFilter === '5stars') return r.rating === 5;
    return true;
  });

  const creatorLiveSessions = liveSessions.filter((l) => l.creatorId === creator.id);

  const ratingAvg = creator.ratingAverage || 4.9;
  const ratingCount = creator.ratingCount || (creatorReviews.length ? creatorReviews.length + 120 : 150);
  const breakdown = creator.ratingBreakdown || {
    5: Math.round(ratingCount * 0.85),
    4: Math.round(ratingCount * 0.10),
    3: Math.round(ratingCount * 0.03),
    2: Math.round(ratingCount * 0.01),
    1: Math.round(ratingCount * 0.01)
  };

  const filteredPosts = creatorPosts.filter((p) => {
    if (activeTab === 'exclusive') return p.visibility === 'subscriber';
    if (activeTab === 'ppv') return p.visibility === 'ppv';
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-pink-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar ao Feed</span>
      </button>

      {/* Header Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm sm:rounded-3xl">
        
        {/* Cover Photo */}
        <div className="relative h-40 w-full bg-stone-200 sm:h-64">
          <img
            src={creator.coverImage}
            alt={creator.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {creator.isLive && (
              <button
                onClick={() => {
                  const currentLive = creatorLiveSessions.find((l) => l.isLive) || creatorLiveSessions[0];
                  if (currentLive && onOpenLiveRoom) onOpenLiveRoom(currentLive);
                }}
                className="flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-extrabold text-white shadow-lg animate-pulse hover:bg-rose-700 transition-colors"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>AO VIVO 🔴</span>
              </button>
            )}

            {creator.badge && (
              <div className="rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                ⭐ {creator.badge}
              </div>
            )}
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="space-y-6 p-4 pt-0 sm:p-6 sm:pt-0">
          
          {/* Top row: Avatar & Action Buttons */}
          <div className="-mt-14 flex flex-col justify-between gap-4 sm:-mt-20 sm:flex-row sm:items-end">
            
            {/* Avatar */}
            <div className="relative inline-block">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-xl ring-4 ring-pink-500/20 sm:h-36 sm:w-36"
              />
              {creator.verified && (
                <CheckCircle className="absolute bottom-2 right-2 h-7 w-7 fill-pink-600 text-white shadow-md rounded-full" />
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2.5">
              
              {/* Avaliar Criador Button */}
              <button
                onClick={() => onOpenRateModal(creator)}
                className="flex min-w-0 items-center justify-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors shadow-sm sm:px-4"
              >
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span>Avaliar com Estrelas</span>
              </button>

              {/* Seguir Button */}
              <button
                onClick={() => onFollowToggle(creator.id)}
                className={`rounded-full px-4 py-2.5 text-xs font-bold transition-colors sm:px-5 ${
                  creator.isFollowing
                    ? 'border border-stone-300 bg-stone-100 text-stone-700 hover:bg-stone-200'
                    : 'border border-pink-500 bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                {creator.isFollowing ? 'A Seguir' : '+ Seguir'}
              </button>

              {/* Mensagem Button */}
              <button
                onClick={() => onOpenMessageWithCreator(creator.id)}
                className="flex items-center justify-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors sm:px-4"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Mensagem</span>
              </button>

              {/* Gorjeta Button */}
              <button
                onClick={() => onOpenTipModal(creator.id, creator.name)}
                className="flex items-center justify-center gap-1.5 rounded-full border border-pink-200 bg-pink-50 px-3 py-2.5 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-colors sm:px-4"
              >
                <Coins className="h-3.5 w-3.5 text-pink-600" />
                <span>Dar Gorjeta</span>
              </button>

              {/* Subscrever Button */}
              <button
                onClick={() => onOpenSubscribeModal(creator.id)}
                className="col-span-2 flex min-w-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 px-4 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-pink-500/30 transition-[background-color,transform] hover:from-pink-700 hover:to-rose-600 active:scale-95 sm:col-auto sm:px-6"
              >
                <Lock className="h-3.5 w-3.5" />
                <span className="min-w-0 break-words">
                  {creator.isSubscribed
                    ? 'Subscrito VIP ✓'
                    : `Subscrever — ${creator.subscriptionPriceMonthly} MT/mês`}
                </span>
              </button>

              {/* Sair da Conta Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                  title="Terminar Sessão da Conta"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sair</span>
                </button>
              )}
            </div>
          </div>

          {/* Name, Handle, Bio, Stars & Location */}
          <div className="space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-extrabold text-stone-900">
                  {creator.name}
                </h1>
                <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-bold text-pink-800">
                  {creator.category}
                </span>

                {/* Rating Badge Button */}
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors"
                >
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{ratingAvg.toFixed(1)}</span>
                  <span className="text-stone-500 font-normal">({ratingCount} avaliações)</span>
                </button>
              </div>
              <p className="text-xs font-semibold text-stone-400">
                @{creator.username}
              </p>
            </div>

            <p className="text-sm text-stone-700 max-w-2xl leading-relaxed">
              {creator.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1 text-stone-700 font-medium">
                <MapPin className="h-3.5 w-3.5 text-pink-500" />
                {creator.location}
              </span>
              <span>·</span>
              <span className="text-pink-700 font-semibold">
                Pagamentos aceites: M-Pesa 🇲🇿, e-Mola, mKesh
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 border-y border-stone-100 py-4 text-center min-[390px]:grid-cols-3 sm:grid-cols-5 sm:gap-4 sm:text-left">
            <div>
              <span className="block font-display text-lg font-black text-stone-900">
                {creator.postsCount}
              </span>
              <span className="text-xs text-stone-400">Publicações</span>
            </div>

            <div>
              <span className="block font-display text-lg font-black text-stone-900">
                {(creator.followersCount / 1000).toFixed(1)}k
              </span>
              <span className="text-xs text-stone-400">Seguidores</span>
            </div>

            <div>
              <span className="block font-display text-lg font-black text-pink-600">
                {(creator.subscribersCount / 1000).toFixed(1)}k
              </span>
              <span className="text-xs text-stone-400">Subscritores VIP</span>
            </div>

            <div>
              <span className="block font-display text-lg font-black text-amber-600 flex items-center justify-center sm:justify-start gap-1">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                {ratingAvg.toFixed(1)}
              </span>
              <span className="text-xs text-stone-400">Classificação Média</span>
            </div>

            <div className="hidden sm:block">
              <span className="block font-display text-lg font-black text-rose-600">
                {creator.liveRatingAverage ? `${creator.liveRatingAverage.toFixed(1)} ★` : '4.9 ★'}
              </span>
              <span className="text-xs text-stone-400">Nota das Lives 🔴</span>
            </div>
          </div>

          {/* VIP Subscription Promo Box */}
          {!creator.isSubscribed && (
            <div className="rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-white border border-pink-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-pink-800">
                  <Sparkles className="h-4 w-4 text-pink-600" />
                  <span>Benefícios da Subscrição VIP a @{creator.username}</span>
                </div>
                <ul className="text-xs text-stone-600 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                  <li className="flex items-center gap-1.5">✓ Acesso a todas as publicações privadas</li>
                  <li className="flex items-center gap-1.5">✓ Mensagens diretas prioritárias</li>
                  <li className="flex items-center gap-1.5">✓ Acesso prioritário a Lives Exclusivas</li>
                  <li className="flex items-center gap-1.5">✓ Descontos em conteúdos pagos avulsos</li>
                </ul>
              </div>

              <button
                onClick={() => onOpenSubscribeModal(creator.id)}
                className="whitespace-nowrap rounded-full bg-pink-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:bg-pink-700 transition-all"
              >
                Subscrever — {creator.subscriptionPriceMonthly} MT/mês
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Tabs & View Switcher */}
      <div className="flex min-w-0 flex-col gap-2 border-b border-pink-100 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-pink-50 hover:text-pink-700'
            }`}
          >
            Todas ({creatorPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('exclusive')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'exclusive'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-pink-50 hover:text-pink-700'
            }`}
          >
            🔒 Exclusivos VIP
          </button>

          <button
            onClick={() => setActiveTab('ppv')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'ppv'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-pink-50 hover:text-pink-700'
            }`}
          >
            💰 Loja / PPV
          </button>

          {/* NEW: Reviews & Stars Tab */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-stone-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${activeTab === 'reviews' ? 'fill-white' : 'fill-amber-400 text-amber-400'}`} />
            <span>Avaliações & Estrelas ({creatorReviews.length || ratingCount})</span>
          </button>

          {/* NEW: Lives Tab */}
          {creatorLiveSessions.length > 0 && (
            <button
              onClick={() => setActiveTab('lives')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'lives'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <Radio className="h-3.5 w-3.5 text-rose-500" />
              <span>Transmissões ao Vivo ({creatorLiveSessions.length})</span>
            </button>
          )}
        </div>

        {activeTab !== 'reviews' && activeTab !== 'lives' && (
          <div className="hidden sm:flex items-center gap-1 border border-stone-200 rounded-full p-0.5 bg-white">
            <button
              onClick={() => setViewMode('feed')}
              className={`p-1.5 rounded-full ${viewMode === 'feed' ? 'bg-pink-50 text-pink-600' : 'text-stone-400'}`}
              title="Vista de Feed"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-pink-50 text-pink-600' : 'text-stone-400'}`}
              title="Vista de Grelha"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* RENDER TAB CONTENT */}
      {activeTab === 'reviews' ? (
        <div className="space-y-6">
          
          {/* Top Scorecard Summary */}
          <div className="rounded-3xl bg-white border border-pink-100 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Overall Score */}
              <div className="text-center md:border-r border-stone-100 md:pr-6 space-y-2">
                <span className="font-display text-5xl font-black text-stone-900">
                  {ratingAvg.toFixed(1)}
                </span>
                
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-5 w-5 ${
                        s <= Math.round(ratingAvg)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs font-semibold text-stone-500">
                  Baseado em <strong>{ratingCount}</strong> avaliações de fãs
                </p>

                <button
                  onClick={() => onOpenRateModal(creator)}
                  className="mt-2 w-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 px-4 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <Star className="h-4 w-4 fill-white" />
                  <span>Deixar a Minha Avaliação</span>
                </button>
              </div>

              {/* Star Distribution Progress Bars */}
              <div className="space-y-2 md:border-r border-stone-100 md:pr-6">
                <h4 className="text-xs font-bold text-stone-700 mb-2">Distribuição de Estrelas</h4>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = breakdown[stars as keyof typeof breakdown] || 0;
                  const percent = Math.round((count / ratingCount) * 100);
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-6 font-bold text-stone-600 text-right">{stars} ★</span>
                      <div className="h-2.5 flex-1 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-10 text-[11px] text-stone-400 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Category Breakdown Averages */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-700">Classificação por Critério</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">📸 Qualidade do Conteúdo</span>
                    <span className="font-bold text-stone-900 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      4.9 / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">💬 Interação & Respostas</span>
                    <span className="font-bold text-stone-900 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      4.8 / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">🔴 Transmissões ao Vivo (Lives)</span>
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                      {creator.liveRatingAverage ? creator.liveRatingAverage.toFixed(1) : '5.0'} / 5.0
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="rounded-xl bg-pink-50 p-2.5 text-[11px] text-pink-800 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-pink-600 shrink-0" />
                    <span>Todas as avaliações passam por verificação de autenticidade no M-Pesa.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Filter Pills for Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setReviewFilter('all')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  reviewFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                Todas ({creatorReviews.length})
              </button>

              <button
                onClick={() => setReviewFilter('lives')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1 ${
                  reviewFilter === 'lives'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
                }`}
              >
                <Radio className="h-3 w-3" />
                <span>Avaliações de Lives 🔴</span>
              </button>

              <button
                onClick={() => setReviewFilter('vip')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  reviewFilter === 'vip'
                    ? 'bg-pink-600 text-white'
                    : 'bg-white border border-pink-200 text-pink-700 hover:bg-pink-50'
                }`}
              >
                Subscritores VIP 👑
              </button>

              <button
                onClick={() => setReviewFilter('5stars')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                  reviewFilter === '5stars'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
                }`}
              >
                5 Estrelas ★
              </button>
            </div>

            <button
              onClick={() => onOpenRateModal(creator)}
              className="text-xs font-bold text-pink-600 hover:underline flex items-center gap-1"
            >
              + Escrever Crítica
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-200 bg-white p-10 text-center space-y-3">
                <Star className="mx-auto h-8 w-8 text-amber-400 fill-amber-400" />
                <p className="font-display text-sm font-bold text-stone-700">
                  Ainda não há avaliações neste filtro
                </p>
                <p className="text-xs text-stone-400">
                  Sê o primeiro a avaliar as transmissões ou perfil deste criador!
                </p>
                <button
                  onClick={() => onOpenRateModal(creator)}
                  className="rounded-full bg-pink-600 px-5 py-2 text-xs font-bold text-white shadow hover:bg-pink-700"
                >
                  Avaliar Agora
                </button>
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-3xl border border-stone-100 bg-white p-5 sm:p-6 shadow-sm space-y-3.5 hover:border-pink-200 transition-colors"
                >
                  {/* Top: User info + Star rating */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="h-10 w-10 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">{rev.userName}</span>
                          {rev.userBadge && (
                            <span className="rounded-full bg-pink-100 px-2 py-0.2 text-[10px] font-bold text-pink-700">
                              {rev.userBadge}
                            </span>
                          )}
                          {rev.isVerifiedSubscriber && (
                            <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800 flex items-center gap-0.5">
                              <CheckCircle className="h-2.5 w-2.5 fill-emerald-600 text-white" />
                              Verificado
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400">@{rev.userHandle} · {rev.createdAt}</span>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-900 ml-1">{rev.rating}.0</span>
                    </div>
                  </div>

                  {/* If this review is for a Live Stream */}
                  {rev.liveTitle && (
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-800">
                      <Radio className="h-3 w-3 text-rose-600 animate-pulse" />
                      <span>Avaliação da Live: {rev.liveTitle}</span>
                    </div>
                  )}

                  {/* Title & Comment */}
                  <div className="space-y-1">
                    {rev.title && (
                      <h4 className="text-xs font-bold text-stone-900">
                        "{rev.title}"
                      </h4>
                    )}
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>

                  {/* Tags */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer: Helpful Reaction */}
                  <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs text-stone-400">
                    <button
                      onClick={() => onLikeReview && onLikeReview(rev.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors ${
                        rev.isLiked ? 'text-pink-600' : 'text-stone-500 hover:text-pink-600'
                      }`}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 ${rev.isLiked ? 'fill-pink-600' : ''}`} />
                      <span>Útil ({rev.likesCount})</span>
                    </button>

                    <span className="text-[11px] text-stone-400">Moçambique 🇲🇿</span>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      ) : activeTab === 'lives' ? (
        /* LIVES TAB */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-stone-900 flex items-center gap-2">
              <Radio className="h-4 w-4 text-rose-600" />
              <span>Transmissões ao Vivo de @{creator.username}</span>
            </h3>
            <span className="text-xs text-stone-400">
              {creatorLiveSessions.length} transmissões
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {creatorLiveSessions.map((session) => (
              <div
                key={session.id}
                className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-40 w-full bg-stone-900">
                  <img
                    src={session.coverImage}
                    alt={session.title}
                    className="h-full w-full object-cover opacity-90"
                  />
                  {session.isLive ? (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-[10px] font-extrabold text-white animate-pulse">
                      <Radio className="h-3 w-3" />
                      <span>AO VIVO AGORA</span>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      {session.scheduledTime || 'Gravada'}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-md">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{session.ratingAverage.toFixed(1)}</span>
                      <span className="text-stone-300">({session.ratingCount} votos)</span>
                    </div>

                    {session.ticketPriceMT && (
                      <span className="bg-pink-600 px-2.5 py-1 rounded-full font-bold shadow">
                        {session.ticketPriceMT} MT
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">{session.title}</h4>
                    {session.description && (
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{session.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => onOpenLiveRoom && onOpenLiveRoom(session)}
                      className="flex-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-2 text-xs font-bold text-white shadow hover:scale-[1.02] transition-all text-center"
                    >
                      {session.isLive ? 'Assistir Live Agora 🔴' : 'Ver Detalhes'}
                    </button>
                    <button
                      onClick={() => onOpenRateModal(creator, session.id)}
                      className="rounded-full border border-amber-300 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                      title="Avaliar esta Live com Estrelas"
                    >
                      <Star className="h-4 w-4 fill-amber-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* POSTS SECTION */
        filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-white p-12 text-center space-y-2">
            <p className="font-display text-sm font-bold text-stone-700">
              Nenhuma publicação encontrada nesta categoria
            </p>
            <p className="text-xs text-stone-400">
              @{creator.username} ainda não adicionou publicações com este filtro.
            </p>
          </div>
        ) : viewMode === 'feed' ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onLikePost}
                onSave={onSavePost}
                onAddComment={onAddComment}
                onOpenSubscribeModal={onOpenSubscribeModal}
                onOpenPpvUnlockModal={onOpenPpvUnlockModal}
                onOpenTipModal={onOpenTipModal}
                onSelectCreatorProfile={() => {}}
                onReportPost={onReportPost}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setViewMode('feed')}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt={post.caption}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
                {post.visibility === 'subscriber' && (
                  <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-md">
                    <Lock className="h-3.5 w-3.5 text-pink-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
};

