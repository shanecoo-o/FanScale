import React, { Suspense, useEffect } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Flame } from 'lucide-react';
import { UserRole } from '../types';
import { AppLayout } from '../layouts/AppLayout';
import { PublicLayout } from '../layouts/PublicLayout';
import { routes, titleForPath } from './routes';

export interface RouteRenderers {
  landing: () => React.ReactNode;
  auth: (mode: 'login' | 'register' | 'forgot' | 'otp', role: UserRole) => React.ReactNode;
  feed: () => React.ReactNode;
  explore: () => React.ReactNode;
  creator: (username: string) => React.ReactNode;
  messages: (conversationId?: string) => React.ReactNode;
  notifications: () => React.ReactNode;
  wallet: (role?: UserRole) => React.ReactNode;
  creatorStudio: () => React.ReactNode;
  creatorKyc: () => React.ReactNode;
  admin: (tab?: 'metrics' | 'kyc' | 'reports') => React.ReactNode;
}

interface FanScaleRoutesProps {
  header: React.ReactNode;
  bottomNavigation: React.ReactNode;
  render: RouteRenderers;
}

const RouteLoading = () => (
  <div role="status" aria-live="polite" className="mx-auto flex min-h-[40dvh] max-w-6xl items-center justify-center px-4 py-16 text-center">
    <div className="space-y-3">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
        <Flame className="h-5 w-5 animate-pulse fill-current" />
      </span>
      <p className="text-sm font-semibold text-stone-600">A abrir a FanScale…</p>
    </div>
  </div>
);

const CreatorRoute = ({ render }: { render: RouteRenderers['creator'] }) => {
  const { username = '' } = useParams();
  return <>{render(username)}</>;
};

const MessagesRoute = ({ render }: { render: RouteRenderers['messages'] }) => {
  const { conversationId } = useParams();
  return <>{render(conversationId)}</>;
};

const AuthRoute = ({ mode, render }: { mode: 'login' | 'register' | 'forgot' | 'otp'; render: RouteRenderers }) => {
  const [searchParams] = useSearchParams();
  const requestedRole = searchParams.get('role');
  const role: UserRole = requestedRole === 'creator' ? 'creator' : 'fan';
  return <>{render.auth(mode, role)}</>;
};

const NotFoundPage = () => (
  <section className="mx-auto flex min-h-[60dvh] max-w-xl items-center px-4 py-16 text-center sm:px-6">
    <div className="w-full space-y-5 rounded-3xl border border-pink-100 bg-white p-7 shadow-sm sm:p-10">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-700">
        <Flame className="h-6 w-6 fill-current" />
      </span>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-pink-600">Erro 404</p>
        <h1 className="font-display text-2xl font-bold text-stone-900">Esta página não está disponível</h1>
        <p className="text-sm leading-relaxed text-stone-600">O endereço pode estar incompleto ou o conteúdo já não existe.</p>
      </div>
      <div className="flex flex-col justify-center gap-2 sm:flex-row">
        <Link to={routes.feed()} className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-pink-700">
          Ir para o início
        </Link>
        <Link to={routes.explore()} className="rounded-full border border-stone-200 px-5 py-3 text-sm font-bold text-stone-700 transition-colors hover:bg-stone-50">
          Explorar criadores
        </Link>
      </div>
    </div>
  </section>
);

const RouteFocusManager = () => {
  const location = useLocation();

  useEffect(() => {
    const title = titleForPath(location.pathname);
    document.title = title;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return <span className="sr-only" role="status" aria-live="polite">{titleForPath(location.pathname)}</span>;
};

export const FanScaleRoutes: React.FC<FanScaleRoutesProps> = ({ header, bottomNavigation, render }) => (
  <Suspense fallback={<RouteLoading />}>
    <Routes>
      <Route element={<PublicLayout header={header} />}>
        <Route path={routes.home()} element={render.landing()} />
        <Route path={routes.login()} element={<AuthRoute mode="login" render={render} />} />
        <Route path="/register" element={<AuthRoute mode="register" render={render} />} />
        <Route path={routes.recover()} element={<AuthRoute mode="forgot" render={render} />} />
        <Route path={routes.verifyOtp()} element={<AuthRoute mode="otp" render={render} />} />
      </Route>

      <Route element={<AppLayout header={header} bottomNavigation={bottomNavigation} />}>
        <Route path={routes.feed()} element={render.feed()} />
        <Route path={routes.explore()} element={render.explore()} />
        <Route path="/creator/:username" element={<CreatorRoute render={render.creator} />} />
        <Route path={routes.messages()} element={<MessagesRoute render={render.messages} />} />
        <Route path="/messages/:conversationId" element={<MessagesRoute render={render.messages} />} />
        <Route path={routes.notifications()} element={render.notifications()} />
        <Route path={routes.wallet()} element={render.wallet()} />
        <Route path={routes.creatorStudio()} element={render.creatorStudio()} />
        <Route path={routes.creatorEarnings()} element={render.wallet('creator')} />
        <Route path={routes.creatorKyc()} element={render.creatorKyc()} />
        <Route path={routes.admin()} element={render.admin('metrics')} />
        <Route path={routes.adminKyc()} element={render.admin('kyc')} />
        <Route path={routes.adminReports()} element={render.admin('reports')} />
      </Route>

      <Route element={<PublicLayout header={header} />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);

export const FanScaleRouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <RouteFocusManager />
    {children}
  </BrowserRouter>
);
