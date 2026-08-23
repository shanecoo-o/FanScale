import React, { useState } from 'react';
import { PageContainer } from './ui/PageContainer';
import { 
  Send, 
  Image as ImageIcon, 
  Mic, 
  Lock, 
  Coins, 
  CheckCircle, 
  Smile, 
  Play, 
  Pause, 
  Sparkles,
  Phone,
  Video,
  MoreVertical,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { Conversation, ChatMessage } from '../types';

interface MessagesViewProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onBackToList: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onUnlockPpvMessage: (conversationId: string, messageId: string, priceMT: number) => void;
  onOpenTipModal: (creatorId: string, creatorName: string) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onBackToList,
  onSendMessage,
  onUnlockPpvMessage,
  onOpenTipModal,
}) => {
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const mobileThreadOpen = Boolean(activeConversationId);

  const activeConversation = 
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;
    onSendMessage(activeConversation.id, inputText);
    setInputText('');
  };

  const handleSendSampleAudio = () => {
    if (!activeConversation) return;
    onSendMessage(activeConversation.id, '🎵 Mensagem de voz gravada (0:24)');
  };

  return (
    <PageContainer width="messages" className="page-container--bleed-mobile py-0 sm:py-6">
      <div className="messages-shell grid min-w-0 grid-cols-1 overflow-hidden border-pink-100 bg-white shadow-sm sm:rounded-3xl sm:border md:grid-cols-12">
        
        {/* Left: Conversations List (4 cols) */}
        <div className={`${mobileThreadOpen ? 'hidden md:flex' : 'flex'} min-h-0 min-w-0 flex-col bg-stone-50/50 md:col-span-4 md:border-r md:border-stone-100`}>
          <div className="p-4 border-b border-stone-100 bg-white flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-stone-900">
              Mensagens Diretas
            </h2>
            <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-bold text-pink-700">
              VIP Chat
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100/80">
            {conversations.map((conv) => (
              <button
                type="button"
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                }}
                className={`flex w-full min-w-0 items-center gap-3 p-3.5 text-left transition-colors ${
                  conv.id === activeConversation?.id
                    ? 'bg-pink-50/80 border-r-2 border-pink-600'
                    : 'hover:bg-stone-100/70'
                }`}
              >
                {/* Avatar with online dot */}
                <div className="relative">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-pink-500/20"
                  />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1 truncate">
                      <span className="font-bold text-xs text-stone-900 truncate">
                        {conv.participantName}
                      </span>
                      {conv.participantVerified && (
                        <CheckCircle className="h-3 w-3 fill-pink-600 text-white flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 truncate">
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Window (8 cols) */}
        {activeConversation ? (
          <div className={`${mobileThreadOpen ? 'flex' : 'hidden md:flex'} min-h-0 min-w-0 flex-col bg-white md:col-span-8`}>
            
            {/* Chat Top Bar */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white z-10">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onBackToList}
                  aria-label="Voltar à lista de conversas"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-100 md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <img
                  src={activeConversation.participantAvatar}
                  alt={activeConversation.participantName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-500/20"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate font-display text-xs font-bold text-stone-900 sm:text-sm">
                      {activeConversation.participantName}
                    </h3>
                    {activeConversation.participantVerified && (
                      <CheckCircle className="h-3.5 w-3.5 fill-pink-600 text-white" />
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    {activeConversation.online ? (
                      <span className="text-emerald-600 font-semibold">● Online agora</span>
                    ) : (
                      'Visto recentemente'
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenTipModal(activeConversation.participantId, activeConversation.participantName)}
                  className="flex items-center gap-1 rounded-full bg-pink-50 border border-pink-200 px-3 py-1.5 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-colors"
                >
                  <Coins className="h-3.5 w-3.5 text-pink-600" />
                  <span className="hidden sm:inline">Dar Gorjeta</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/40">
              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.isFromMe ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                    {!msg.isFromMe && (
                      <img
                        src={activeConversation.participantAvatar}
                        alt="Avatar"
                        className="h-7 w-7 rounded-full object-cover mb-1"
                      />
                    )}

                    <div className="space-y-1">
                      
                      {/* Standard Text Bubble */}
                      {msg.text && (
                        <div
                          className={`rounded-3xl px-4 py-2.5 text-xs leading-relaxed ${
                            msg.isFromMe
                              ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-br-none shadow-sm shadow-pink-500/20'
                              : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-none shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}

                      {/* PPV Media Locked Message */}
                      {msg.isPpv && !msg.isUnlocked && (
                        <div className="rounded-3xl overflow-hidden border border-pink-200 bg-stone-900 p-4 text-white text-center space-y-3 shadow-lg">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600/30 text-pink-400 mx-auto">
                            <Lock className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-bold text-xs block text-white">
                              Foto Exclusiva Bloqueada
                            </span>
                            <span className="text-[11px] text-stone-300">
                              Enviada por @{activeConversation.participantHandle}
                            </span>
                          </div>
                          <button
                            onClick={() => onUnlockPpvMessage(activeConversation.id, msg.id, msg.ppvPriceMT || 100)}
                            className="w-full rounded-full bg-pink-600 py-2 text-xs font-bold text-white shadow-md hover:bg-pink-700 transition-colors"
                          >
                            Desbloquear por {msg.ppvPriceMT} MT
                          </button>
                        </div>
                      )}

                      {/* Unlocked PPV Media */}
                      {msg.isPpv && msg.isUnlocked && msg.mediaUrl && (
                        <div className="rounded-3xl overflow-hidden border border-pink-200 shadow-md">
                          <img
                            src={msg.mediaUrl}
                            alt="Mídia Exclusiva"
                            className="w-full max-w-xs object-cover"
                          />
                          <div className="bg-pink-50 p-2 text-center text-[10px] font-bold text-pink-700">
                            ✓ Conteúdo Desbloqueado
                          </div>
                        </div>
                      )}

                      <span className="text-[10px] text-stone-400 block px-2 text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="flex min-w-0 items-center gap-1.5 border-t border-stone-100 bg-white p-2.5 sm:gap-2 sm:p-3.5">
              <button
                type="button"
                onClick={handleSendSampleAudio}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                title="Gravar Áudio"
                aria-label="Gravar áudio"
              >
                <Mic className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSendMessage(activeConversation.id, '📷 Envio de foto (simulação)');
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                title="Enviar Imagem"
                aria-label="Enviar imagem"
              >
                <ImageIcon className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Mensagem para @${activeConversation.participantHandle}...`}
                aria-label={`Mensagem para @${activeConversation.participantHandle}`}
                className="min-w-0 flex-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 sm:px-4"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Enviar mensagem"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-white shadow-md hover:bg-pink-700 disabled:opacity-40 transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center p-8 text-center text-stone-400">
            Seleciona uma conversa para começar
          </div>
        )}

      </div>
    </PageContainer>
  );
};
