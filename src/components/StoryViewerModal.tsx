import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, CheckCircle, Flame, Pause, Play } from 'lucide-react';
import { Story } from '../types';
import confetti from 'canvas-confetti';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onSendStoryReply: (creatorUsername: string, text: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose,
  onSendStoryReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, stories.length, onClose]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendStoryReply(currentStory.creator.username, replyText);
    setReplyText('');
  };

  const handleReaction = () => {
    setIsLiked(true);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#EC4899', '#F43F5E', '#FB7185']
    });
  };

  if (!currentStory) return null;

  return (
    <ResponsiveDialog
      ariaLabel={`Story de ${currentStory.creator.name}`}
      onClose={onClose}
      overlayClassName="p-0 sm:p-4 bg-black/90"
      panelClassName="story-dialog-panel relative flex max-w-md select-none flex-col justify-between overflow-hidden bg-stone-900 shadow-2xl sm:rounded-3xl"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Fechar story"
        className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => setIsPaused((paused) => !paused)}
        aria-label={isPaused ? 'Continuar story' : 'Pausar story'}
        className="absolute left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
      >
        {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
      </button>

        {/* Story Background Image */}
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.creator.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Top Progress Bars */}
        <div className="relative z-20 flex gap-1.5 p-3 sm:pt-4">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all duration-100"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Creator Info Bar */}
        <div className="relative z-20 flex items-center justify-between px-4 py-2 text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.creator.avatar}
              alt={currentStory.creator.name}
              className="h-9 w-9 rounded-full border-2 border-pink-500 object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xs text-white">
                  {currentStory.creator.name}
                </span>
                {currentStory.creator.verified && (
                  <CheckCircle className="h-3.5 w-3.5 fill-pink-500 text-white" />
                )}
              </div>
              <span className="text-[10px] text-white/70">
                {currentStory.createdAt} · Moçambique 🇲🇿
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-pink-600/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
              FanScale
            </span>
          </div>
        </div>

        {/* Tap areas for Prev / Next */}
        <div className="absolute inset-x-0 inset-y-16 z-10 flex">
          <button type="button" aria-label="Story anterior" className="h-full w-1/2" onClick={handlePrev} />
          <button type="button" aria-label="Story seguinte" className="h-full w-1/2" onClick={() => handleNext()} />
        </div>

        {/* Nav arrows on desktop */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Story anterior"
          className={`absolute left-2 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity ${
            currentIndex === 0 ? 'opacity-0' : 'opacity-100 hover:bg-black/60'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => handleNext()}
          aria-label="Story seguinte"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-opacity"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Bottom Caption & Reply Bar */}
        <div className="relative z-20 p-4 space-y-3">
          {currentStory.caption && (
            <p className="text-xs font-medium text-white drop-shadow-md bg-black/30 p-2.5 rounded-xl backdrop-blur-sm">
              {currentStory.caption}
            </p>
          )}

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Enviar mensagem a @${currentStory.creator.username}...`}
              aria-label={`Enviar mensagem a @${currentStory.creator.username}`}
              className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder:text-white/60 focus:border-pink-500 focus:bg-white/20 focus:outline-none backdrop-blur-md"
            />

            <button
              type="button"
              onClick={handleReaction}
              aria-label={isLiked ? 'Story marcado como favorito' : 'Gostar do story'}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-transform active:scale-90 ${
                isLiked ? 'text-pink-500 bg-white' : 'text-white'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>

            {replyText.trim() && (
              <button
                type="submit"
                aria-label="Enviar resposta ao story"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white shadow-md hover:bg-pink-500 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>

    </ResponsiveDialog>
  );
};
