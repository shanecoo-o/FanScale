import React from 'react';
import { Outlet } from 'react-router-dom';

interface AppLayoutProps {
  header: React.ReactNode;
  bottomNavigation: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ header, bottomNavigation }) => (
  <div className="app-shell flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-pink-500 selection:text-white">
    <a href="#main-content" className="skip-link">Saltar para o conteúdo principal</a>
    {header}
    <main id="main-content" tabIndex={-1} className="app-main flex-1">
      <Outlet />
    </main>
    {bottomNavigation}
  </div>
);
