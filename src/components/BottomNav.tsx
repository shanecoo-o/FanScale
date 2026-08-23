import React from 'react';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { routes } from '../app/routes';

interface BottomNavProps {
  onOpenCreateModal: () => void;
  unreadMessagesCount: number;
  profileUsername: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenCreateModal,
  unreadMessagesCount,
  profileUsername,
}) => {
  return (
    <nav aria-label="Navegação principal móvel" className="mobile-bottom-nav fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-pink-100 bg-white/95 px-1 backdrop-blur-md lg:hidden">
      
      {/* Início */}
      <NavLink
        id="mobile-nav-feed"
        to={routes.feed()}
        className={({ isActive }) => `flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          isActive ? 'font-bold text-pink-600' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-[10px]">Início</span>
      </NavLink>

      {/* Explorar */}
      <NavLink
        id="mobile-nav-explore"
        to={routes.explore()}
        className={({ isActive }) => `flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          isActive ? 'font-bold text-pink-600' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Compass className="h-5 w-5" />
        <span className="text-[10px]">Explorar</span>
      </NavLink>

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
      <NavLink
        id="mobile-nav-messages"
        to={routes.messages()}
        className={({ isActive }) => `relative flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          isActive ? 'font-bold text-pink-600' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        {unreadMessagesCount > 0 && (
          <span className="absolute right-3 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[9px] font-bold text-white">
            {unreadMessagesCount}
          </span>
        )}
        <span className="text-[10px]">Mensagens</span>
      </NavLink>

      {/* Perfil */}
      <NavLink
        id="mobile-nav-profile"
        to={routes.creator(profileUsername)}
        className={({ isActive }) => `flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1 transition-colors ${
          isActive ? 'font-bold text-pink-600' : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <User className="h-5 w-5" />
        <span className="text-[10px]">Perfil</span>
      </NavLink>
    </nav>
  );
};
