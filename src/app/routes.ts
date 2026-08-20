export type RouteDestination =
  | 'home'
  | 'login'
  | 'register'
  | 'recover'
  | 'verifyOtp'
  | 'feed'
  | 'explore'
  | 'creator'
  | 'messages'
  | 'notifications'
  | 'wallet'
  | 'creatorStudio'
  | 'creatorEarnings'
  | 'creatorKyc'
  | 'admin'
  | 'notFound';

const encodeSegment = (value: string) => encodeURIComponent(value.trim());

export const routes = {
  home: () => '/',
  login: () => '/login',
  register: (role?: 'fan' | 'creator') =>
    role ? `/register?role=${encodeURIComponent(role)}` : '/register',
  recover: () => '/recover',
  verifyOtp: () => '/verify-otp',
  feed: () => '/feed',
  explore: () => '/explore',
  creator: (username: string) => `/creator/${encodeSegment(username)}`,
  messages: () => '/messages',
  conversation: (conversationId: string) => `/messages/${encodeSegment(conversationId)}`,
  notifications: () => '/notifications',
  wallet: () => '/wallet',
  creatorStudio: () => '/creator/studio',
  creatorEarnings: () => '/creator/earnings',
  creatorKyc: () => '/creator/kyc',
  admin: () => '/admin',
  adminKyc: () => '/admin/kyc',
  adminReports: () => '/admin/reports',
} as const;

export function destinationForPath(pathname: string): RouteDestination {
  if (pathname === routes.home()) return 'home';
  if (pathname === routes.login()) return 'login';
  if (pathname === '/register') return 'register';
  if (pathname === routes.recover()) return 'recover';
  if (pathname === routes.verifyOtp()) return 'verifyOtp';
  if (pathname === routes.feed()) return 'feed';
  if (pathname === routes.explore()) return 'explore';
  if (pathname === routes.messages() || pathname.startsWith(`${routes.messages()}/`)) return 'messages';
  if (pathname === routes.notifications()) return 'notifications';
  if (pathname === routes.wallet()) return 'wallet';
  if (pathname === routes.creatorStudio()) return 'creatorStudio';
  if (pathname === routes.creatorEarnings()) return 'creatorEarnings';
  if (pathname === routes.creatorKyc()) return 'creatorKyc';
  if (pathname === routes.admin() || pathname === routes.adminKyc() || pathname === routes.adminReports()) return 'admin';
  if (pathname.startsWith('/creator/')) return 'creator';
  return 'notFound';
}

export function titleForPath(pathname: string): string {
  const destination = destinationForPath(pathname);
  const titles: Record<RouteDestination, string> = {
    home: 'FanScale Moçambique',
    login: 'Entrar | FanScale',
    register: 'Criar conta | FanScale',
    recover: 'Recuperar acesso | FanScale',
    verifyOtp: 'Verificar código | FanScale',
    feed: 'Início | FanScale',
    explore: 'Explorar criadores | FanScale',
    creator: 'Perfil do criador | FanScale',
    messages: 'Mensagens | FanScale',
    notifications: 'Notificações | FanScale',
    wallet: 'Carteira | FanScale',
    creatorStudio: 'Creator Studio | FanScale',
    creatorEarnings: 'Rendimentos | FanScale',
    creatorKyc: 'Verificação de criador | FanScale',
    admin: 'Administração | FanScale',
    notFound: 'Página não encontrada | FanScale',
  };
  return titles[destination];
}
