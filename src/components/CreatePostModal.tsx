import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Lock, 
  Sparkles, 
  MapPin, 
  DollarSign, 
  Eye, 
  CheckCircle,
  Video,
  Flame
} from 'lucide-react';
import { PostVisibility, Post } from '../types';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface CreatePostModalProps {
  onClose: () => void;
  onPublishPost: (postData: {
    caption: string;
    mediaUrl: string;
    visibility: PostVisibility;
    priceMT?: number;
    locationTag: string;
    hashtags: string[];
  }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onPublishPost,
}) => {
  const [contentType, setContentType] = useState<'post' | 'story' | 'video' | 'exclusive' | 'ppv'>('post');
  const [visibility, setVisibility] = useState<PostVisibility>('public');
  const [caption, setCaption] = useState('');
  const [locationTag, setLocationTag] = useState('Maputo, Moçambique');
  const [ppvPrice, setPpvPrice] = useState('150');
  
  // Sample media presets
  const sampleMediaOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1080&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1080&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1080&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1080&auto=format&fit=crop&q=85'
  ];
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(sampleMediaOptions[0]);

  const handleContentTypeSelect = (type: 'post' | 'story' | 'video' | 'exclusive' | 'ppv') => {
    setContentType(type);
    if (type === 'exclusive') setVisibility('subscriber');
    else if (type === 'ppv') setVisibility('ppv');
    else setVisibility('public');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    onPublishPost({
      caption,
      mediaUrl: selectedMediaUrl,
      visibility,
      priceMT: visibility === 'ppv' ? parseFloat(ppvPrice) || 150 : undefined,
      locationTag,
      hashtags: ['#FanScale', '#Mozambique', '#CriadoresMZ']
    });

    onClose();
  };

  return (
    <ResponsiveDialog
      ariaLabel="Criar novo conteúdo FanScale"
      onClose={onClose}
      closeOnBackdrop
      overlayClassName="p-0 sm:p-6"
      panelClassName="relative max-w-xl overflow-y-auto rounded-none bg-white shadow-2xl border-pink-100 sm:rounded-3xl sm:border"
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 p-4 sm:p-5 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="font-display text-base font-bold text-stone-900">
              Criar Novo Conteúdo FanScale 🇲🇿
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar criação de conteúdo"
            className="flex h-11 w-11 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handlePublish} className="p-5 sm:p-6 space-y-5 text-stone-800 text-xs">
          
          {/* Content Type Selector */}
          <div className="space-y-1.5">
            <p className="block font-bold text-stone-700">
              Tipo de Publicação
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {[
                { id: 'post', label: 'Publicação', icon: ImageIcon },
                { id: 'story', label: 'Story 24h', icon: Sparkles },
                { id: 'video', label: 'Vídeo', icon: Video },
                { id: 'exclusive', label: 'Exclusivo 🔒', icon: Lock },
                { id: 'ppv', label: 'Pago PPV 💰', icon: DollarSign },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleContentTypeSelect(item.id as any)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all text-[11px] font-bold ${
                    contentType === item.id
                      ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mb-1" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Media Preview & Preset Picker */}
          <div className="space-y-2">
            <p className="block font-bold text-stone-700">
              Mídia da Publicação (Foto / Vídeo)
            </p>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={selectedMediaUrl}
                alt="Prévia"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                {visibility === 'subscriber' ? '🔒 Visível apenas para Subscritores' : visibility === 'ppv' ? `💰 Desbloqueio: ${ppvPrice} MT` : '🌐 Público'}
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Amostras:</span>
              {sampleMediaOptions.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMediaUrl(url)}
                  aria-label={`Selecionar amostra de mídia ${idx + 1}`}
                  aria-pressed={selectedMediaUrl === url}
                  className={`h-11 w-11 rounded-xl border-2 transition-transform flex-shrink-0 ${
                    selectedMediaUrl === url ? 'border-pink-600 scale-105 shadow-sm' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full rounded-[inherit] object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Audience / Visibility Selector ("Quem pode ver?") */}
          <div className="space-y-1.5">
            <p className="block font-bold text-stone-700">
              Quem pode ver este conteúdo?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setVisibility('public')}
                className={`p-2.5 rounded-2xl border text-center font-bold ${
                  visibility === 'public' ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20' : 'border-stone-200'
                }`}
              >
                🌐 Todos
              </button>
              <button
                type="button"
                onClick={() => setVisibility('promo')}
                className={`p-2.5 rounded-2xl border text-center font-bold ${
                  visibility === 'promo' ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20' : 'border-stone-200'
                }`}
              >
                👥 Seguidores
              </button>
              <button
                type="button"
                onClick={() => setVisibility('subscriber')}
                className={`p-2.5 rounded-2xl border text-center font-bold ${
                  visibility === 'subscriber' ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20' : 'border-stone-200'
                }`}
              >
                🔒 Subscritores
              </button>
              <button
                type="button"
                onClick={() => setVisibility('ppv')}
                className={`p-2.5 rounded-2xl border text-center font-bold ${
                  visibility === 'ppv' ? 'border-pink-600 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20' : 'border-stone-200'
                }`}
              >
                💰 Compra Avulsa
              </button>
            </div>
          </div>

          {/* If PPV: Price Input */}
          {visibility === 'ppv' && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 space-y-1.5">
              <label htmlFor="post-ppv-price" className="block font-bold text-amber-900">
                Preço do Conteúdo Pago (Meticais MT)
              </label>
              <div className="flex items-center rounded-xl bg-white border border-amber-300 px-3 py-2">
                <input
                  id="post-ppv-price"
                  name="ppv-price"
                  type="number"
                  inputMode="numeric"
                  min="20"
                  step="10"
                  value={ppvPrice}
                  onChange={(e) => setPpvPrice(e.target.value)}
                  className="w-full font-bold text-stone-900 focus:outline-none"
                />
                <span className="font-bold text-amber-800 ml-2">MT</span>
              </div>
              <p className="text-[10px] text-amber-800">
                Os utilizadores podem desbloquear este post imediatamente via M-Pesa ou saldo da carteira.
              </p>
            </div>
          )}

          {/* Caption */}
          <div className="space-y-1">
            <label htmlFor="post-caption" className="block font-bold text-stone-700">
              Legenda e Descrição
            </label>
            <textarea
              id="post-caption"
              name="caption"
              rows={3}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escreve uma legenda cativante para os teus fãs em Moçambique..."
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-stone-900 placeholder:text-stone-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          {/* Location in Mozambique */}
          <div className="space-y-1">
            <label htmlFor="post-location" className="block font-bold text-stone-700 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-pink-500" />
              <span>Localização em Moçambique</span>
            </label>
            <select
              id="post-location"
              name="location"
              value={locationTag}
              onChange={(e) => setLocationTag(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 p-2.5 font-medium text-stone-900 focus:border-pink-500 focus:outline-none"
            >
              <option value="Maputo, Moçambique">Maputo (Capital)</option>
              <option value="Praia da Macaneta, Maputo">Praia da Macaneta, Maputo</option>
              <option value="Ponta do Ouro, Moçambique">Ponta do Ouro, Matutuíne</option>
              <option value="Matola, Moçambique">Matola, Moçambique</option>
              <option value="Beira, Sofala">Beira, Sofala</option>
              <option value="Nampula Cidade">Nampula Cidade</option>
              <option value="Praia do Tofo, Inhambane">Praia do Tofo, Inhambane</option>
              <option value="Arquipélago de Bazaruto">Arquipélago de Bazaruto</option>
            </select>
          </div>

          {/* 18+ Protection and DRM Watermark Checkbox */}
          <div className="rounded-2xl bg-stone-900 text-white p-3.5 space-y-2 border border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-pink-500" />
                Conteúdo Adulto 18+ & Proteção DRM Ativa
              </span>
              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[9px] font-black text-pink-300">
                18+
              </span>
            </div>
            <p className="text-[10px] text-stone-300 leading-relaxed">
              O sistema aplicará marca d'água invisível e visível anti-pirataria com o ID do comprador para coibir vazamentos.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!caption.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-pink-500/30 hover:from-pink-700 hover:to-rose-600 transition-all disabled:opacity-50 hover:scale-[1.01]"
          >
            Publicar Conteúdo Protegido no FanScale 🇲🇿
          </button>

        </form>
    </ResponsiveDialog>
  );
};
