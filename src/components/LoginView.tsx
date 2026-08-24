import React, { useEffect, useState } from 'react';
import { 
  Flame, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  User as UserIcon, 
  Smartphone, 
  KeyRound, 
  ArrowLeft, 
  Star, 
  Zap, 
  X,
  CreditCard,
  Check
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
  onClose?: () => void;
  isModal?: boolean;
  initialMode?: 'login' | 'register' | 'forgot' | 'otp';
  initialRole?: UserRole;
  onModeChange?: (mode: 'login' | 'register' | 'forgot' | 'otp') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onClose,
  isModal = false,
  initialMode = 'login',
  initialRole = 'fan',
  onModeChange,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'otp'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);

  // Form Fields
  const [phone, setPhone] = useState('84 765 4321');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Creator specific registration fields
  const [creatorCategory, setCreatorCategory] = useState('Lifestyle & Vlogs');
  const [creatorProvince, setCreatorProvince] = useState('Maputo Cidade');
  const [creatorPriceMonthly, setCreatorPriceMonthly] = useState(350);

  // Fan specific registration interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Música', 'Lifestyle', 'Moda']);

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(45);
  const [sentToPhone, setSentToPhone] = useState('+258 84 765 4321');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setSelectedRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.getElementById('auth-flow-heading')?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [authMode]);

  const selectAuthMode = (mode: 'login' | 'register' | 'forgot' | 'otp') => {
    setAuthMode(mode);
    onModeChange?.(mode);
  };

  // Quick Demo Accounts
  const demoAccounts: { label: string; role: UserRole; user: AuthUser; desc: string }[] = [
    {
      label: 'Ana Chissano',
      role: 'creator',
      desc: 'Top Criadora (Lifestyle & Moda)',
      user: {
        id: 'c1',
        name: 'Ana Chissano',
        username: 'ana.moz',
        email: 'ana@fanscale.co.mz',
        phone: '+258 84 765 4321',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        role: 'creator',
        verified: true,
        walletBalanceMT: 35400,
        bio: 'Criadora de Conteúdo & Lifestyle | Maputo 🇲🇿',
        location: 'Maputo, Moçambique'
      }
    },
    {
      label: 'Dino Macuácua',
      role: 'creator',
      desc: 'Criador Fitness & Personal',
      user: {
        id: 'c2',
        name: 'Dino Macuácua',
        username: 'dino_fitness_mz',
        email: 'dino@fanscale.co.mz',
        phone: '+258 84 123 9876',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        role: 'creator',
        verified: true,
        walletBalanceMT: 19800,
        bio: 'Personal Trainer & Nutrição Esportiva 💪🇲🇿',
        location: 'Matola, Moçambique'
      }
    },
    {
      label: 'Carlos Tembe',
      role: 'fan',
      desc: 'Fã & Subscritor VIP',
      user: {
        id: 'u_fan_1',
        name: 'Carlos Tembe',
        username: 'carlos.vip',
        email: 'carlos@gmail.com',
        phone: '+258 86 555 1234',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        role: 'fan',
        verified: false,
        walletBalanceMT: 4500,
        bio: 'Amante de música marrabenta e lifestyle mocambicano 🇲🇿',
        location: 'Maputo'
      }
    },
    {
      label: 'Admin FanScale',
      role: 'admin',
      desc: 'Moderação & Verificação KYC',
      user: {
        id: 'u_admin_1',
        name: 'Administrador FanScale',
        username: 'admin_fanscale',
        email: 'admin@fanscale.co.mz',
        phone: '+258 84 900 0000',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&auto=format&fit=crop&q=80',
        role: 'admin',
        verified: true,
        walletBalanceMT: 2767500,
        bio: 'Painel Central FanScale Moçambique',
        location: 'Maputo Central'
      }
    }
  ];

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const nextDigits = [...otpDigits];
    nextDigits[index] = val;
    setOtpDigits(nextDigits);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const triggerOtpSubmission = (phoneNum: string) => {
    setSentToPhone(phoneNum.startsWith('+258') ? phoneNum : `+258 ${phoneNum}`);
    selectAuthMode('otp');
    setOtpDigits(['5', '8', '2', '', '', '']);
    setOtpCountdown(45);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerOtpSubmission(phone);
    }, 600);
  };

  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const matched = demoAccounts.find(d => d.user.email?.toLowerCase() === email.toLowerCase()) || demoAccounts[2];
      onLoginSuccess(matched.user);
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (loginMethod === 'phone') {
        triggerOtpSubmission(phone);
      } else {
        const newUser: AuthUser = {
          id: `u_${Date.now()}`,
          name: fullName || 'Novo Utilizador',
          username: username.replace('@', '') || `user_${Math.floor(Math.random() * 9000 + 1000)}`,
          email: email || `${phone.replace(/\s+/g, '')}@fanscale.mz`,
          phone: `+258 ${phone}`,
          avatar: selectedRole === 'creator' 
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
          role: selectedRole,
          verified: selectedRole === 'creator' ? false : false,
          walletBalanceMT: selectedRole === 'creator' ? 0 : 500, // 500 MT welcome bonus for fans
          bio: selectedRole === 'creator' ? 'Novo criador de conteúdos na FanScale 🇲🇿' : 'Fã apaixonado por criadores de Moçambique 🇲🇿',
          location: 'Maputo, Moçambique'
        };
        onLoginSuccess(newUser);
      }
    }, 800);
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Login as matched user or default fan
      const userToLogin = demoAccounts.find(d => d.role === selectedRole)?.user || demoAccounts[2].user;
      onLoginSuccess(userToLogin);
    }, 600);
  };

  const handleDirectDemoLogin = (account: typeof demoAccounts[0]) => {
    setIsLoading(true);
    setSuccessToast(`A iniciar sessão como ${account.user.name}...`);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(account.user);
    }, 450);
  };

  return (
    <div className={`relative w-full ${isModal ? 'max-w-2xl lg:max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white border border-pink-100' : 'public-auth-shell flex items-center justify-center bg-gradient-to-b from-pink-50/40 via-white to-stone-50 p-3 sm:p-6 lg:p-8'}`}>
      
      {/* Close button if Modal */}
      {isModal && onClose && (
        <button
          id="close-login-modal-btn"
          onClick={onClose}
          aria-label="Fechar autenticação"
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-stone-200 hover:text-stone-900 sm:right-4 sm:top-4"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className={`grid w-full grid-cols-1 overflow-hidden lg:grid-cols-12 ${isModal ? '' : 'max-w-xl rounded-3xl border border-pink-100 bg-white shadow-sm lg:max-w-5xl'}`}>
        
        {/* Left Side: Brand Value & Mozambique Proof Showcase (Desktop) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-stone-950 via-stone-900 to-pink-950 p-8 text-white">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-600/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 text-white shadow-lg shadow-pink-500/30">
                <Flame className="h-6 w-6 fill-white stroke-none" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-bold tracking-tight text-white">
                    Fan<span className="text-pink-500">Scale</span>
                  </span>
                  <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-bold text-pink-400 border border-pink-500/30">
                    MZ 🇲🇿
                  </span>
                </div>
                <p className="text-xs text-stone-400">Moçambique em Primeiro Lugar</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-display text-2xl font-black leading-tight text-white mb-3">
              A tua comunidade exclusiva com pagamentos <span className="text-pink-400">M-Pesa & e-Mola</span>.
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed mb-6">
              Subscreve criadores de topo moçambicanos, assiste a bastidores inéditos e monetiza o teu talento em Meticais (MT).
            </p>

            {/* Testimonial / Highlight Card */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md mb-6">
              <div className="flex items-center gap-3 mb-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Ana Chissano"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-pink-500"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Ana Chissano</span>
                    <CheckCircle2 className="h-3.5 w-3.5 fill-pink-500 text-stone-900" />
                  </div>
                  <span className="text-[11px] text-pink-300">2.450 Subscritores VIP</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-300 italic">
                &ldquo;A FanScale mudou a forma como partilho moda e lifestyle em Maputo. Recebo diariamente no M-Pesa com total segurança.&rdquo;
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/20 text-pink-400">
                  <Check className="h-3 w-3" />
                </div>
                <span>Pagamentos instantâneos com M-Pesa e e-Mola</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/20 text-pink-400">
                  <Check className="h-3 w-3" />
                </div>
                <span>Vídeos e fotos privadas protegidas contra capturas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/20 text-pink-400">
                  <Check className="h-3 w-3" />
                </div>
                <span>Taxa de criador justa e levantamentos em 5 minutos</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Seals */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Criptografia 256-bit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-pink-400" />
              <span>Moeda Oficial: Metical (MT)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Login / Register Form */}
        <div className="flex flex-col justify-between bg-white p-4 min-[390px]:p-5 sm:p-8 lg:col-span-7 lg:p-10">
          
          <div>
            {/* Header Mobile Brand (only when not desktop) */}
            <div className="mb-5 flex min-w-0 items-center justify-between gap-2 lg:hidden sm:mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 text-white shadow-md shadow-pink-500/20">
                  <Flame className="h-5 w-5 fill-white stroke-none" />
                </div>
                <span className="font-display text-xl font-bold tracking-tight text-stone-900">
                  Fan<span className="text-pink-600">Scale</span> MZ
                </span>
              </div>
              <span className="shrink-0 rounded-full border border-pink-200 bg-pink-50 px-2 py-1 text-[10px] font-bold text-pink-700 min-[390px]:px-2.5 min-[390px]:text-[11px]">
                Moçambique 🇲🇿
              </span>
            </div>

            {/* OTP Flow View */}
            {authMode === 'otp' ? (
              <div className="max-w-md mx-auto animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => selectAuthMode('login')}
                  className="mb-5 flex min-h-11 items-center gap-1.5 text-xs font-semibold text-stone-600 transition-colors hover:text-pink-600 sm:mb-6"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar para o Login</span>
                </button>

                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <h3 id="auth-flow-heading" tabIndex={-1} className="font-display text-xl font-bold text-stone-900">
                    Código de Verificação SMS
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5">
                    Enviámos um código de 6 dígitos via SMS para{' '}
                    <strong className="text-stone-800">{sentToPhone}</strong>
                  </p>
                </div>

                {/* 6 Digit Inputs */}
                <div className="mb-6 grid grid-cols-6 gap-1.5 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 min-w-0 w-full rounded-xl border-2 border-stone-200 bg-stone-50 text-center font-display text-lg font-black text-stone-900 transition-all focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-500/10 sm:h-14 sm:text-xl"
                    />
                  ))}
                </div>

                <button
                  id="submit-otp-verification-btn"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verificar e Entrar</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  {otpCountdown > 0 ? (
                    <span className="text-xs text-stone-400">
                      Reenviar código em <strong className="text-stone-700 font-semibold">{otpCountdown}s</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpCountdown(45);
                        setOtpDigits(['3', '9', '1', '', '', '']);
                      }}
                      className="text-xs font-bold text-pink-600 hover:text-pink-700 underline"
                    >
                      Reenviar código SMS agora
                    </button>
                  )}
                </div>
              </div>
            ) : authMode === 'forgot' ? (
              /* Forgot Password Flow */
              <div className="max-w-md mx-auto animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => selectAuthMode('login')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-pink-600 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar</span>
                </button>

                <div className="mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600 mb-3">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h3 id="auth-flow-heading" tabIndex={-1} className="font-display text-xl font-bold text-stone-900">
                    Recuperar Acesso à Conta
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Insere o teu número de celular M-Pesa ou e-mail registado para receberes instruções de recuperação.
                  </p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Número de Celular ou E-mail
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="84 123 4567 ou utilizador@gmail.com"
                        className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-pink-600 py-3.5 text-xs font-bold text-white shadow-md shadow-pink-500/20 hover:bg-pink-700 transition-all disabled:opacity-50"
                  >
                    <span>Enviar Código de Recuperação</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Standard Login & Register Views */
              <div>
                {/* Mode Tabs: Entrar vs Registar */}
                <div className="mb-6 flex max-w-sm rounded-2xl bg-stone-100 p-1.5" aria-label="Modo de autenticação">
                  <button
                    id="tab-login-mode"
                    type="button"
                    onClick={() => selectAuthMode('login')}
                    aria-current={authMode === 'login' ? 'page' : undefined}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      authMode === 'login'
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Entrar na Conta
                  </button>
                  <button
                    id="tab-register-mode"
                    type="button"
                    onClick={() => selectAuthMode('register')}
                    aria-current={authMode === 'register' ? 'page' : undefined}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      authMode === 'register'
                        ? 'bg-white text-pink-600 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Criar Conta Grátis
                  </button>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <h1 id="auth-flow-heading" tabIndex={-1} className="font-display text-2xl font-black text-stone-900 tracking-tight">
                    {authMode === 'login' ? 'Bem-vindo de volta!' : 'Junta-te à FanScale Moçambique'}
                  </h1>
                  <p className="text-xs text-stone-500 mt-1">
                    {authMode === 'login' 
                      ? 'Inicia sessão para acederes aos teus criadores favoritos e carteira M-Pesa.'
                      : 'Cria a tua conta em menos de 1 minuto para apoiar ou monetizar.'}
                  </p>
                </div>

                {/* Role Switcher during Registration */}
                {authMode === 'register' && (
                  <div className="mb-6">
                    <ol aria-label="Etapas para ativar uma conta" className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-stone-500">
                      <li aria-current="step" className="rounded-full bg-pink-100 px-3 py-1 text-pink-700">1. Criar conta</li>
                      <li className="rounded-full bg-stone-100 px-3 py-1">2. Completar perfil</li>
                      <li className="rounded-full bg-stone-100 px-3 py-1">3. Verificação de criador</li>
                    </ol>
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      Como pretendes usar a FanScale?
                    </label>
                    <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('fan')}
                        className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                          selectedRole === 'fan'
                            ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20'
                            : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-1">
                          <UserIcon className="h-4 w-4 text-pink-600" />
                          <span>Sou Fã / Subscritor</span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">
                          Aceder a fotos e vídeos exclusivos com M-Pesa.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('creator')}
                        className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                          selectedRole === 'creator'
                            ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20'
                            : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-1">
                          <Sparkles className="h-4 w-4 text-pink-600" />
                          <span>Sou Criador(a)</span>
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">
                          Monetizar conteúdos e cobrar assinaturas em MT.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone vs Email Toggle */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                  <span className="text-xs font-bold text-stone-700">
                    Método de Autenticação
                  </span>
                  <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        loginMethod === 'phone'
                          ? 'bg-white text-pink-600 shadow-sm'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                      <span>Celular (SMS / M-Pesa)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        loginMethod === 'email'
                          ? 'bg-white text-stone-900 shadow-sm'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>E-mail</span>
                    </button>
                  </div>
                </div>

                {/* Forms */}
                {authMode === 'login' ? (
                  /* LOGIN FORM */
                  <form onSubmit={loginMethod === 'phone' ? handlePhoneSubmit : handleEmailLoginSubmit} className="space-y-4">
                    {loginMethod === 'phone' ? (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1.5">
                          Número de Celular Moçambique
                        </label>
                        <div className="flex rounded-xl border border-stone-200 bg-stone-50 focus-within:border-pink-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500/20 transition-all overflow-hidden">
                          <div className="flex items-center gap-1.5 bg-stone-100/80 px-3 border-r border-stone-200 text-xs font-bold text-stone-700">
                            <span>🇲🇿</span>
                            <span>+258</span>
                          </div>
                          <input
                            id="login-phone-input"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="84 123 4567"
                            className="w-full bg-transparent py-3 px-3.5 text-xs font-semibold text-stone-900 focus:outline-none"
                            required
                          />
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Suporta Vodacom (84/85), Movitel (86/87) e Tmcel (82/83)
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1.5">
                            E-mail de Registo
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <input
                              id="login-email-input"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="exemplo@gmail.com"
                              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-stone-700">
                              Palavra-passe
                            </label>
                            <button
                              type="button"
                              onClick={() => selectAuthMode('forgot')}
                              className="text-[11px] font-semibold text-pink-600 hover:text-pink-700"
                            >
                              Esqueceu a senha?
                            </button>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <input
                              id="login-password-input"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-10 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      id="submit-login-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{loginMethod === 'phone' ? 'Enviar Código SMS M-Pesa' : 'Entrar com E-mail'}</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-xs text-stone-500">
                        Ainda não tens uma conta?{' '}
                        <button
                          type="button"
                          onClick={() => selectAuthMode('register')}
                          className="font-bold text-pink-600 hover:underline"
                        >
                          Criar Conta (Cadastro)
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  /* REGISTER / CADASTRO FORM */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    {/* Welcome Bonus for Fans / Creator Monetization Highlight */}
                    {selectedRole === 'fan' ? (
                      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-800">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                          🎁
                        </span>
                        <div className="text-[11px] leading-tight">
                          <strong className="font-bold">Bónus de Cadastro:</strong> Recebes <strong className="font-bold text-emerald-700">500 MT</strong> na tua carteira para começar a apoiar criadores!
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 rounded-xl bg-pink-50 border border-pink-200 p-2.5 text-pink-900">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600 font-bold text-xs">
                          💰
                        </span>
                        <div className="text-[11px] leading-tight">
                          <strong className="font-bold">Creator Studio:</strong> Monetiza posts com fotos, vídeos, assinaturas mensais e gorjetas M-Pesa com taxa fixa de 10%.
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 min-[760px]:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          {selectedRole === 'creator' ? 'Nome Artístico / Criativo' : 'Nome Completo'}
                        </label>
                        <input
                          id="reg-fullname-input"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={selectedRole === 'creator' ? 'Ex: Neyma VIP' : 'Ex: Carlos Mondlane'}
                          className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 px-3 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Nome de Utilizador (@)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">@</span>
                          <input
                            id="reg-username-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="utilizador_moz"
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-7 pr-3 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Creator specific: Category, Province and Monthly Subscription Price */}
                    {selectedRole === 'creator' && (
                      <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-stone-200/80 bg-stone-50 p-3 min-[760px]:grid-cols-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Categoria
                          </label>
                          <select
                            value={creatorCategory}
                            onChange={(e) => setCreatorCategory(e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-white py-2 px-2.5 text-xs text-stone-900 focus:border-pink-500 focus:outline-none"
                          >
                            <option value="Lifestyle & Vlogs">Lifestyle & Vlogs</option>
                            <option value="Fitness & Treino">Fitness & Treino</option>
                            <option value="Moda & Beleza">Moda & Beleza</option>
                            <option value="Música & Marrabenta">Música & Marrabenta</option>
                            <option value="Humor & Comédia">Humor & Comédia</option>
                            <option value="Gastronomia MZ">Gastronomia MZ</option>
                            <option value="Dança & Cultura">Dança & Cultura</option>
                            <option value="Educação & Negócios">Educação & Negócios</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Localização
                          </label>
                          <select
                            value={creatorProvince}
                            onChange={(e) => setCreatorProvince(e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-white py-2 px-2.5 text-xs text-stone-900 focus:border-pink-500 focus:outline-none"
                          >
                            <option value="Maputo Cidade">Maputo Cidade</option>
                            <option value="Matola">Matola</option>
                            <option value="Gaza (Xai-Xai)">Gaza (Xai-Xai)</option>
                            <option value="Inhambane">Inhambane</option>
                            <option value="Sofala (Beira)">Sofala (Beira)</option>
                            <option value="Manica (Chimoio)">Manica (Chimoio)</option>
                            <option value="Tete">Tete</option>
                            <option value="Zambézia (Quelimane)">Zambézia (Quelimane)</option>
                            <option value="Nampula">Nampula</option>
                            <option value="Cabo Delgado (Pemba)">Cabo Delgado (Pemba)</option>
                            <option value="Niassa (Lichinga)">Niassa (Lichinga)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Preço Mensal (MT)
                          </label>
                          <select
                            value={creatorPriceMonthly}
                            onChange={(e) => setCreatorPriceMonthly(Number(e.target.value))}
                            className="w-full rounded-xl border border-stone-200 bg-white py-2 px-2.5 text-xs text-stone-900 focus:border-pink-500 focus:outline-none font-bold text-pink-600"
                          >
                            <option value={150}>150 MT / mês</option>
                            <option value={250}>250 MT / mês</option>
                            <option value={350}>350 MT / mês</option>
                            <option value={500}>500 MT / mês</option>
                            <option value={1000}>1.000 MT / mês</option>
                            <option value={2500}>2.500 MT / mês</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {loginMethod === 'phone' ? (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Número de Celular Moçambique (M-Pesa / e-Mola)
                        </label>
                        <div className="flex rounded-xl border border-stone-200 bg-stone-50 focus-within:border-pink-500 focus-within:bg-white transition-all overflow-hidden">
                          <div className="flex items-center gap-1.5 bg-stone-100 px-3 border-r border-stone-200 text-xs font-bold text-stone-700">
                            <span>🇲🇿</span>
                            <span>+258</span>
                          </div>
                          <input
                            id="reg-phone-input"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="84 123 4567"
                            className="w-full bg-transparent py-2.5 px-3 text-xs text-stone-900 focus:outline-none"
                            required
                          />
                        </div>
                        <p className="text-[10px] text-stone-400 mt-1">
                          Será usado para receber SMS e pagamentos/saques M-Pesa.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          E-mail
                        </label>
                        <input
                          id="reg-email-input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="carlos@exemplo.co.mz"
                          className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 px-3 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                          required
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3 min-[760px]:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Palavra-passe
                        </label>
                        <div className="relative">
                          <input
                            id="reg-password-input"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-3 pr-9 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          Confirmar Palavra-passe
                        </label>
                        <input
                          id="reg-confirm-password-input"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repita a palavra-passe"
                          className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 px-3 text-xs text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="terms-check"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 rounded border-stone-300 text-pink-600 focus:ring-pink-500"
                      />
                      <label htmlFor="terms-check" className="text-[11px] text-stone-600">
                        Aceito os <span className="font-semibold text-pink-600 underline">Termos da FanScale</span> e confirmo que tenho +18 anos.
                      </label>
                    </div>

                    <button
                      id="submit-register-btn"
                      type="submit"
                      disabled={isLoading || !termsAccepted}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 transition-all disabled:opacity-50 hover:scale-[1.01]"
                    >
                      {isLoading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Criar Conta ({selectedRole === 'creator' ? 'Criador FanScale' : 'Fã VIP'})</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-xs text-stone-500">
                        Já tens uma conta?{' '}
                        <button
                          type="button"
                          onClick={() => selectAuthMode('login')}
                          className="font-bold text-pink-600 hover:underline"
                        >
                          Iniciar Sessão (Entrar)
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* Social Login Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                    <span className="bg-white px-3 text-stone-400">Ou acesso de demonstração</span>
                  </div>
                </div>

                {/* Quick Demo Test Buttons */}
                <div className="rounded-2xl border border-pink-100 bg-pink-50/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-pink-600 fill-pink-600" />
                      Entrar Rápido com Contas de Teste:
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 min-[430px]:grid-cols-2">
                    {demoAccounts.map((account) => (
                      <button
                        key={account.user.id}
                        type="button"
                        onClick={() => handleDirectDemoLogin(account)}
                        className="flex items-center gap-2 rounded-xl border border-white bg-white p-2 text-left hover:border-pink-300 hover:bg-pink-50/80 transition-all shadow-xs group"
                      >
                        <img
                          src={account.user.avatar}
                          alt={account.user.name}
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-stone-200 group-hover:ring-pink-500"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-stone-900 truncate">
                              {account.label}
                            </span>
                            {account.user.verified && (
                              <CheckCircle2 className="h-2.5 w-2.5 fill-pink-500 text-white shrink-0" />
                            )}
                          </div>
                          <span className="text-[9px] text-stone-400 block truncate font-medium">
                            {account.role === 'creator' ? '🎨 Criador' : account.role === 'admin' ? '🛡️ Admin' : '📱 Fã'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Help & Mozambique Operators */}
          <div className="pt-6 mt-4 border-t border-stone-100 text-center text-xs text-stone-500">
            <div className="flex items-center justify-center gap-4 text-[11px] font-semibold text-stone-400 mb-2">
              <span>Vodacom M-Pesa</span>
              <span>•</span>
              <span>Movitel e-Mola</span>
              <span>•</span>
              <span>Tmcel mKesh</span>
            </div>
            <p className="text-[10px] text-stone-400">
              FanScale Moçambique © 2026. Todos os direitos reservados.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
