import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Radio, 
  Heart, 
  Send, 
  Coins, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  MessageSquare,
  ThumbsUp,
  Flame,
  Award
} from 'lucide-react';
import { LiveSession, CreatorProfile } from '../types';
import confetti from 'canvas-confetti';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface LiveRoomModalProps {
  session: LiveSession;
  creator: CreatorProfile;
  onClose: () => void;
  onOpenTipModal: (creatorId: string, creatorName: string) => void;
  onOpenFullReviewModal: (creator: CreatorProfile, liveId?: string) => void;
  onQuickRateLive: (liveId: string, stars: number) => void;
}

export const LiveRoomModal: React.FC<LiveRoomModalProps> = ({
  session,
  creator,
  onClose,
  onOpenTipModal,
  onOpenFullReviewModal,
  onQuickRateLive,
}) => {
  const [userLiveRating, setUserLiveRating] = useState<number>(5);
  const [hasRatedLive, setHasRatedLive] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; user: string; text: string; isTip?: boolean; tipAmount?: number }>>([
    { id: '1', user: 'Carlos_VIP', text: 'Boa tarde Maputo! Transmissão impecável 🇲🇿' },
    { id: '2', user: 'Marta_G', text: 'Que voz incrível nesta sessão ao vivo ❤️' },
    { id: '3', user: 'Nelson_99', text: 'Enviei 200 MT de gorjeta via M-Pesa!', isTip: true, tipAmount: 200 },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [viewers, setViewers] = useState(session.viewersCount || 340);
  const [heartsCount, setHeartsCount] = useState(1280);

  useEffect(() => {
    const timer = setInterval(() => {
      setViewers((prev) => prev + Math.floor(Math.random() * 5 - 2));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: `chat-${Date.now()}`,
        user: 'Eu (Fã VIP)',
        text: inputMessage.trim(),
      },
    ]);
    setInputMessage('');
  };

  const handleSendHeart = () => {
    setHeartsCount((prev) => prev + 1);
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.85, x: 0.85 },
      colors: ['#EC4899', '#F43F5E', '#FB7185']
    });
  };

  const handleQuickStarSubmit = (stars: number) => {
    setUserLiveRating(stars);
    setHasRatedLive(true);
    onQuickRateLive(session.id, stars);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#EC4899']
    });
  };

  return (
    <ResponsiveDialog
      ariaLabel={`Transmissão ao vivo: ${session.title}`}
      onClose={onClose}
      overlayClassName="p-0 sm:p-4 bg-black/90"
      panelClassName="live-dialog-panel relative flex max-w-4xl flex-col overflow-hidden bg-stone-950 text-white shadow-2xl sm:rounded-3xl sm:border sm:border-stone-800 md:flex-row"
    >
        
        {/* Left Side: Live Video Player Stream Simulation */}
        <div className="relative flex h-[42dvh] min-h-60 shrink-0 items-center justify-center overflow-hidden bg-stone-900 md:h-auto md:min-h-0 md:flex-1">
          <img
            src={session.coverImage}
            alt={session.title}
            className="h-full w-full object-cover opacity-90 scale-105 filter brightness-95"
          />

          {/* Dynamic Anti-piracy DRM overlay */}
          <div className="absolute top-1/3 left-1/4 pointer-events-none opacity-20 text-[10px] font-mono text-white select-none rotate-12">
            FANSCALE-DRM · USER-MOZ-{creator.id}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

          {/* Top Bar inside stream */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Creator Info & Live Badge */}
            <div className="flex items-center gap-2.5 rounded-full bg-black/50 p-1.5 pr-3 backdrop-blur-md border border-white/10">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="h-9 w-9 rounded-full object-cover border border-pink-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">{creator.name}</span>
                  <span className="flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white animate-pulse">
                    <Radio className="h-2.5 w-2.5" /> Live 🔴
                  </span>
                </div>
                <span className="text-[10px] text-pink-300">@{creator.username}</span>
              </div>
            </div>

            {/* Viewers & Close */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                <Users className="h-3.5 w-3.5 text-pink-400" />
                <span>{viewers} espectadores</span>
              </div>

              <button
                onClick={onClose}
                aria-label="Fechar transmissão ao vivo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-white/20 hover:text-white transition-colors backdrop-blur-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Bottom Live Rating Bar (Floating over video) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
            
            {/* Live Title & Average Stars Badge */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white drop-shadow-md line-clamp-1">
                  {session.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{session.ratingAverage.toFixed(1)} / 5.0</span>
                  </div>
                  <span>·</span>
                  <span>{session.ratingCount} avaliações da live</span>
                </div>
              </div>

              {/* Action: Tip */}
              <button
                onClick={() => onOpenTipModal(creator.id, creator.name)}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-pink-500/30 hover:scale-105 transition-all"
              >
                <Coins className="h-3.5 w-3.5" />
                <span>Gorjeta M-Pesa</span>
              </button>
            </div>

            {/* In-Stream Interactive Live Rating Widget */}
            <div className="rounded-2xl bg-black/70 backdrop-blur-md p-3 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex flex-col items-start gap-2 min-[430px]:flex-row min-[430px]:items-center">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-stone-200">
                  {hasRatedLive ? 'A tua avaliação desta Live:' : 'Avalia esta Transmissão ao Vivo:'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleQuickStarSubmit(star)}
                      aria-label={`Avaliar live com ${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                      className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          userLiveRating >= star
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.6)]'
                            : 'text-stone-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {hasRatedLive && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    ✓ Avaliado ({userLiveRating}★)
                  </span>
                )}

                <button
                  onClick={() => onOpenFullReviewModal(creator, session.id)}
                  className="text-[11px] font-bold text-pink-400 hover:text-pink-300 underline ml-1"
                >
                  Escrever crítica →
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Side: Live Chat & Real-Time Fan Reactions */}
        <div className="flex min-h-0 w-full flex-1 flex-col justify-between border-t border-stone-800 bg-stone-900 p-4 md:h-auto md:w-80 md:flex-none md:border-l md:border-t-0">
          
          {/* Live Chat Header */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
              <MessageSquare className="h-4 w-4 text-pink-400" />
              <span>Chat em Direto</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-pink-400 font-bold">
              <Heart className="h-3.5 w-3.5 fill-pink-500" />
              <span>{heartsCount}</span>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-xs scrollbar-none">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`rounded-xl p-2 text-xs ${
                  msg.isTip 
                    ? 'bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/30 text-amber-200' 
                    : 'bg-stone-800/80 text-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-400 text-[11px]">@{msg.user}</span>
                  {msg.isTip && (
                    <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-black text-stone-900">
                      💰 +{msg.tipAmount} MT
                    </span>
                  )}
                </div>
                <p className="mt-0.5 leading-relaxed text-stone-300">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Chat Input & Heart Reactor */}
          <div className="pt-2 border-t border-stone-800 space-y-2">
            <form onSubmit={handleSendChat} className="flex items-center gap-1.5">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Comentar na live..."
                aria-label="Comentar na transmissão ao vivo"
                className="min-w-0 flex-1 rounded-full bg-stone-800 border border-stone-700 px-3.5 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-pink-500"
              />
              <button
                type="submit"
                aria-label="Enviar comentário"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-600 text-white transition-colors hover:bg-pink-700"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleSendHeart}
                aria-label="Enviar coração"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rose-500/40 bg-rose-600/30 text-rose-400 transition-colors hover:bg-rose-600 hover:text-white active:scale-110"
                title="Enviar Coração"
              >
                <Heart className="h-3.5 w-3.5 fill-rose-500" />
              </button>
            </form>
          </div>

        </div>

    </ResponsiveDialog>
  );
};
