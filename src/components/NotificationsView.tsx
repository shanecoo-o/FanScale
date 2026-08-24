import React, { useState } from 'react';
import { PageContainer } from './ui/PageContainer';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Coins, 
  Lock, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'subs' | 'tips' | 'social'>('all');

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'subs') return item.type === 'subscription';
    if (filter === 'tips') return item.type === 'tip' || item.type === 'payout';
    if (filter === 'social') return item.type === 'like' || item.type === 'comment' || item.type === 'follow';
    return true;
  });

  return (
    <PageContainer width="reading" className="space-y-6 py-4 sm:py-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Bell className="h-5 w-5" />
            </div>
            <h1 className="font-display text-2xl font-bold text-stone-900">
              Notificações
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Acompanha as novidades dos teus criadores e pagamentos M-Pesa.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="min-h-11 self-start rounded-full px-3 text-xs font-bold text-pink-600 transition-colors hover:bg-pink-50 hover:text-pink-700 sm:self-auto"
        >
          Marcar todas como lidas
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain border-b border-pink-100 pb-2 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`min-h-11 shrink-0 snap-start rounded-full px-4 py-2 font-bold transition-all ${
            filter === 'all' ? 'bg-pink-600 text-white shadow-sm' : 'text-stone-600 hover:bg-pink-50'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('subs')}
          className={`min-h-11 shrink-0 snap-start rounded-full px-4 py-2 font-bold transition-all ${
            filter === 'subs' ? 'bg-pink-600 text-white shadow-sm' : 'text-stone-600 hover:bg-pink-50'
          }`}
        >
          Subscrições VIP 🔒
        </button>
        <button
          onClick={() => setFilter('tips')}
          className={`min-h-11 shrink-0 snap-start rounded-full px-4 py-2 font-bold transition-all ${
            filter === 'tips' ? 'bg-pink-600 text-white shadow-sm' : 'text-stone-600 hover:bg-pink-50'
          }`}
        >
          Gorjetas & Pagamentos 💰
        </button>
        <button
          onClick={() => setFilter('social')}
          className={`min-h-11 shrink-0 snap-start rounded-full px-4 py-2 font-bold transition-all ${
            filter === 'social' ? 'bg-pink-600 text-white shadow-sm' : 'text-stone-600 hover:bg-pink-50'
          }`}
        >
          Gostos & Comentários ❤️
        </button>
      </div>

      {/* Notifications List */}
      <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm divide-y divide-stone-100">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            Nenhuma notificação nesta categoria no momento.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`flex min-h-16 cursor-pointer items-start justify-between gap-3 p-3.5 transition-colors sm:items-center sm:gap-4 sm:p-4 ${
                !notif.read ? 'bg-pink-50/50' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-3.5">
                
                {/* Icon/Avatar badge */}
                <div className="relative">
                  <img
                    src={notif.actorAvatar}
                    alt={notif.actorName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-pink-500/20"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white ${
                      notif.type === 'subscription'
                        ? 'bg-pink-600'
                        : notif.type === 'tip'
                        ? 'bg-amber-500'
                        : notif.type === 'like'
                        ? 'bg-rose-500'
                        : 'bg-stone-900'
                    }`}
                  >
                    {notif.type === 'subscription' && <Lock className="h-3 w-3" />}
                    {notif.type === 'tip' && <Coins className="h-3 w-3" />}
                    {notif.type === 'like' && <Heart className="h-3 w-3 fill-white" />}
                    {notif.type === 'system' && <ShieldCheck className="h-3 w-3" />}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-stone-800 leading-relaxed">
                    <strong className="text-stone-900 font-bold mr-1">
                      {notif.actorName}
                    </strong>
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    {notif.createdAt}
                  </span>
                </div>

              </div>

              {!notif.read && (
                <span className="h-2.5 w-2.5 rounded-full bg-pink-600 flex-shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

    </PageContainer>
  );
};
