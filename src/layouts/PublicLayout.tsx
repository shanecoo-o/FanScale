import React from 'react';
import { Outlet } from 'react-router-dom';

interface PublicLayoutProps {
  header: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ header }) => (
  <div className="app-shell flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-pink-500 selection:text-white">
    <a href="#main-content" className="skip-link">Saltar para o conteúdo principal</a>
    {header}
    <main id="main-content" tabIndex={-1} className="app-main public-main flex-1">
      <Outlet />
    </main>
  </div>
);
