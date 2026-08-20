import React from 'react';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreateModal: () => void;
  unreadMessagesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenCreateModal,
  unreadMessagesCount,
}) => {
  return (
    <nav aria-label="Navegação principal móvel" className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-pink-100 bg-white/95 backdrop-blur-md px-1 lg:hidden">
      
      {/* Início */}
      <button
        id="mobile-nav-feed"
        onClick={() => onTabChange('feed')}
        aria-current={currentTab === 'feed' ? 'page' : undefined}
        className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          currentTab === 'feed' ? 'text-pink-600 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Home className={`h-5 w-5 ${currentTab === 'feed' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px]">Início</span>
      </button>

      {/* Explorar */}
      <button
        id="mobile-nav-explore"
        onClick={() => onTabChange('explore')}
        aria-current={currentTab === 'explore' ? 'page' : undefined}
        className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          currentTab === 'explore' ? 'text-pink-600 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Compass className={`h-5 w-5 ${currentTab === 'explore' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px]">Explorar</span>
      </button>

      {/* + Criar (Center Pink Glow Button) */}
      <button
        id="mobile-nav-create"
        onClick={onOpenCreateModal}
        aria-label="Criar publicação"
        className="group relative -top-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/40 transition-transform active:scale-95"
      >
        <PlusCircle className="h-6 w-6 stroke-[2.5]" />
      </button>

      {/* Mensagens */}
      <button
        id="mobile-nav-messages"
        onClick={() => onTabChange('messages')}
        aria-current={currentTab === 'messages' ? 'page' : undefined}
        className={`relative flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          currentTab === 'messages' ? 'text-pink-600 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <MessageCircle className={`h-5 w-5 ${currentTab === 'messages' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        {unreadMessagesCount > 0 && (
          <span className="absolute right-3 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] font-bold text-white">
            {unreadMessagesCount}
          </span>
        )}
        <span className="text-[10px]">Mensagens</span>
      </button>

      {/* Perfil */}
      <button
        id="mobile-nav-profile"
        onClick={() => onTabChange('profile')}
        aria-current={currentTab === 'profile' ? 'page' : undefined}
        className={`flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          currentTab === 'profile' ? 'text-pink-600 font-bold' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <User className={`h-5 w-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px]">Perfil</span>
      </button>
    </nav>
  );
};
