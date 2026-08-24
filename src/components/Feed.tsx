import React, { useState } from 'react';
import { PageContainer } from './ui/PageContainer';
import { StoriesReel } from './StoriesReel';
import { PostCard } from './PostCard';
import { Post, Story, CreatorProfile, AuthUser } from '../types';
import { 
  Sparkles, 
  Flame, 
  Lock, 
  Users, 
  TrendingUp, 
  Compass, 
  ShieldCheck, 
  CheckCircle,
  PlusCircle,
  Coins,
  LogOut,
  User as UserIcon
} from 'lucide-react';

interface FeedProps {
  posts: Post[];
  stories: Story[];
  creators: CreatorProfile[];
  currentUser?: AuthUser | null;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onSelectStory: (index: number) => void;
  onOpenCreateStory: () => void;
  onOpenCreateModal: () => void;
  onOpenSubscribeModal: (creatorId: string) => void;
  onOpenPpvUnlockModal: (post: Post) => void;
  onOpenTipModal: (creatorId: string, creatorName: string) => void;
  onSelectCreatorProfile: (creatorId: string) => void;
  onReportPost: (post: Post) => void;
  onOpenKycModal: () => void;
  onOpenWallet: () => void;
  onLogout?: () => void;
  walletBalanceMT: number;
}

export const Feed: React.FC<FeedProps> = ({
  posts = [],
  stories = [],
  creators = [],
  currentUser,
  onLikePost,
  onSavePost,
  onAddComment,
  onSelectStory,
  onOpenCreateStory,
  onOpenCreateModal,
  onOpenSubscribeModal,
  onOpenPpvUnlockModal,
  onOpenTipModal,
  onSelectCreatorProfile,
  onReportPost,
  onOpenKycModal,
  onOpenWallet,
  onLogout,
  walletBalanceMT = 0,
}) => {
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'exclusive' | 'trending'>('all');

  // Filter posts according to active tab
  const filteredPosts = (posts || []).filter((p) => {
    if (feedFilter === 'exclusive') return p.visibility === 'subscriber' || p.visibility === 'ppv';
    if (feedFilter === 'following') return true; // mock all
    if (feedFilter === 'trending') return (p.likesCount || 0) > 500;
    return true;
  });

  return (
    <PageContainer width="wide" className="py-4 sm:py-6">
      <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-12">
        
        {/* Main Feed Column (8 cols on desktop) */}
        <div className="mx-auto w-full max-w-[45rem] space-y-4 sm:space-y-6 lg:col-span-8 lg:mx-0 lg:max-w-none">
          
          {/* Stories Bar */}
          <StoriesReel
            stories={stories}
            onSelectStory={onSelectStory}
            onOpenCreateStory={onOpenCreateStory}
          />

          {/* Feed Filter Tabs */}
          <div className="flex items-center justify-between border-b border-pink-100 pb-2">
            <div className="flex snap-x snap-mandatory items-center gap-1 overflow-x-auto overscroll-x-contain scrollbar-none sm:gap-2">
              <button
                onClick={() => setFeedFilter('all')}
                className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                  feedFilter === 'all'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                    : 'bg-white text-stone-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Para Ti</span>
              </button>

              <button
                onClick={() => setFeedFilter('exclusive')}
                className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                  feedFilter === 'exclusive'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                    : 'bg-white text-stone-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Exclusivos VIP</span>
              </button>

              <button
                onClick={() => setFeedFilter('trending')}
                className={`flex min-h-11 shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
                  feedFilter === 'trending'
                    ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20'
                    : 'bg-white text-stone-600 hover:bg-pink-50 hover:text-pink-700'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Tendências 🇲🇿</span>
              </button>
            </div>

            <button
              onClick={onOpenCreateModal}
              className="hidden min-h-11 items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/70 px-3 py-2 text-xs font-bold text-pink-700 transition-colors hover:bg-pink-100 sm:flex"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Publicar</span>
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-4 sm:space-y-6">
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
                onSelectCreatorProfile={onSelectCreatorProfile}
                onReportPost={onReportPost}
              />
            ))}
          </div>

        </div>

        {/* Right Sidebar (4 cols on desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          
          {/* User Account Info Bar (if logged in) */}
          {currentUser && (
            <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-500/30 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-stone-400 truncate">@{currentUser.username}</p>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors flex-shrink-0"
                  title="Sair da Conta (Logout)"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sair</span>
                </button>
              )}
            </div>
          )}

          {/* Quick Wallet Summary Card */}
          <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-800">
                Carteira FanScale 🇲🇿
              </span>
              <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                M-Pesa · e-Mola
              </span>
            </div>

            <div className="mb-4">
              <span className="text-xs text-stone-500">Saldo Disponível</span>
              <div className="font-display text-2xl font-black text-stone-900">
                {(walletBalanceMT ?? 0).toLocaleString('pt-MZ')} <span className="text-pink-600 text-lg">MT</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onOpenWallet}
                className="flex-1 rounded-full bg-pink-600 py-2 text-center text-xs font-bold text-white hover:bg-pink-700 transition-colors shadow-sm shadow-pink-500/20"
              >
                + Carregar Saldo
              </button>
              <button
                onClick={onOpenWallet}
                className="rounded-full border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Histórico
              </button>
            </div>
          </div>

          {/* Featured Mozambican Creators Spotlight */}
          <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-stone-900">
                Criadores em Destaque 🇲🇿
              </h3>
              <span className="text-[11px] font-semibold text-pink-600 hover:underline cursor-pointer">
                Ver todos
              </span>
            </div>

            <div className="space-y-3.5">
              {(creators || []).slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <div 
                    onClick={() => onSelectCreatorProfile(c.id)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-500/20 group-hover:ring-pink-500 transition-all"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-stone-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                          {c.name}
                        </span>
                        {c.verified && (
                          <CheckCircle className="h-3 w-3 fill-pink-600 text-white flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {c.category} · {c.subscriptionPriceMonthly} MT/mês
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenSubscribeModal(c.id)}
                    className="rounded-full bg-pink-50 px-3 py-1.5 text-[11px] font-bold text-pink-700 hover:bg-pink-600 hover:text-white transition-colors"
                  >
                    Subscrever
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Become a Creator Banner */}
          <div className="rounded-3xl bg-stone-900 p-5 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold">
              <Sparkles className="h-4 w-4" />
              <span>Ganha em Meticais</span>
            </div>
            <h4 className="font-display text-base font-bold text-white">
              Tens uma audiência em Moçambique?
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Monetiza o teu conteúdo com subscrições mensais pagas diretamente no teu M-Pesa ou e-Mola.
            </p>
            <button
              onClick={onOpenKycModal}
              className="w-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/30 hover:from-pink-700 hover:to-rose-600 transition-all"
            >
              Criar Conta de Criador
            </button>
          </div>

          {/* Trending Hashtags */}
          <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-display text-sm font-bold text-stone-900">
              Hashtags Populares 🇲🇿
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                '#MozCreators',
                '#MaputoVibes',
                '#MarrabentaViva',
                '#ModaMoçambique',
                '#MatapaGourmet',
                '#BeiraFit',
                '#NampulaComedy'
              ].map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-stone-50 px-3 py-1.5 text-[11px] font-semibold text-stone-700 hover:bg-pink-50 hover:text-pink-700 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="px-2 text-[11px] text-stone-400 space-y-1">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="hover:underline cursor-pointer">Termos de Utilização</span>
              <span className="hover:underline cursor-pointer">Privacidade</span>
              <span className="hover:underline cursor-pointer">Segurança & Moderação</span>
              <span className="hover:underline cursor-pointer">Suporte M-Pesa</span>
            </div>
            <p>© 2026 FanScale Moçambique. Todos os direitos reservados.</p>
          </div>

        </div>

      </div>
    </PageContainer>
  );
};
