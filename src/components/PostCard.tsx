import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Coins, 
  Lock, 
  CheckCircle, 
  MoreHorizontal, 
  MapPin, 
  Eye, 
  Send,
  Sparkles,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { Post, CreatorProfile } from '../types';
import confetti from 'canvas-confetti';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenSubscribeModal: (creatorId: string) => void;
  onOpenPpvUnlockModal: (post: Post) => void;
  onOpenTipModal: (creatorId: string, creatorName: string) => void;
  onSelectCreatorProfile: (creatorId: string) => void;
  onReportPost: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onSave,
  onAddComment,
  onOpenSubscribeModal,
  onOpenPpvUnlockModal,
  onOpenTipModal,
  onSelectCreatorProfile,
  onReportPost,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const isLocked = (post.visibility === 'subscriber' || post.visibility === 'ppv') && !post.isUnlocked;

  const handleLikeClick = () => {
    onLike(post.id);
    if (!post.isLiked) {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#EC4899', '#F43F5E', '#FB7185']
      });
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput);
    setCommentInput('');
    setShowComments(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-pink-100/80 bg-white shadow-sm transition-shadow hover:shadow-md sm:rounded-3xl">
      
      {/* Top Bar: Creator Info & Options */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4">
        <div 
          onClick={() => onSelectCreatorProfile(post.creatorId)}
          className="group flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 sm:gap-3"
        >
          <div className="relative">
            <img
              src={post.creator.avatar}
              alt={post.creator.name}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-pink-500/20 group-hover:ring-pink-500 transition-all"
            />
            {post.creator.verified && (
              <CheckCircle className="absolute -bottom-0.5 -right-0.5 h-4 w-4 fill-pink-600 text-white" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate font-display text-xs font-bold text-stone-900 transition-colors group-hover:text-pink-600">
                {post.creator.name}
              </span>
              <span className="hidden truncate text-[11px] font-medium text-stone-400 min-[390px]:inline">
                @{post.creator.username}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-stone-400">
              {post.locationTag && (
                <span className="flex min-w-0 items-center gap-0.5 truncate text-stone-500">
                  <MapPin className="h-3 w-3 text-pink-500" />
                  {post.locationTag}
                </span>
              )}
              <span>·</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Top Right: Badges & Menu */}
        <div className="flex shrink-0 items-center gap-1">
          {post.visibility === 'subscriber' && (
            <span aria-label="Apenas subscritores VIP" className="inline-flex items-center gap-1 rounded-full border border-pink-200/60 bg-pink-50 p-2 text-[10px] font-bold text-pink-700 min-[390px]:px-2.5 min-[390px]:py-1">
              <Lock className="h-3 w-3 text-pink-600" />
              <span className="hidden min-[390px]:inline">Subscritores VIP</span>
            </span>
          )}

          {post.visibility === 'ppv' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800 border border-amber-200">
              <Sparkles className="h-3 w-3 text-amber-600" />
              PPV {post.priceMT} MT
            </span>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Mais opções"
              className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 rounded-2xl border border-pink-100 bg-white p-1.5 shadow-lg shadow-pink-500/10 z-20 text-xs">
                <button
                  onClick={() => {
                    handleShare();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-stone-700 hover:bg-pink-50 hover:text-pink-700"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Copiar Link</span>
                </button>
                <button
                  onClick={() => {
                    onReportPost(post);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-red-600 hover:bg-red-50"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Denunciar Post</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Box (With DRM Watermark, Context Menu Lock & Blur Protection if Locked) */}
      <div 
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-stone-950 overflow-hidden select-none group/media"
      >
        {post.mediaUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={post.caption}
            draggable={false}
            className={`h-full w-full object-cover transition-all duration-300 pointer-events-none ${
              isLocked ? 'blur-2xl scale-110 brightness-75' : ''
            }`}
          />
        ))}

        {/* Dynamic DRM Watermark (Anti-Leak & Screen Recording Deterrent) */}
        {!isLocked && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 opacity-40 hover:opacity-75 transition-opacity">
            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wider">
              <span className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
                FanScale • 18+ Protegido
              </span>
              <span className="bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
                @{post.creator.username}
              </span>
            </div>
            <div className="flex justify-between items-center text-[9px] font-mono text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span className="bg-black/20 px-1.5 py-0.5 rounded">
                DRM Token #{post.id.slice(0, 6)}
              </span>
              <span className="bg-black/20 px-1.5 py-0.5 rounded">
                Moçambique 🇲🇿
              </span>
            </div>
          </div>
        )}

        {/* Locked Overlay for Subscribers / PPV */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 p-4 text-center text-white backdrop-blur-md sm:p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 shadow-xl shadow-pink-500/30 mb-3 animate-pulse-subtle">
              <Lock className="h-7 w-7 text-white" />
            </div>

            <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-pink-300 mb-1 border border-pink-500/30">
              <span>Conteúdo Adulto Exclusivo 18+</span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1">
              {post.visibility === 'ppv' 
                ? 'Conteúdo Pago Individual (PPV)' 
                : 'Conteúdo Exclusivo para Subscritores'}
            </h3>

            <p className="mb-3 max-w-sm text-[11px] leading-snug text-white/80 sm:mb-4 sm:text-xs">
              {post.visibility === 'ppv'
                ? `Desbloqueia esta publicação privada por apenas ${post.priceMT} MT com M-Pesa, e-Mola ou a tua Carteira FanScale.`
                : `Junta-te aos subscritores VIP de @${post.creator.username} por ${post.creator.subscriptionPriceMonthly} MT/mês e desbloqueia todas as publicações privadas.`}
            </p>

            {post.visibility === 'ppv' ? (
              <button
                onClick={() => onOpenPpvUnlockModal(post)}
                className="flex min-h-11 max-w-full items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:from-pink-700 hover:to-rose-600 active:scale-95 sm:px-6"
              >
                <Sparkles className="h-4 w-4" />
                <span>Desbloquear Conteúdo ({post.priceMT} MT)</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenSubscribeModal(post.creatorId)}
                className="flex min-h-11 max-w-full items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:from-pink-700 hover:to-rose-600 active:scale-95 sm:px-6"
              >
                <Lock className="h-4 w-4" />
                <span>Subscrever por {post.creator.subscriptionPriceMonthly} MT/mês</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="space-y-3 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          
          {/* Left: Like, Comment, Share, Tip */}
          <div className="flex min-w-0 items-center gap-0.5 sm:gap-2">
            
            {/* Gostar */}
            <button
              onClick={handleLikeClick}
              className={`flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition-all sm:px-3 ${
                post.isLiked
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-pink-600 text-pink-600 scale-110' : ''}`} />
              <span>{post.likesCount}</span>
            </button>

            {/* Comentar */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:px-3"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.commentsCount}</span>
            </button>

            {/* Partilhar */}
            <button
              onClick={handleShare}
              aria-label="Partilhar post"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              <Share2 className="h-4 w-4" />
              {copiedShare && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-stone-900 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap">
                  Link copiado!
                </span>
              )}
            </button>

            {/* Dar Gorjeta (Tip) */}
            <button
              onClick={() => onOpenTipModal(post.creatorId, post.creator.name)}
              className="flex min-h-11 items-center gap-1 rounded-full border border-pink-200/70 bg-pink-50 px-2.5 py-2 text-xs font-bold text-pink-700 transition-colors hover:bg-pink-100 sm:gap-1.5 sm:px-3"
              title="Dar Gorjeta via M-Pesa ou Carteira"
            >
              <Coins className="h-3.5 w-3.5 text-pink-600" />
              <span>Gorjeta</span>
            </button>
          </div>

          {/* Right: Guardar / Views */}
          <div className="flex items-center gap-2 text-stone-400">
            <button
              onClick={() => onSave(post.id)}
              aria-label="Guardar post"
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                post.isSaved
                  ? 'text-pink-600 bg-pink-50'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-pink-600' : ''}`} />
            </button>
          </div>

        </div>

        {/* Gorjetas e Visualizações Bar */}
        {post.tipsTotalMT > 0 && (
          <div className="flex flex-col items-start gap-1 rounded-xl border border-pink-100 bg-pink-50/70 px-3 py-2 text-[11px] font-semibold text-pink-800 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-pink-600 fill-pink-600" />
              Fãs apoiaram este post com <strong>{post.tipsTotalMT} MT</strong> em gorjetas
            </span>
            <span className="text-stone-400 font-normal">
              {post.viewsCount.toLocaleString('pt-MZ')} visualizações
            </span>
          </div>
        )}

        {/* Caption & Hashtags */}
        <div className="space-y-1.5 text-xs text-stone-800 leading-relaxed">
          <p>
            <span 
              onClick={() => onSelectCreatorProfile(post.creatorId)}
              className="font-bold text-stone-900 mr-2 cursor-pointer hover:text-pink-600 transition-colors"
            >
              @{post.creator.username}
            </span>
            {post.caption}
          </p>

          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {post.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="font-semibold text-pink-600 hover:text-pink-700 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-2 border-t border-stone-100 space-y-3">
            
            {/* List of comments */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {post.comments.length === 0 ? (
                <p className="text-center text-xs text-stone-400 py-2">
                  Ainda sem comentários. Sê o primeiro a apoiar este criador!
                </p>
              ) : (
                post.comments.map((cm) => (
                  <div key={cm.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={cm.userAvatar}
                      alt={cm.userName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <div className="flex-1 rounded-2xl bg-stone-50 p-2.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-stone-900 text-[11px]">
                          {cm.userName}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {cm.createdAt}
                        </span>
                      </div>
                      <p className="text-stone-700 text-xs">
                        {cm.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Escreve um comentário de apoio..."
                className="min-h-11 min-w-0 flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                aria-label="Enviar comentário"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-600 text-white transition-all hover:bg-pink-700 disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>
    </article>
  );
};
