import React from 'react';
import { SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ResourceNotFoundProps {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}

export const ResourceNotFound: React.FC<ResourceNotFoundProps> = ({
  title,
  description,
  actionLabel,
  actionTo,
}) => (
  <section className="page-container page-container--reading flex min-h-[50dvh] items-center py-12 text-center">
    <div className="w-full space-y-4 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
      <SearchX className="mx-auto h-10 w-10 text-pink-600" />
      <div className="space-y-1.5">
        <h1 className="font-display text-xl font-bold text-stone-900">{title}</h1>
        <p className="text-sm leading-relaxed text-stone-600">{description}</p>
      </div>
      <Link to={actionTo} className="inline-flex min-h-11 items-center justify-center rounded-full bg-pink-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-pink-700">
        {actionLabel}
      </Link>
    </div>
  </section>
);
