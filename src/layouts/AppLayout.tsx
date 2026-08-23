import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { routes } from '../app/routes';

interface AppLayoutProps {
  header: React.ReactNode;
  bottomNavigation: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ header, bottomNavigation }) => {
  const location = useLocation();
  const ownsLocalScroll = location.pathname === routes.messages()
    || location.pathname.startsWith(`${routes.messages()}/`);

  return (
    <div className="app-shell flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-pink-500 selection:text-white">
      <a href="#main-content" className="skip-link">Saltar para o conteúdo principal</a>
      {header}
      <main
        id="main-content"
        tabIndex={-1}
        className={`app-main flex-1 ${ownsLocalScroll ? 'app-main--local-scroll' : ''}`}
      >
        <Outlet />
      </main>
      {bottomNavigation}
    </div>
  );
};
