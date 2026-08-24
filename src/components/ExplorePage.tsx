import React, { useState } from 'react';
import { PageContainer } from './ui/PageContainer';
import { 
  Search, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  MapPin, 
  Lock, 
  Heart, 
  MessageCircle, 
  UserPlus,
  Compass,
  Star,
  Radio,
  Video,
  Award
} from 'lucide-react';
import { CreatorProfile, Post, LiveSession } from '../types';
import { CATEGORIES } from '../data/mockData';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface ExplorePageProps {
  creators: CreatorProfile[];
  posts: Post[];
  liveSessions?: LiveSession[];
  onSelectCreator: (creatorId: string) => void;
  onOpenSubscribeModal: (creatorId: string) => void;
  onOpenPpvUnlockModal: (post: Post) => void;
  onLikePost: (postId: string) => void;
  onOpenLiveRoom?: (session: LiveSession) => void;
  onOpenRateModal?: (creator: CreatorProfile, liveId?: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  creators,
  posts,
  liveSessions = [],
  onSelectCreator,
  onOpenSubscribeModal,
  onOpenPpvUnlockModal,
  onLikePost,
  onOpenLiveRoom,
  onOpenRateModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostPreview, setSelectedPostPreview] = useState<Post | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'top_rated' | 'subscribers' | 'price_low'>('featured');

  // Filter creators
  let filteredCreators = creators.filter((c) => {
    const matchesCategory = selectedCategory === 'Todos' || c.category === selectedCategory;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort creators
  filteredCreators = [...filteredCreators].sort((a, b) => {
    if (sortBy === 'top_rated') {
      return (b.ratingAverage || 4.5) - (a.ratingAverage || 4.5);
    }
    if (sortBy === 'subscribers') {
      return b.subscribersCount - a.subscribersCount;
    }
    if (sortBy === 'price_low') {
      return a.subscriptionPriceMonthly - b.subscriptionPriceMonthly;
    }
    return 0; // default featured
  });

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch = 
      p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hashtags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <PageContainer width="wide" className="space-y-6 py-4 sm:space-y-8 sm:py-6">
      
      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 p-4 text-white shadow-xl shadow-pink-500/20 sm:rounded-3xl sm:p-10">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            <Compass className="h-3.5 w-3.5" />
            <span>Descobre Moçambique 🇲🇿</span>
          </div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-white min-[390px]:text-2xl sm:text-4xl">
            Explora os Melhores Criadores Moçambicanos
          </h1>
          <p className="text-xs sm:text-sm text-white/90">
            Descobre talentos de Maputo, Beira, Nampula e Inhambane. Consulta avaliações com estrelas reais e assiste a transmissões ao vivo.
          </p>

          {/* Search Box */}
          <div className="relative pt-2">
            <Search className="absolute left-4 top-5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, categoria, marrabenta, capulana..."
              className="min-h-11 w-full rounded-2xl border-none bg-white py-3 pl-11 pr-4 text-xs text-stone-900 shadow-lg placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-white/30 sm:text-sm"
            />
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-10 h-32 w-32 rounded-full bg-pink-400/20 blur-xl pointer-events-none" />
      </div>

      {/* Category Pills Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-stone-900">
            Categorias de Conteúdo
          </h2>
          <span className="text-xs text-stone-400">
            {CATEGORIES.length - 1} Categorias
          </span>
        </div>

        <div className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-11 shrink-0 snap-start rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20 scale-105'
                  : 'border border-pink-100 bg-white text-stone-600 hover:border-pink-300 hover:bg-pink-50/50 hover:text-pink-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LIVE SESSIONS SHOWCASE */}
      {liveSessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
              </span>
              <h2 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Transmissões ao Vivo em Moçambique</span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
                  Lives 🔴
                </span>
              </h2>
            </div>
            <span className="text-xs font-semibold text-rose-600">
              {liveSessions.filter(l => l.isLive).length} ao vivo agora
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:border-pink-200 hover:shadow-lg sm:rounded-3xl"
              >
                <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                  <img
                    src={session.coverImage}
                    alt={session.title}
                    className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Badges Top */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    {session.isLive ? (
                      <span className="flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white animate-pulse">
                        <Radio className="h-3 w-3" /> AO VIVO
                      </span>
                    ) : (
                      <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                        {session.scheduledTime || 'Agendada'}
                      </span>
                    )}

                    <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      {session.category}
                    </span>
                  </div>

                  {/* Stars on Live overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1 bg-black/60 px-2.5 py-0.8 rounded-full backdrop-blur-md border border-white/10">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-amber-400">{session.ratingAverage.toFixed(1)}</span>
                      <span className="text-[10px] text-stone-300">({session.ratingCount})</span>
                    </div>

                    {session.isLive && (
                      <span className="text-[10px] font-bold text-rose-300">
                        {session.viewersCount} a assistir
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div 
                      onClick={() => onSelectCreator(session.creatorId)}
                      className="flex items-center gap-2 cursor-pointer group-hover:text-pink-600"
                    >
                      <img
                        src={session.creatorAvatar}
                        alt={session.creatorName}
                        className="h-6 w-6 rounded-full object-cover border border-pink-500"
                      />
                      <span className="text-xs font-bold text-stone-800 line-clamp-1">
                        {session.creatorName}
                      </span>
                    </div>

                    <h3 className="font-display text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                      {session.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => onOpenLiveRoom && onOpenLiveRoom(session)}
                      className="flex-1 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-2 text-xs font-bold text-white shadow hover:scale-[1.02] transition-all text-center"
                    >
                      {session.isLive ? 'Assistir Agora 🔴' : 'Aceder à Sala'}
                    </button>
                    {onOpenRateModal && (
                      <button
                        onClick={() => {
                          const cr = creators.find(c => c.id === session.creatorId);
                          if (cr) onOpenRateModal(cr, session.id);
                        }}
                        className="rounded-full border border-amber-300 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100 transition-colors"
                        title="Avaliar esta Live com Estrelas"
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Creators Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-pink-600 fill-pink-600" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              Criadores Moçambicanos em Destaque
            </h2>
          </div>

          {/* Sort Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 mr-1 hidden sm:inline">Ordenar:</span>
            <button
              onClick={() => setSortBy('featured')}
              className={`rounded-full px-3 py-1 font-bold transition-all ${
                sortBy === 'featured'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Em Destaque
            </button>

            <button
              onClick={() => setSortBy('top_rated')}
              className={`rounded-full px-3 py-1 font-bold transition-all flex items-center gap-1 ${
                sortBy === 'top_rated'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <Star className="h-3 w-3 fill-amber-400" />
              <span>Melhor Avaliados ⭐</span>
            </button>

            <button
              onClick={() => setSortBy('subscribers')}
              className={`rounded-full px-3 py-1 font-bold transition-all ${
                sortBy === 'subscribers'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Mais VIPs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCreators.map((creator) => {
            const ratingAvg = creator.ratingAverage || 4.9;
            const ratingCount = creator.ratingCount || 140;

            return (
              <div
                key={creator.id}
                className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Cover Image */}
                <div className="relative h-28 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={creator.coverImage}
                    alt={creator.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                    {creator.category}
                  </div>

                  {creator.isLive && (
                    <div className="absolute top-2 left-2 rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-black text-white animate-pulse">
                      🔴 AO VIVO
                    </div>
                  )}
                </div>

                {/* Creator Card Body */}
                <div className="p-4 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Avatar (overlapping cover) */}
                    <div className="flex items-end justify-between -mt-8 mb-2">
                      <div 
                        onClick={() => onSelectCreator(creator.id)}
                        className="relative cursor-pointer"
                      >
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="h-16 w-16 rounded-full border-4 border-white object-cover ring-2 ring-pink-500/20 shadow-md"
                        />
                        {creator.verified && (
                          <CheckCircle className="absolute bottom-0 right-0 h-5 w-5 fill-pink-600 text-white" />
                        )}
                      </div>

                      <button
                        onClick={() => onOpenSubscribeModal(creator.id)}
                        className="rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:from-pink-700 hover:to-rose-600 transition-all"
                      >
                        {creator.subscriptionPriceMonthly} MT/mês
                      </button>
                    </div>

                    {/* Name, Handle and Star Rating Badge */}
                    <div className="space-y-1">
                      <div 
                        onClick={() => onSelectCreator(creator.id)}
                        className="cursor-pointer group-hover:text-pink-600 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-display text-sm font-bold text-stone-900">
                            {creator.name}
                          </h3>
                          <p className="text-xs font-medium text-stone-400">
                            @{creator.username}
                          </p>
                        </div>

                        {/* Star Score Pill */}
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold text-amber-900">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{ratingAvg.toFixed(1)}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({ratingCount})</span>
                        </div>
                      </div>

                      <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {creator.bio}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-pink-500" />
                          <span>{creator.location}</span>
                        </div>
                        {creator.liveRatingAverage && (
                          <span className="text-rose-600 font-semibold">
                            Lives {creator.liveRatingAverage.toFixed(1)} ★
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats & Actions */}
                  <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-xs">
                    <div className="flex gap-3 text-stone-500">
                      <span>
                        <strong className="text-stone-900 font-bold">{(creator.followersCount / 1000).toFixed(1)}k</strong> seguidores
                      </span>
                      <span>
                        <strong className="text-stone-900 font-bold">{(creator.subscribersCount / 1000).toFixed(1)}k</strong> VIPs
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenRateModal && (
                        <button
                          onClick={() => onOpenRateModal(creator)}
                          className="rounded-full border border-amber-300 bg-amber-50 p-1.5 text-amber-700 hover:bg-amber-100"
                          title="Avaliar Criador"
                        >
                          <Star className="h-3 w-3 fill-amber-400" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectCreator(creator.id)}
                        className="text-xs font-bold text-pink-600 hover:underline"
                      >
                        Ver Perfil →
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Content Gallery Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-600" />
            <h2 className="font-display text-lg font-bold text-stone-900">
              Conteúdos em Alta no Feed
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            Fotos & Vídeos Populares
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPostPreview(post)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={post.mediaUrls[0]}
                alt={post.caption}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-2 right-2 flex gap-1">
                {post.visibility === 'subscriber' && (
                  <span className="rounded-full bg-black/60 p-1.5 text-white backdrop-blur-md">
                    <Lock className="h-3 w-3 text-pink-400" />
                  </span>
                )}
                {post.visibility === 'ppv' && (
                  <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-amber-300 backdrop-blur-md">
                    {post.priceMT} MT
                  </span>
                )}
              </div>

              {/* Hover overlay with likes and creator name */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                <div className="flex items-center gap-1.5">
                  <img
                    src={post.creator.avatar}
                    alt={post.creator.name}
                    className="h-6 w-6 rounded-full object-cover border border-white"
                  />
                  <span className="text-[11px] font-semibold truncate">
                    @{post.creator.username}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 fill-white" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 fill-white" />
                    {post.commentsCount}
                  </span>
                </div>

                <p className="text-[10px] text-white/80 line-clamp-1">
                  {post.caption}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Quick Post Preview Modal */}
      {selectedPostPreview && (
        <ResponsiveDialog
          ariaLabel="Pré-visualização da publicação"
          onClose={() => setSelectedPostPreview(null)}
          closeOnBackdrop
          panelClassName="relative max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="relative aspect-square sm:aspect-auto bg-stone-900">
                <img
                  src={selectedPostPreview.mediaUrls[0]}
                  alt={selectedPostPreview.caption}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCreator(selectedPostPreview.creatorId);
                        setSelectedPostPreview(null);
                      }}
                      className="flex min-w-0 items-center gap-2 text-left"
                    >
                      <img
                        src={selectedPostPreview.creator.avatar}
                        alt={selectedPostPreview.creator.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <span className="font-bold text-xs text-stone-900 block">
                          {selectedPostPreview.creator.name}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          @{selectedPostPreview.creator.username}
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedPostPreview(null)}
                      aria-label="Fechar pré-visualização"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {selectedPostPreview.caption}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1 text-pink-600 font-bold">
                      <Heart className="h-4 w-4 fill-pink-600" />
                      {selectedPostPreview.likesCount} gostos
                    </span>
                    <span>·</span>
                    <span>{selectedPostPreview.commentsCount} comentários</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  {selectedPostPreview.visibility === 'subscriber' ? (
                    <button
                      onClick={() => {
                        onOpenSubscribeModal(selectedPostPreview.creatorId);
                        setSelectedPostPreview(null);
                      }}
                      className="w-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/20"
                    >
                      Subscrever por {selectedPostPreview.creator.subscriptionPriceMonthly} MT/mês
                    </button>
                  ) : selectedPostPreview.visibility === 'ppv' ? (
                    <button
                      onClick={() => {
                        onOpenPpvUnlockModal(selectedPostPreview);
                        setSelectedPostPreview(null);
                      }}
                      className="w-full rounded-full bg-gradient-to-r from-pink-600 to-rose-500 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-500/20"
                    >
                      Desbloquear Post por {selectedPostPreview.priceMT} MT
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectCreator(selectedPostPreview.creatorId);
                        setSelectedPostPreview(null);
                      }}
                      className="w-full rounded-full border border-pink-500 bg-white py-2.5 text-xs font-bold text-pink-600 hover:bg-pink-50"
                    >
                      Ver Perfil Completo
                    </button>
                  )}
                </div>

              </div>
            </div>
        </ResponsiveDialog>
      )}

    </PageContainer>
  );
};
