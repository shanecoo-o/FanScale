import React, { useState } from 'react';
import { 
  Star, 
  X, 
  Sparkles, 
  Radio, 
  Heart, 
  MessageSquare, 
  CheckCircle, 
  ShieldCheck, 
  Video,
  Flame,
  ThumbsUp
} from 'lucide-react';
import { CreatorProfile, CreatorReview, LiveSession } from '../types';
import confetti from 'canvas-confetti';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface RateCreatorModalProps {
  creator: CreatorProfile;
  liveSessions?: LiveSession[];
  selectedLiveId?: string;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    creatorId: string;
    rating: number;
    categories: {
      contentQuality: number;
      interaction: number;
      livePerformance: number;
    };
    title: string;
    comment: string;
    liveId?: string;
    liveTitle?: string;
    tags: string[];
  }) => void;
}

const COMPLIMENT_TAGS = [
  'Lives Incríveis 🔥',
  'Responde no Chat 💬',
  'Super Carismática ✨',
  'Qualidade HD 🎥',
  'Pontual ⏰',
  'Vale Cada Metical 🇲🇿',
  'Conteúdo Exclusivo Top 👑',
  'Muito Atenciosa ❤️',
  'Treinos Motivantes 💪',
  'Super Divertida 😂',
  'Voz Espetacular 🎵'
];

export const RateCreatorModal: React.FC<RateCreatorModalProps> = ({
  creator,
  liveSessions = [],
  selectedLiveId,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  // Category sub-ratings
  const [contentQuality, setContentQuality] = useState<number>(5);
  const [interaction, setInteraction] = useState<number>(5);
  const [livePerformance, setLivePerformance] = useState<number>(5);

  // Live session selection
  const [targetType, setTargetType] = useState<'profile' | 'live'>(selectedLiveId ? 'live' : 'profile');
  const [chosenLiveId, setChosenLiveId] = useState<string>(selectedLiveId || (liveSessions[0]?.id ?? ''));

  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Lives Incríveis 🔥', 'Vale Cada Metical 🇲🇿']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5: return '🌟 Experiência Incrível (5/5)';
      case 4: return '👍 Muito Bom (4/5)';
      case 3: return '👌 Bom / Regular (3/5)';
      case 2: return '😕 Abaixo do Esperado (2/5)';
      case 1: return '😞 Precisa Melhorar (1/5)';
      default: return 'Escolhe a tua nota';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    const targetLive = targetType === 'live' ? liveSessions.find((l) => l.id === chosenLiveId) : undefined;

    setTimeout(() => {
      onSubmitReview({
        creatorId: creator.id,
        rating,
        categories: {
          contentQuality,
          interaction,
          livePerformance,
        },
        title: title.trim() || (rating >= 4 ? 'Excelente criador(a)!' : 'A minha avaliação'),
        comment: comment.trim() || 'Criador(a) muito recomendado(a) na plataforma FanScale Moçambique!',
        liveId: targetLive?.id,
        liveTitle: targetLive?.title,
        tags: selectedTags,
      });

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#F43F5E', '#FBBF24']
      });

      onClose();
    }, 600);
  };

  return (
    <ResponsiveDialog
      ariaLabel={`Avaliar ${creator.name}`}
      onClose={onClose}
      closeOnBackdrop
      panelClassName="max-w-xl rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-pink-100 space-y-5"
    >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="h-12 w-12 rounded-full border-2 border-pink-500 object-cover shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-stone-900 shadow">
                <Star className="h-3 w-3 fill-stone-900" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-stone-900">
                  Avaliar @{creator.username}
                </h3>
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
                  {creator.category}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                A tua opinião ajuda outros fãs a descobrir os melhores talentos de Moçambique 🇲🇿
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            aria-label="Fechar avaliação"
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Target Selector: Profile vs Live Session */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              O que gostarias de avaliar?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetType('profile')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                  targetType === 'profile'
                    ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Perfil Geral do Criador</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('live')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                  targetType === 'live'
                    ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Radio className="h-4 w-4 text-rose-500 animate-pulse" />
                <span>Transmissão ao Vivo (Live) 🔴</span>
              </button>
            </div>
          </div>

          {/* Live Selector if targetType === 'live' */}
          {targetType === 'live' && (
            <div className="space-y-1.5 rounded-2xl bg-rose-50/70 border border-rose-100 p-3.5">
              <label className="block text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-rose-600" />
                Seleciona a Transmissão ao Vivo que assististe:
              </label>
              <select
                value={chosenLiveId}
                onChange={(e) => setChosenLiveId(e.target.value)}
                className="w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs font-semibold text-stone-900 focus:border-rose-500 focus:outline-none"
              >
                {liveSessions.map((live) => (
                  <option key={live.id} value={live.id}>
                    {live.isLive ? '🔴 AO VIVO AGORA: ' : 'Gravada: '} {live.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Main Star Selector */}
          <div className="rounded-3xl bg-gradient-to-b from-pink-50/60 to-white border border-pink-100 p-5 text-center space-y-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Classificação Geral com Estrelas
            </span>
            
            {/* Stars Row */}
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`Dar ${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`h-9 w-9 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-pink-700">
              {getRatingLabel(hoverRating || rating)}
            </div>
          </div>

          {/* Granular Sub-Category Ratings */}
          <div className="space-y-3 rounded-2xl bg-stone-50 p-4 border border-stone-200/80">
            <h4 className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>Avaliação por Categorias Específicas</span>
              <span className="text-[10px] text-stone-400 font-normal">Opcional</span>
            </h4>

            {/* Content Quality */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium">📸 Qualidade do Conteúdo / Fotos:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setContentQuality(s)}
                    aria-label={`Qualidade do conteúdo: ${s} de 5`}
                    className="p-0.5"
                  >
                    <Star className={`h-4 w-4 ${contentQuality >= s ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Interaction & Chat */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium">💬 Interação & Respostas a Mensagens:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setInteraction(s)}
                    aria-label={`Interação: ${s} de 5`}
                    className="p-0.5"
                  >
                    <Star className={`h-4 w-4 ${interaction >= s ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Performance */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 font-medium">🔴 Transmissões ao Vivo (Lives):</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setLivePerformance(s)}
                    aria-label={`Performance em live: ${s} de 5`}
                    className="p-0.5"
                  >
                    <Star className={`h-4 w-4 ${livePerformance >= s ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Compliment Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Elogios Rápidos (Clica para selecionar)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMPLIMENT_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-pink-600 text-white shadow-sm shadow-pink-500/20 scale-105'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">
              Título da tua Avaliação
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: A melhor experiência de lives de Maputo!"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Review Comment */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">
              Comentário Detalhado para a Comunidade
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conta como foi a tua experiência com as publicações, conversas no chat e lives deste criador..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-xs font-normal text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none resize-none"
            />
          </div>

          {/* Verified Subscriber Guarantee */}
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 p-3 text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] leading-tight">
              A tua avaliação será identificada como <strong>Subscritor Verificado</strong> para dar máxima credibilidade na comunidade FanScale.
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-3.5 font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <Star className="h-4 w-4 fill-white" />
            <span>{isSubmitting ? 'A publicar...' : 'Publicar Avaliação com Estrelas'}</span>
          </button>

        </form>
    </ResponsiveDialog>
  );
};
