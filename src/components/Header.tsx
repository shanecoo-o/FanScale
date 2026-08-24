import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  PlusCircle, 
  MessageCircle, 
  Bell, 
  Wallet, 
  Sparkles, 
  Compass, 
  Home, 
  LayoutDashboard, 
  ShieldCheck, 
  Globe, 
  ChevronDown,
  LogOut,
  User as UserIcon,
  LogIn
} from 'lucide-react';
import { UserRole, AuthUser } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { destinationForPath, routes } from '../app/routes';

interface HeaderProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  walletBalanceMT: number;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  onOpenCreateModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser?: AuthUser | null;
  profileUsername: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  onRoleChange,
  walletBalanceMT = 0,
  unreadNotificationsCount,
  unreadMessagesCount,
  onOpenCreateModal,
  searchQuery,
  onSearchChange,
  currentUser,
  profileUsername,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeDestination = destinationForPath(location.pathname);
  const isPublicRoute = ['home', 'login', 'register', 'recover', 'verifyOtp', 'notFound'].includes(activeDestination);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="app-header sticky top-0 w-full border-b border-pink-100 bg-white/90 backdrop-blur-md transition-colors">
      <div className="app-header-inner flex items-center justify-between gap-2">
        
        {/* Left: Brand Logo & Mode Badge */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-6">
          <button 
            id="brand-logo-btn"
            onClick={() => navigate(isPublicRoute ? routes.home() : routes.feed())}
            aria-label="Ir para o início da FanScale"
            className="group flex min-w-0 items-center gap-2 text-left focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 text-white shadow-md shadow-pink-500/25 transition-transform group-hover:scale-105 sm:h-10 sm:w-10">
              <Flame className="h-6 w-6 fill-white stroke-none" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold tracking-tight text-stone-900 group-hover:text-pink-600 transition-colors sm:text-xl">
                  Fan<span className="text-pink-600">Scale</span>
                </span>
                <span className="hidden min-[390px]:inline-flex rounded-full bg-pink-100 px-1.5 py-0.5 text-[10px] font-bold text-pink-700">
                  MZ 🇲🇿
                </span>
              </div>
              <p className="hidden text-[10px] font-medium text-stone-400 sm:block">
                Criadores & Conteúdo
              </p>
            </div>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              id="role-switcher-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="hidden min-[1440px]:flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/70 px-3 py-1.5 text-xs font-semibold text-pink-900 hover:bg-pink-100/80 transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              {isPublicRoute ? (
                <span>🌐 Página Inicial</span>
              ) : userRole === 'fan' ? (
                <span>📱 Modo Fã</span>
              ) : userRole === 'creator' ? (
                <span>🎨 Creator Studio</span>
              ) : (
                <span>🛡️ Admin FanScale</span>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-pink-600" />
            </button>

            {showRoleMenu && (
              <div 
                id="role-dropdown-menu"
                className="app-popover absolute left-0 mt-2 w-56 rounded-2xl border border-pink-100 bg-white p-2 shadow-xl shadow-pink-500/10 ring-1 ring-black/5"
              >
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Mudar Visualização
                </div>

                <button
                  onClick={() => {
                    navigate(routes.home());
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    activeDestination === 'home' ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Globe className="h-4 w-4 text-pink-600" />
                  <span>Landing Page Comercial</span>
                </button>

                <button
                  onClick={() => {
                    onRoleChange('fan');
                    navigate(routes.feed());
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    !isPublicRoute && userRole === 'fan' ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-pink-600" />
                  <span>Modo Fã (Feed & Subscrições)</span>
                </button>

                <button
                  onClick={() => {
                    onRoleChange('creator');
                    navigate(routes.creatorStudio());
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    !isPublicRoute && userRole === 'creator' ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 text-pink-600" />
                  <span>Creator Studio (Monetização MT)</span>
                </button>

                <button
                  onClick={() => {
                    onRoleChange('admin');
                    navigate(routes.admin());
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    !isPublicRoute && userRole === 'admin' ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-pink-600" />
                  <span>Painel Administrativo</span>
                </button>

                <div className="my-1 border-t border-stone-100" />

                <button
                  onClick={() => {
                    navigate(routes.login());
                    setShowRoleMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
                >
                  <LogIn className="h-4 w-4 text-pink-600" />
                  <span>Mudar de Conta / Login</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setShowRoleMenu(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-rose-600" />
                  <span>Sair da Conta (Logout)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar */}
        {!isPublicRoute && (
          <div className="mx-4 hidden max-w-xs flex-1 min-[1440px]:flex">
            <div className="relative w-full">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                isSearchFocused ? 'text-pink-600' : 'text-stone-400'
              }`} />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value.trim()) navigate(routes.explore());
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Pesquisar criadores moçambicanos, tags, marrabenta..."
                aria-label="Pesquisar criadores, tags e conteúdo"
                className="w-full rounded-full border border-stone-200 bg-stone-50/80 py-2 pl-10 pr-4 text-xs text-stone-900 placeholder:text-stone-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  aria-label="Limpar pesquisa"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right: Actions & Navigation Buttons */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 xl:gap-3">
          
          {isPublicRoute ? (
            <div className="flex items-center gap-2">
              <button
                id="landing-explore-btn"
                onClick={() => navigate(routes.explore())}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors hidden sm:inline-flex"
              >
                Explorar Criadores
              </button>
              <button
                id="landing-login-btn"
                onClick={() => navigate(routes.login())}
                className="hidden min-[390px]:inline-flex rounded-full border border-pink-500 bg-white px-3.5 py-2 text-xs font-bold text-pink-600 hover:bg-pink-50 transition-colors"
              >
                Entrar
              </button>
              <button
                id="landing-register-btn"
                onClick={() => navigate(routes.register())}
                className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-pink-600 to-rose-500 px-3 py-2 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:from-pink-700 hover:to-rose-600 transition-colors sm:px-4"
              >
                <span className="sm:hidden">Criar</span><span className="hidden sm:inline">Criar Conta</span>
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Nav Icons */}
              <nav className="hidden items-center gap-1 lg:flex">
                <button
                  id="nav-feed-btn"
                  onClick={() => navigate(routes.feed())}
                  aria-current={activeDestination === 'feed' ? 'page' : undefined}
                  className={`flex h-11 w-11 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors min-[1180px]:h-auto min-[1180px]:w-auto ${
                    activeDestination === 'feed'
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden min-[1180px]:inline">Início</span>
                </button>

                <button
                  id="nav-explore-btn"
                  onClick={() => navigate(routes.explore())}
                  aria-current={activeDestination === 'explore' ? 'page' : undefined}
                  className={`flex h-11 w-11 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors min-[1180px]:h-auto min-[1180px]:w-auto ${
                    activeDestination === 'explore'
                      ? 'bg-pink-100 text-pink-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <Compass className="h-4 w-4" />
                  <span className="hidden min-[1180px]:inline">Explorar</span>
                </button>
              </nav>

              {/* + Criar Button */}
              <button
                id="header-create-post-btn"
                onClick={onOpenCreateModal}
                aria-label="Criar publicação"
                className="flex h-11 w-11 items-center justify-center gap-1.5 rounded-full bg-pink-500 text-xs font-bold text-white shadow-sm shadow-pink-500/30 hover:bg-pink-600 transition-[background-color,transform] active:scale-[0.98] sm:h-auto sm:w-auto sm:px-3.5 sm:py-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Criar</span>
              </button>

              {/* Messages with Badge */}
              <button
                id="header-messages-btn"
                onClick={() => navigate(routes.messages())}
                aria-current={activeDestination === 'messages' ? 'page' : undefined}
                aria-label={`Mensagens${unreadMessagesCount > 0 ? `, ${unreadMessagesCount} não lidas` : ''}`}
                className={`relative hidden h-11 w-11 items-center justify-center rounded-full transition-colors md:flex ${
                  activeDestination === 'messages'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              {/* Notifications with Badge */}
              <button
                id="header-notifications-btn"
                onClick={() => navigate(routes.notifications())}
                aria-current={activeDestination === 'notifications' ? 'page' : undefined}
                aria-label={`Notificações${unreadNotificationsCount > 0 ? `, ${unreadNotificationsCount} não lidas` : ''}`}
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  activeDestination === 'notifications'
                    ? 'bg-pink-100 text-pink-700'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Bell className="h-4 w-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600 text-[10px] font-bold text-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Wallet Button with Balance in Meticais */}
              <button
                id="header-wallet-btn"
                onClick={() => navigate(routes.wallet())}
                aria-current={activeDestination === 'wallet' ? 'page' : undefined}
                className="hidden min-h-11 items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-bold text-stone-800 hover:border-pink-300 hover:bg-pink-50/50 hover:text-pink-700 transition-colors md:flex"
                title="Carteira Digital FanScale"
              >
                <Wallet className="h-4 w-4 text-pink-600" />
                <span>{(walletBalanceMT ?? 0).toLocaleString('pt-MZ')} MT</span>
              </button>

              {/* "Tornar-me Criador" or Creator Studio Button */}
              {userRole === 'fan' ? (
                <button
                  id="become-creator-cta-btn"
                  onClick={() => navigate(routes.creatorKyc())}
                  className="hidden min-[1280px]:flex items-center gap-1.5 rounded-full border border-pink-500 bg-white px-3.5 py-1.5 text-xs font-bold text-pink-600 hover:bg-pink-500 hover:text-white transition-all shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Tornar-me Criador</span>
                </button>
              ) : (
                <button
                  id="creator-studio-shortcut-btn"
                  onClick={() => navigate(routes.creatorStudio())}
                  aria-current={activeDestination === 'creatorStudio' ? 'page' : undefined}
                  className={`hidden min-[1280px]:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                    activeDestination === 'creatorStudio'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-pink-500" />
                  <span>Studio</span>
                </button>
              )}

              {/* User Avatar & Dropdown Menu */}
              <div className="relative">
                <button
                  id="header-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Abrir menu do utilizador"
                  aria-expanded={showUserMenu}
                  className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-pink-500/20 transition-shadow hover:ring-pink-500 focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2"
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={currentUser?.name || 'Meu Perfil'}
                    className="h-full w-full object-cover"
                  />
                </button>

                {showUserMenu && (
                  <div 
                    id="user-profile-dropdown"
                    className="app-popover absolute right-0 mt-2 w-64 rounded-2xl border border-pink-100 bg-white p-2 shadow-xl shadow-pink-500/10 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {/* User Card */}
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100 mb-1.5">
                      <img
                        src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={currentUser?.name || 'Utilizador'}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-pink-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {currentUser?.name || 'Carlos Tembe'}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          @{currentUser?.username || 'carlos.vip'}
                        </div>
                      </div>
                      <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[9px] font-bold text-pink-700 uppercase">
                        {userRole === 'creator' ? 'Criador' : userRole === 'admin' ? 'Admin' : 'Fã'}
                      </span>
                    </div>

                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Ações Rápidas
                    </div>

                    <button
                      onClick={() => {
                        navigate(routes.creator(profileUsername));
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-stone-700 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-pink-600" />
                      <span>Meu Perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate(routes.wallet());
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-stone-700 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Wallet className="h-4 w-4 text-pink-600" />
                        <span>Carteira M-Pesa</span>
                      </div>
                      <span className="font-bold text-pink-600 text-[11px]">
                        {(walletBalanceMT ?? 0).toLocaleString('pt-MZ')} MT
                      </span>
                    </button>

                    {userRole === 'creator' && (
                      <button
                        onClick={() => {
                          navigate(routes.creatorStudio());
                          setShowUserMenu(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-stone-700 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-pink-600" />
                        <span>Creator Studio</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      id="menu-switch-account-btn"
                      onClick={() => {
                        navigate(routes.login());
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      <LogIn className="h-4 w-4 text-stone-500" />
                      <span>Mudar de Conta / Login</span>
                    </button>

                    <button
                      id="menu-register-account-btn"
                      onClick={() => {
                        navigate(routes.register());
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-pink-600 hover:bg-pink-50 transition-colors"
                    >
                      <Sparkles className="h-4 w-4 text-pink-600" />
                      <span>Cadastrar Nova Conta</span>
                    </button>

                    <div className="my-1.5 border-t border-stone-100" />

                    <button
                      id="menu-logout-btn"
                      onClick={() => {
                        onLogout();
                        setShowUserMenu(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl bg-rose-50/80 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100/90 transition-all border border-rose-100"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="h-4 w-4 text-rose-600" />
                        <span>Sair da Conta (Terminar Sessão)</span>
                      </div>
                      <span className="text-[10px] text-rose-500 font-normal">Sair</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Quick Logout Button on Desktop */}
              <button
                id="header-direct-logout-btn"
                onClick={onLogout}
                className="hidden min-[1536px]:flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50/80 px-3 py-1.5 text-xs font-bold text-stone-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all"
                title="Sair da Conta"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sair</span>
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
};
