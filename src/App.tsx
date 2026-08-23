import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_STORIES, 
  MOCK_NOTIFICATIONS, 
  MOCK_ADMIN_REPORTS,
  MOCK_KYC_REQUESTS,
  MOCK_REVIEWS,
  MOCK_LIVE_SESSIONS
} from './data/mockData';
import { 
  UserRole, 
  AuthUser,
  Post, 
  Story, 
  CreatorProfile, 
  Conversation, 
  NotificationItem, 
  WalletTransaction,
  AdminReport,
  KycRequest,
  PaymentProvider,
  PostVisibility,
  CreatorReview,
  LiveSession
} from './types';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StoryViewerModal } from './components/StoryViewerModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PaymentPromptModal } from './components/PaymentPromptModal';
import { TipModal } from './components/TipModal';
import { CreatePostModal } from './components/CreatePostModal';
import { RateCreatorModal } from './components/RateCreatorModal';
import { LiveRoomModal } from './components/LiveRoomModal';
import { AgeGateModal } from './components/AgeGateModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { ResourceNotFound } from './components/ResourceNotFound';
import { FanScaleRoutes } from './app/router';
import { routes } from './app/routes';
import { fanScaleDataService } from './services';

const Feed = React.lazy(() => import('./components/Feed').then((module) => ({ default: module.Feed })));
const ExplorePage = React.lazy(() => import('./components/ExplorePage').then((module) => ({ default: module.ExplorePage })));
const CreatorProfileView = React.lazy(() => import('./components/CreatorProfileView').then((module) => ({ default: module.CreatorProfileView })));
const CreatorStudio = React.lazy(() => import('./components/CreatorStudio').then((module) => ({ default: module.CreatorStudio })));
const WalletView = React.lazy(() => import('./components/WalletView').then((module) => ({ default: module.WalletView })));
const MessagesView = React.lazy(() => import('./components/MessagesView').then((module) => ({ default: module.MessagesView })));
const NotificationsView = React.lazy(() => import('./components/NotificationsView').then((module) => ({ default: module.NotificationsView })));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const LandingView = React.lazy(() => import('./components/LandingView').then((module) => ({ default: module.LandingView })));
const LoginView = React.lazy(() => import('./components/LoginView').then((module) => ({ default: module.LoginView })));
const KycModal = React.lazy(() => import('./components/KycModal').then((module) => ({ default: module.KycModal })));

export default function App() {
  const navigate = useNavigate();
  // Authentication & Current User State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    id: 'u_fan_1',
    name: 'Carlos Tembe',
    username: 'carlos.vip',
    email: 'carlos@gmail.com',
    phone: '+258 86 555 1234',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    role: 'fan',
    verified: false,
    walletBalanceMT: 2500,
    bio: 'Amante de música marrabenta e lifestyle moçambicano 🇲🇿',
    location: 'Maputo'
  });
  // Navigation & Role State
  const [userRole, setUserRole] = useState<UserRole>('fan');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data State
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [walletBalanceMT, setWalletBalanceMT] = useState<number>(0);
  const [coreDataStatus, setCoreDataStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [coreDataError, setCoreDataError] = useState<string | null>(null);
  const [reports, setReports] = useState<AdminReport[]>(MOCK_ADMIN_REPORTS);
  const [kycRequests, setKycRequests] = useState<KycRequest[]>(MOCK_KYC_REQUESTS);
  const [reviews, setReviews] = useState<CreatorReview[]>(MOCK_REVIEWS);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(MOCK_LIVE_SESSIONS);

  useEffect(() => {
    let active = true;

    Promise.all([
      fanScaleDataService.getFeed(),
      fanScaleDataService.getCreators(),
      fanScaleDataService.getConversations(),
      fanScaleDataService.getWallet(),
    ])
      .then(([feed, creatorList, conversationList, wallet]) => {
        if (!active) return;
        setPosts(feed);
        setCreators(creatorList);
        setConversations(conversationList);
        setTransactions(wallet.transactions);
        setWalletBalanceMT(wallet.balanceMT);
        setCoreDataStatus('ready');
      })
      .catch((error: unknown) => {
        if (!active) return;
        setCoreDataError(error instanceof Error ? error.message : 'Não foi possível carregar os dados FanScale.');
        setCoreDataStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  // Modal States
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [subscribingCreator, setSubscribingCreator] = useState<CreatorProfile | null>(null);
  const [tippingCreator, setTippingCreator] = useState<{ id: string; name: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [ratingModalCreator, setRatingModalCreator] = useState<CreatorProfile | null>(null);
  const [ratingModalLiveId, setRatingModalLiveId] = useState<string | undefined>(undefined);
  const [activeLiveSession, setActiveLiveSession] = useState<LiveSession | null>(null);
  const [showAgeGate, setShowAgeGate] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('fanscale_age_verified_18');
    } catch {
      return false;
    }
  });

  // Mobile Payment Prompt (USSD Simulation)
  const [paymentPrompt, setPaymentPrompt] = useState<{
    isOpen: boolean;
    provider: PaymentProvider;
    amountMT: number;
    phone: string;
    description: string;
    onSuccessCallback: () => void;
  } | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleOpenRateModal = (creator: CreatorProfile, liveId?: string) => {
    setRatingModalCreator(creator);
    setRatingModalLiveId(liveId);
  };

  const handleOpenLiveRoom = (session: LiveSession) => {
    setActiveLiveSession(session);
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, isLiked: !r.isLiked, likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1 }
          : r
      )
    );
    showToast('Classificação marcada como útil!');
  };

  const handleSubmitReview = (reviewData: {
    creatorId: string;
    rating: number;
    categories: {
      contentQuality: number;
      interaction: number;
      livePerformance: number;
    };
    title: string;
    comment: string;
    liveId?: string;
    liveTitle?: string;
    tags: string[];
  }) => {
    const targetCreator = creators.find((c) => c.id === reviewData.creatorId);
    if (!targetCreator) return;

    const newReview: CreatorReview = {
      id: `rev-${Date.now()}`,
      creatorId: reviewData.creatorId,
      userId: currentUser?.id || 'u_fan_me',
      userName: currentUser?.name || 'Carlos Tembe',
      userHandle: currentUser?.username || 'carlos.vip',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      userBadge: 'Apoiador FanScale ⭐',
      rating: reviewData.rating,
      categories: reviewData.categories,
      title: reviewData.title,
      comment: reviewData.comment,
      createdAt: 'Agora',
      likesCount: 1,
      isLiked: false,
      isVerifiedSubscriber: true,
      liveId: reviewData.liveId,
      liveTitle: reviewData.liveTitle,
      tags: reviewData.tags,
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update Creator's average rating and breakdown
    setCreators((prev) =>
      prev.map((c) => {
        if (c.id === reviewData.creatorId) {
          const currentCount = c.ratingCount || 10;
          const currentAvg = c.ratingAverage || 4.8;
          const newTotal = currentCount + 1;
          const newAvg = Number(((currentAvg * currentCount + reviewData.rating) / newTotal).toFixed(2));
          
          const newBreakdown = { ...(c.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }) };
          const starKey = Math.min(5, Math.max(1, Math.round(reviewData.rating))) as 1 | 2 | 3 | 4 | 5;
          newBreakdown[starKey] = (newBreakdown[starKey] || 0) + 1;

          let updatedLiveAvg = c.liveRatingAverage;
          let updatedLiveCount = c.liveRatingCount;
          if (reviewData.liveId) {
            const prevLiveCount = c.liveRatingCount || 5;
            const prevLiveAvg = c.liveRatingAverage || 4.8;
            updatedLiveCount = prevLiveCount + 1;
            updatedLiveAvg = Number(((prevLiveAvg * prevLiveCount + reviewData.rating) / updatedLiveCount).toFixed(2));
          }

          return {
            ...c,
            ratingAverage: newAvg,
            ratingCount: newTotal,
            ratingBreakdown: newBreakdown,
            liveRatingAverage: updatedLiveAvg,
            liveRatingCount: updatedLiveCount,
          };
        }
        return c;
      })
    );

    // Update LiveSession if applicable
    if (reviewData.liveId) {
      setLiveSessions((prev) =>
        prev.map((ls) => {
          if (ls.id === reviewData.liveId) {
            const prevCount = ls.ratingCount || 1;
            const prevAvg = ls.ratingAverage || 4.9;
            const updatedCount = prevCount + 1;
            const updatedAvg = Number(((prevAvg * prevCount + reviewData.rating) / updatedCount).toFixed(2));
            return {
              ...ls,
              ratingAverage: updatedAvg,
              ratingCount: updatedCount,
            };
          }
          return ls;
        })
      );
    }

    setRatingModalCreator(null);
    setRatingModalLiveId(undefined);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });

    showToast(`⭐ Avaliação de ${reviewData.rating} estrelas enviada para ${targetCreator.name}!`);
  };

  const handleQuickRateLive = (liveId: string, stars: number) => {
    const session = liveSessions.find((ls) => ls.id === liveId);
    if (!session) return;
    const creator = creators.find((c) => c.id === session.creatorId);
    if (!creator) return;

    handleSubmitReview({
      creatorId: session.creatorId,
      rating: stars,
      categories: {
        contentQuality: stars,
        interaction: stars,
        livePerformance: stars,
      },
      title: `Classificação da Live: ${session.title}`,
      comment: `Avaliação rápida durante a transmissão em direto: ${stars} estrelas!`,
      liveId: session.id,
      liveTitle: session.title,
      tags: ['Live Ao Vivo 🔴', 'Transmissão Top 🔥'],
    });
  };

  // Helper count badges
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  // Authentication Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setWalletBalanceMT(user.walletBalanceMT);
    if (user.role === 'creator') {
      navigate(routes.creatorStudio());
    } else if (user.role === 'admin') {
      navigate(routes.admin());
    } else {
      navigate(routes.feed());
    }
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast(`Bem-vindo, ${user.name}! Sessão iniciada com sucesso.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogoutConfirm(false);
    showToast('Sessão terminada. Até breve!');
    navigate(routes.home());
  };

  // Current logged in creator view (for studio/profile when role is creator)
  const currentCreatorProfile = creators.find(
    (creator) => creator.id === currentUser?.id || creator.username === currentUser?.username,
  ) || creators[0]!;

  // ----------------------------------------------------
  // Interactions: Like, Save, Comment, Tip
  // ----------------------------------------------------
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const wasLiked = p.isLiked;
          return {
            ...p,
            isLiked: !wasLiked,
            likesCount: wasLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            isSaved: !p.isSaved,
          };
        }
        return p;
      })
    );
    showToast('Publicação guardada nos teus favoritos!');
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      userId: 'user-me',
      userName: userRole === 'creator' ? currentCreatorProfile.name : 'Eu (Fã FanScale)',
      userAvatar: userRole === 'creator' ? currentCreatorProfile.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      userHandle: userRole === 'creator' ? currentCreatorProfile.username : 'fan_moz',
      text,
      createdAt: 'Agora',
      likesCount: 0,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
    showToast('Comentário publicado com sucesso!');
  };

  // ----------------------------------------------------
  // Interactions: PPV Unlock & Subscriptions via M-Pesa / e-Mola / Wallet
  // ----------------------------------------------------
  const handleUnlockPpv = (postId: string, priceMT: number) => {
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;

    setPaymentPrompt({
      isOpen: true,
      provider: 'mpesa',
      amountMT: priceMT,
      phone: '841234567',
      description: `Desbloquear publicação de ${targetPost.creator.name}`,
      onSuccessCallback: () => {
        // Unlock post
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isUnlocked: true } : p))
        );

        // Record transaction
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'ppv_unlock',
          title: `Desbloqueio PPV (${targetPost.creator.name})`,
          description: `Pagamento de conteúdo exclusivo`,
          amountMT: priceMT,
          date: 'Hoje',
          status: 'completed',
          provider: 'mpesa',
          referenceNumber: `MZ-${Math.floor(100000 + Math.random() * 900000)}`,
          isCredit: false,
        };
        setTransactions((prev) => [newTx, ...prev]);

        showToast(`✓ Conteúdo exclusivo de ${targetPost.creator.name} desbloqueado!`);
      },
    });
  };

  const handleOpenSubscribeModal = (creatorId: string) => {
    const cr = creators.find((c) => c.id === creatorId);
    if (cr) {
      setSubscribingCreator(cr);
    }
  };

  const handleConfirmSubscription = (
    creatorId: string,
    plan: 'monthly' | 'quarterly',
    provider: PaymentProvider,
    phoneOrCard: string,
    amountMT: number
  ) => {
    const cr = creators.find((c) => c.id === creatorId);
    if (!cr) return;

    setSubscribingCreator(null);

    // If using wallet balance directly
    if (provider === 'bank_transfer') {
      setWalletBalanceMT((prev) => prev - amountMT);
      finalizeSubscription(cr, amountMT, provider, 'Carteira FanScale');
    } else {
      // Prompt mobile USSD
      setPaymentPrompt({
        isOpen: true,
        provider,
        amountMT,
        phone: phoneOrCard,
        description: `Subscrição VIP a ${cr.name}`,
        onSuccessCallback: () => {
          finalizeSubscription(cr, amountMT, provider, phoneOrCard);
        },
      });
    }
  };

  const finalizeSubscription = (
    cr: CreatorProfile,
    amountMT: number,
    provider: PaymentProvider,
    refDetail: string
  ) => {
    // Mark creator as subscribed
    setCreators((prev) =>
      prev.map((c) =>
        c.id === cr.id
          ? { ...c, isSubscribed: true, subscribersCount: c.subscribersCount + 1 }
          : c
      )
    );

    // Unlock all subscriber posts by this creator
    setPosts((prev) =>
      prev.map((p) =>
        p.creatorId === cr.id && p.visibility === 'subscriber'
          ? { ...p, isUnlocked: true }
          : p
      )
    );

    // Record transaction
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'subscription',
      title: `Subscrição VIP: ${cr.name}`,
      description: `Acesso mensal exclusivo`,
      amountMT,
      date: 'Hoje',
      status: 'completed',
      provider,
      referenceNumber: `SUB-${Math.floor(100000 + Math.random() * 900000)}`,
      isCredit: false,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'subscription',
      actorName: cr.name,
      actorAvatar: cr.avatar,
      actorHandle: cr.username,
      message: `Tornaste-te membro VIP oficial! Acesso a todo o conteúdo desbloqueado.`,
      createdAt: 'Agora',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });

    showToast(`🎉 Parabéns! Agora és subscritor VIP de ${cr.name}`);
  };

  // ----------------------------------------------------
  // Interactions: Tipping Creators
  // ----------------------------------------------------
  const handleOpenTipModal = (creatorId: string, creatorName: string) => {
    setTippingCreator({ id: creatorId, name: creatorName });
  };

  const handleConfirmTip = (
    creatorId: string,
    amountMT: number,
    provider: PaymentProvider,
    message: string
  ) => {
    const cr = creators.find((c) => c.id === creatorId);
    setTippingCreator(null);

    setPaymentPrompt({
      isOpen: true,
      provider,
      amountMT,
      phone: '841234567',
      description: `Gorjeta para ${cr ? cr.name : 'Criador FanScale'}`,
      onSuccessCallback: () => {
        // Record transaction
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'tip',
          title: `Gorjeta a ${cr ? cr.name : 'Criador'}`,
          description: message || 'Apoio em Meticais',
          amountMT,
          date: 'Hoje',
          status: 'completed',
          provider,
          referenceNumber: `TIP-${Math.floor(100000 + Math.random() * 900000)}`,
          isCredit: false,
        };
        setTransactions((prev) => [newTx, ...prev]);

        // Update creator tips
        setPosts((prev) =>
          prev.map((p) =>
            p.creatorId === creatorId
              ? { ...p, tipsTotalMT: p.tipsTotalMT + amountMT }
              : p
          )
        );

        showToast(`💖 Gorjeta de ${amountMT} MT enviada com sucesso!`);
      },
    });
  };

  // ----------------------------------------------------
  // Interactions: Messages & Chat
  // ----------------------------------------------------
  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-me',
      senderName: userRole === 'creator' ? currentCreatorProfile.name : 'Eu',
      senderAvatar: userRole === 'creator' ? currentCreatorProfile.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text,
      timestamp: 'Agora',
      isFromMe: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text,
            lastMessageTime: 'Agora',
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );
  };

  const handleUnlockPpvMessage = (
    conversationId: string,
    messageId: string,
    priceMT: number
  ) => {
    setPaymentPrompt({
      isOpen: true,
      provider: 'mpesa',
      amountMT: priceMT,
      phone: '841234567',
      description: 'Desbloquear foto exclusiva no chat',
      onSuccessCallback: () => {
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === messageId ? { ...m, isUnlocked: true } : m
                ),
              };
            }
            return conv;
          })
        );
        showToast(`✓ Mídia privada desbloqueada no chat!`);
      },
    });
  };

  // ----------------------------------------------------
  // Interactions: Create New Post
  // ----------------------------------------------------
  const handlePublishPost = (postData: {
    caption: string;
    mediaUrl: string;
    visibility: PostVisibility;
    priceMT?: number;
    locationTag: string;
    hashtags: string[];
  }) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      creatorId: currentCreatorProfile.id,
      creator: {
        name: currentCreatorProfile.name,
        username: currentCreatorProfile.username,
        avatar: currentCreatorProfile.avatar,
        verified: currentCreatorProfile.verified,
        location: currentCreatorProfile.location,
        subscriptionPriceMonthly: currentCreatorProfile.subscriptionPriceMonthly,
      },
      visibility: postData.visibility,
      mediaType: 'image',
      mediaUrls: [postData.mediaUrl],
      caption: postData.caption,
      hashtags: postData.hashtags,
      likesCount: 1,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      tipsTotalMT: 0,
      priceMT: postData.priceMT,
      isUnlocked: true,
      isLiked: true,
      createdAt: 'Agora',
      viewsCount: 1,
      locationTag: postData.locationTag,
    };

    setPosts((prev) => [newPost, ...prev]);
    setShowCreateModal(false);
    navigate(routes.feed());
    showToast('🚀 O teu novo conteúdo foi publicado com sucesso no FanScale Moçambique!');
  };

  // ----------------------------------------------------
  // Interactions: Wallet Deposit & Withdraw
  // ----------------------------------------------------
  const handleDepositToWallet = (
    amountMT: number,
    provider: PaymentProvider,
    phone: string
  ) => {
    setPaymentPrompt({
      isOpen: true,
      provider,
      amountMT,
      phone,
      description: 'Recarga de Carteira FanScale',
      onSuccessCallback: () => {
        setWalletBalanceMT((prev) => prev + amountMT);
        const newTx: WalletTransaction = {
          id: `tx-${Date.now()}`,
          type: 'deposit',
          title: `Recarga via ${provider.toUpperCase()}`,
          description: `Depósito em conta FanScale`,
          amountMT,
          date: 'Hoje',
          status: 'completed',
          provider,
          referenceNumber: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
          isCredit: true,
        };
        setTransactions((prev) => [newTx, ...prev]);
        showToast(`✓ Carteira recarregada com ${amountMT} MT!`);
      },
    });
  };

  const handleRequestPayout = (
    amountMT: number,
    method: string,
    phoneOrIban: string
  ) => {
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'payout',
      title: `Levantamento para ${method.toUpperCase()} (${phoneOrIban})`,
      description: `Transferência de rendimentos`,
      amountMT,
      date: 'Hoje',
      status: 'pending',
      provider: method === 'emola' ? 'emola' : 'mpesa',
      referenceNumber: `SAQ-${Math.floor(100000 + Math.random() * 900000)}`,
      isCredit: false,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`✓ Pedido de levantamento de ${amountMT} MT registado! Processamento em até 2 horas.`);
  };

  // ----------------------------------------------------
  // Admin & KYC Actions
  // ----------------------------------------------------
  const handleResolveReport = (reportId: string, action: 'keep' | 'remove') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: action === 'remove' ? 'removed' : 'reviewed' }
          : r
      )
    );
    showToast(action === 'remove' ? 'Conteúdo removido da plataforma.' : 'Denúncia arquivada.');
  };

  const handleResolveKyc = (kycId: string, action: 'approve' | 'reject') => {
    setKycRequests((prev) =>
      prev.map((k) =>
        k.id === kycId
          ? { ...k, status: action === 'approve' ? 'approved' : 'rejected' }
          : k
      )
    );
    showToast(action === 'approve' ? 'Criador verificado com sucesso!' : 'Solicitação rejeitada.');
  };

  const handleSubmitKyc = (data: any) => {
    const newKyc: KycRequest = {
      id: `kyc-${Date.now()}`,
      creatorId: 'user-me',
      creatorName: data.publicName || data.fullName,
      legalFullName: data.fullName,
      dateOfBirth: data.dateOfBirth || '2001-01-01',
      age: 23,
      isOver18Confirmed: true,
      participantConsentConfirmed: true,
      creatorHandle: 'eu_criador',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      idDocumentType: data.docType,
      documentNumber: data.docNumber,
      nuitNumber: data.nuit,
      status: 'pending',
      submittedAt: 'Agora',
      phone: data.phone,
      payoutMethod: data.payoutMethod,
    };
    setKycRequests((prev) => [newKyc, ...prev]);
    showToast('Documentos 18+ e KYC enviados para conformidade FanScale.');
  };

  if (coreDataStatus !== 'ready') {
    return (
      <main id="main-content" className="flex min-h-dvh items-center justify-center bg-stone-50 px-6" tabIndex={-1}>
        <div className="max-w-md text-center" role={coreDataStatus === 'error' ? 'alert' : 'status'}>
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-pink-100 border-t-pink-600" aria-hidden="true" />
          <h1 className="text-xl font-black text-stone-900">
            {coreDataStatus === 'error' ? 'Não foi possível iniciar a FanScale' : 'A preparar a FanScale'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            {coreDataError ?? 'A carregar o feed, criadores, conversas e carteira…'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {toastMessage && (
        <div role="status" aria-live="polite" className="fixed left-4 right-4 top-[max(5rem,calc(env(safe-area-inset-top)+4.5rem))] z-[70] flex items-center justify-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/95 px-5 py-2.5 text-center text-xs font-bold text-white shadow-2xl backdrop-blur-md sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:rounded-full">
          <span>{toastMessage}</span>
        </div>
      )}

      <FanScaleRoutes
        header={(
          <Header
            userRole={userRole}
            onRoleChange={(role) => {
              setUserRole(role);
              showToast(`Modo alterado para: ${role.toUpperCase()}`);
            }}
            walletBalanceMT={walletBalanceMT}
            unreadNotificationsCount={unreadNotificationsCount}
            unreadMessagesCount={unreadMessagesCount}
            onOpenCreateModal={() => setShowCreateModal(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentUser={currentUser}
            profileUsername={currentCreatorProfile.username}
            onLogout={() => setShowLogoutConfirm(true)}
          />
        )}
        bottomNavigation={(
          <BottomNav
            onOpenCreateModal={() => setShowCreateModal(true)}
            unreadMessagesCount={unreadMessagesCount}
            profileUsername={currentCreatorProfile.username}
          />
        )}
        render={{
          landing: () => (
            <LandingView
              onStartExploring={() => navigate(routes.explore())}
              onBecomeCreator={() => navigate(routes.register('creator'))}
              onOpenLogin={() => navigate(routes.login())}
              onOpenRegister={() => navigate(routes.register())}
            />
          ),
          auth: (mode, role) => (
            <LoginView
              initialMode={mode}
              initialRole={role}
              onLoginSuccess={handleLoginSuccess}
              onClose={() => navigate(routes.home())}
              onModeChange={(nextMode) => {
                if (nextMode === 'login') navigate(routes.login());
                else if (nextMode === 'register') navigate(routes.register(role === 'creator' ? 'creator' : undefined));
                else if (nextMode === 'forgot') navigate(routes.recover());
                else navigate(routes.verifyOtp());
              }}
            />
          ),
          feed: () => (
            <Feed
              posts={posts}
              stories={stories}
              creators={creators}
              walletBalanceMT={walletBalanceMT}
              onLikePost={handleToggleLike}
              onSavePost={handleToggleSave}
              onAddComment={handleAddComment}
              onSelectStory={(index) => setActiveStoryIndex(index)}
              onOpenCreateStory={() => setShowCreateModal(true)}
              onOpenCreateModal={() => setShowCreateModal(true)}
              onOpenSubscribeModal={handleOpenSubscribeModal}
              onOpenPpvUnlockModal={(post) => handleUnlockPpv(post.id, post.priceMT || 100)}
              onOpenTipModal={handleOpenTipModal}
              onSelectCreatorProfile={(id) => {
                const creator = creators.find((item) => item.id === id);
                if (creator) navigate(routes.creator(creator.username));
              }}
              onReportPost={(post) => {
                handleResolveReport(post.id, 'keep');
                showToast('Denúncia enviada para a equipa de moderação.');
              }}
              onOpenKycModal={() => navigate(routes.creatorKyc())}
              onOpenWallet={() => navigate(routes.wallet())}
            />
          ),
          explore: () => (
            <ExplorePage
              creators={creators}
              posts={posts}
              liveSessions={liveSessions}
              onSelectCreator={(id) => {
                const creator = creators.find((item) => item.id === id);
                if (creator) navigate(routes.creator(creator.username));
              }}
              onOpenSubscribeModal={handleOpenSubscribeModal}
              onOpenPpvUnlockModal={(post) => handleUnlockPpv(post.id, post.priceMT || 100)}
              onLikePost={handleToggleLike}
              onOpenLiveRoom={handleOpenLiveRoom}
              onOpenRateModal={handleOpenRateModal}
            />
          ),
          creator: (username) => {
            const creator = creators.find((item) => item.username.toLowerCase() === username.toLowerCase());
            if (!creator) {
              return (
                <ResourceNotFound
                  title="Criador não encontrado"
                  description="Não encontrámos um perfil com este endereço. Explora os criadores disponíveis na FanScale."
                  actionLabel="Explorar criadores"
                  actionTo={routes.explore()}
                />
              );
            }
            return (
              <CreatorProfileView
                creator={creator}
                posts={posts.filter((post) => post.creatorId === creator.id)}
                reviews={reviews}
                liveSessions={liveSessions}
                onBack={() => navigate(-1)}
                onFollowToggle={(id) => {
                  setCreators((prev) => prev.map((item) => item.id === id ? { ...item, isFollowing: !item.isFollowing } : item));
                  showToast('Preferência de criador atualizada!');
                }}
                onOpenSubscribeModal={handleOpenSubscribeModal}
                onOpenTipModal={handleOpenTipModal}
                onOpenMessageWithCreator={(id) => {
                  const conversation = conversations.find((item) => item.participantId === id);
                  navigate(conversation ? routes.conversation(conversation.id) : routes.messages());
                }}
                onLikePost={handleToggleLike}
                onSavePost={handleToggleSave}
                onAddComment={handleAddComment}
                onOpenPpvUnlockModal={(post) => handleUnlockPpv(post.id, post.priceMT || 100)}
                onReportPost={(post) => {
                  handleResolveReport(post.id, 'keep');
                  showToast('Denúncia enviada para a equipa de moderação.');
                }}
                onOpenRateModal={handleOpenRateModal}
                onLikeReview={handleLikeReview}
                onOpenLiveRoom={handleOpenLiveRoom}
              />
            );
          },
          messages: (conversationId) => {
            if (conversationId && !conversations.some((item) => item.id === conversationId)) {
              return (
                <ResourceNotFound
                  title="Conversa não encontrada"
                  description="Esta conversa não existe nos dados atuais ou já não está disponível."
                  actionLabel="Ver mensagens"
                  actionTo={routes.messages()}
                />
              );
            }
            return (
              <MessagesView
                conversations={conversations}
                activeConversationId={conversationId}
                onSelectConversation={(id) => navigate(routes.conversation(id))}
                onBackToList={() => navigate(routes.messages())}
                onSendMessage={handleSendMessage}
                onUnlockPpvMessage={handleUnlockPpvMessage}
                onOpenTipModal={handleOpenTipModal}
              />
            );
          },
          notifications: () => (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={() => {
                setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
                showToast('Todas as notificações foram marcadas como lidas.');
              }}
              onSelectNotification={(item) => {
                if (item.targetPostId) navigate(routes.feed());
              }}
            />
          ),
          wallet: (role) => (
            <WalletView
              userRole={role ?? userRole}
              walletBalanceMT={walletBalanceMT}
              transactions={transactions}
              onDeposit={handleDepositToWallet}
              onRequestPayout={handleRequestPayout}
            />
          ),
          creatorStudio: () => (
            <CreatorStudio
              creator={currentCreatorProfile}
              posts={posts.filter((post) => post.creatorId === currentCreatorProfile.id)}
              reviews={reviews}
              onOpenCreateModal={() => setShowCreateModal(true)}
              onRequestPayout={handleRequestPayout}
              onUpdatePricing={(monthlyMT, quarterlyMT) => {
                setCreators((prev) => prev.map((creator) => creator.id === currentCreatorProfile.id
                  ? { ...creator, subscriptionPriceMonthly: monthlyMT, subscriptionPriceQuarterly: quarterlyMT }
                  : creator));
                showToast('Preços de subscrição atualizados com sucesso!');
              }}
            />
          ),
          creatorKyc: () => (
            <KycModal
              presentation="page"
              onClose={() => navigate(routes.creatorStudio())}
              onSubmitKyc={handleSubmitKyc}
            />
          ),
          admin: (tab) => (
            <AdminDashboard
              reports={reports}
              kycRequests={kycRequests}
              onResolveReport={handleResolveReport}
              onResolveKyc={handleResolveKyc}
              onLogout={() => setShowLogoutConfirm(true)}
              initialTab={tab}
              onTabChange={(nextTab) => {
                if (nextTab === 'kyc') navigate(routes.adminKyc());
                else if (nextTab === 'reports') navigate(routes.adminReports());
                else navigate(routes.admin());
              }}
            />
          ),
        }}
      />

      {/* ------------------------------------------- */}
      {/* Interactive Global Modals */}
      {/* ------------------------------------------- */}

      {/* Story Viewer */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onSendStoryReply={(creatorUsername, text) => {
            handleSendMessage('conv-1', `Respondeu ao Story de @${creatorUsername}: ${text}`);
            showToast('Resposta enviada ao criador!');
          }}
        />
      )}

      {/* Subscription Modal */}
      {subscribingCreator && (
        <SubscriptionModal
          creator={subscribingCreator}
          walletBalanceMT={walletBalanceMT}
          onClose={() => setSubscribingCreator(null)}
          onConfirmSubscription={handleConfirmSubscription}
        />
      )}

      {/* Tip Modal */}
      {tippingCreator && (
        <TipModal
          creatorId={tippingCreator.id}
          creatorName={tippingCreator.name}
          walletBalanceMT={walletBalanceMT}
          onClose={() => setTippingCreator(null)}
          onConfirmTip={handleConfirmTip}
        />
      )}

      {/* Create New Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPublishPost={handlePublishPost}
        />
      )}

      {/* Mobile USSD Payment Prompt (M-Pesa / e-Mola / mKesh Simulation) */}
      {paymentPrompt && paymentPrompt.isOpen && (
        <PaymentPromptModal
          provider={paymentPrompt.provider}
          amountMT={paymentPrompt.amountMT}
          phone={paymentPrompt.phone}
          itemDescription={paymentPrompt.description}
          onSuccess={() => {
            paymentPrompt.onSuccessCallback();
            setPaymentPrompt(null);
          }}
          onCancel={() => setPaymentPrompt(null)}
        />
      )}

      {/* Rate Creator / Live Stream Modal */}
      {ratingModalCreator && (
        <RateCreatorModal
          creator={ratingModalCreator}
          liveSessions={liveSessions}
          selectedLiveId={ratingModalLiveId}
          onClose={() => {
            setRatingModalCreator(null);
            setRatingModalLiveId(undefined);
          }}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Interactive Live Stream Room Modal */}
      {activeLiveSession && (
        <LiveRoomModal
          session={activeLiveSession}
          creator={creators.find((c) => c.id === activeLiveSession.creatorId) || creators[0]}
          onClose={() => setActiveLiveSession(null)}
          onOpenTipModal={handleOpenTipModal}
          onOpenFullReviewModal={(creator, liveId) => {
            setActiveLiveSession(null);
            handleOpenRateModal(creator, liveId);
          }}
          onQuickRateLive={handleQuickRateLive}
        />
      )}

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        user={currentUser}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />

      {/* 18+ Age Gate Modal */}
      <AgeGateModal
        isOpen={showAgeGate}
        onConfirm={() => {
          try {
            localStorage.setItem('fanscale_age_verified_18', 'true');
          } catch {}
          setShowAgeGate(false);
          showToast('Idade confirmada (+18). Bem-vindo ao FanScale!');
        }}
        onReject={() => {
          showToast('Acesso restrito apenas a maiores de 18 anos.');
          window.location.href = 'https://www.google.com';
        }}
      />

    </>
  );
}
