import React from 'react';
import { PageContainer } from './ui/PageContainer';
import { 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Lock, 
  Smartphone,
  Coins,
  ShieldAlert,
  Flame,
  KeyRound,
  EyeOff,
  Percent,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface LandingViewProps {
  onStartExploring: () => void;
  onBecomeCreator: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartExploring,
  onBecomeCreator,
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <PageContainer width="wide" className="space-y-16 py-6">
      
      {/* 18+ Compliance Top Banner */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-stone-900 border border-pink-500/30 p-3.5 text-xs text-stone-300">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-600 font-black text-white text-xs">
              18+
            </span>
            <span className="font-semibold text-white">
              Plataforma Exclusiva para Adultos • Verificação de Idade Obrigatória
            </span>
          </div>
          <span className="text-[11px] text-pink-400 font-medium hidden sm:inline-block">
            Tolerância Zero para Menores • Conformidade KYC & Proteção de Direitos
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white p-8 sm:p-14 max-w-6xl mx-auto shadow-2xl border border-pink-900/40">
        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/15 border border-pink-500/30 px-4 py-1.5 text-xs font-bold text-pink-400 backdrop-blur-md">
            <Flame className="h-3.5 w-3.5 text-pink-500 animate-pulse" />
            <span>FanScale • Plataforma Premium de Conteúdo Exclusivo 18+</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            O teu conteúdo. A tua audiência.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-pink-300">
              O teu rendimento.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-medium">
            Cria conteúdo exclusivo, constrói a tua comunidade e monetiza diretamente os teus fãs com total privacidade, segurança e pagamentos imediatos em Meticais via <strong>M-Pesa e e-Mola</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="landing-register-cta-btn"
              onClick={onOpenRegister || onBecomeCreator}
              className="rounded-full bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 px-7 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-pink-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Criar Conta (18+)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              id="landing-become-creator-btn"
              onClick={onBecomeCreator}
              className="rounded-full bg-pink-500/20 border border-pink-500/40 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-pink-300 hover:bg-pink-500/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span>Tornar-me Criador</span>
            </button>

            <button
              id="landing-explore-btn"
              onClick={onStartExploring}
              className="rounded-full bg-white/10 border border-white/20 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition-all"
            >
              Explorar Criadores
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-4 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>Pagamentos instantâneos M-Pesa / e-Mola</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-pink-400" />
              <span>80% da Receita para o Criador</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-pink-400" />
              <span>Proteção Anti-Download & Marca d'água</span>
            </div>
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl pointer-events-none" />
      </section>

      {/* How to Become a Creator - 6 Steps */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 text-pink-700 font-bold px-3 py-1 text-xs border border-pink-200">
            <Sparkles className="h-3.5 w-3.5 text-pink-600" />
            <span>Monetização Direta</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900">
            Como Começar como Criador na FanScale
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Um processo simples, privado e 100% regulamentado para começares a faturar com o teu conteúdo exclusivo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 font-black text-pink-600 text-sm">
              1
            </div>
            <h3 className="font-display text-base font-bold text-stone-900">
              Cria a tua conta
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Regista-te com o teu número de telemóvel Moçambique (+258) ou e-mail. Escolhe o teu nome artístico público mantendo os teus dados privados.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 font-black text-pink-600 text-sm">
              2
            </div>
            <h3 className="font-display text-base font-bold text-stone-900">
              Verifica a tua identidade (+18)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Submete o teu B.I., Passaporte ou DIRE e selfie de verificação. Apenas adultos aprovados podem monetizar.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 font-black text-pink-600 text-sm">
              3
            </div>
            <h3 className="font-display text-base font-bold text-stone-900">
              Publica conteúdo exclusivo
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Publica fotos, vídeos, bastidores, áudios sensuais e stories com proteção anti-pirataria e marca d'água integrada.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 font-black text-pink-600 text-sm">
              4
            </div>
            <h3 className="font-display text-base font-bold text-stone-900">
              Define o teu preço
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Escolhe a mensalidade da tua página (ex: 299 MT, 499 MT, 799 MT), preços de posts PPV avulsos e valores de mensagens privadas.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 font-black text-pink-600 text-sm">
              5
            </div>
            <h3 className="font-display text-base font-bold text-stone-900">
              Constrói a tua audiência
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Usa o feed público, stories e o teu link de afiliado exclusivo (fanscale.com/@teu_nome) para converter seguidores em subscritores pagantes.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200/80 bg-white p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 font-black text-emerald-600 text-sm">
              6
            </div>
            <h3 className="font-display text-base font-bold text-stone-900">
              Recebe os teus ganhos
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Recebe 80% do valor de subscrições, PPV, gorjetas e mensagens pagas diretamente no teu telemóvel M-Pesa ou e-Mola.
            </p>
          </div>

        </div>
      </section>

      {/* 3 Pillars / Feature Highlights */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
            <Smartphone className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-stone-900">
            Pagamentos Locais M-Pesa & e-Mola
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Subscrições, compras avulsas PPV e gorjetas rápidas sem necessidade de cartão internacional.
          </p>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-stone-900">
            Proteção de Conteúdo & Privacidade
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Marca d'água dinâmica com ID do utilizador, bloqueio de download direto e proteção dos teus dados legais.
          </p>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-6 sm:p-8 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="font-display text-base font-bold text-stone-900">
            80% Criador / 20% FanScale
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Modelo de partilha de receita transparente e sustentável para cobrir processamento financeiro e alta disponibilidade de vídeo.
          </p>
        </div>

      </section>

      {/* Trust & Safety 18+ Box */}
      <section className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-stone-900 border border-stone-800 p-8 sm:p-10 text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Compromisso Rigoroso de Segurança & Conformidade 18+
              </h3>
              <p className="text-xs text-stone-400">
                Políticas estritas da FanScale Africa para um ambiente de conteúdo adulto seguro e legal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-300">
            <div className="flex items-start gap-2.5 rounded-2xl bg-stone-800/60 p-3.5 border border-stone-700/50">
              <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Verificação de Idade Rígida</strong>
                Apenas criadores e participantes maiores de 18 anos com documentação válida aprovada.
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl bg-stone-800/60 p-3.5 border border-stone-700/50">
              <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Tolerância Zero para Violações</strong>
                Proibição total de material sem consentimento, violência ou qualquer envolvimento de menores.
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl bg-stone-800/60 p-3.5 border border-stone-700/50">
              <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Privacidade do Criador</strong>
                O teu nome civil e B.I. ficam confidenciais e protegidos pela equipa de conformidade.
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-2xl bg-stone-800/60 p-3.5 border border-stone-700/50">
              <CheckCircle2 className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Moderação & Denúncias Rápidas</strong>
                Canal ativo de reporte com resposta rápida e remoção preventiva em caso de infração.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Perguntas Frequentes</span>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Tudo o que precisas saber sobre o FanScale
          </h2>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white divide-y divide-stone-100 shadow-sm overflow-hidden text-xs">
          
          <div className="p-5 space-y-1">
            <h4 className="font-bold text-stone-900">
              Como é que os criadores recebem o dinheiro das subscrições e PPV?
            </h4>
            <p className="text-stone-600 leading-relaxed">
              O dinheiro é creditado na tua carteira digital FanScale em Meticais (MT) imediatamente após a compra do fã. Podes pedir levantamento a qualquer momento diretamente para o teu número Vodacom M-Pesa, Movitel e-Mola ou conta bancária nacional.
            </p>
          </div>

          <div className="p-5 space-y-1">
            <h4 className="font-bold text-stone-900">
              O meu nome verdadeiro ou número de B.I. ficam públicos?
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Não. Os teus documentos legais e nome civil são estritamente confidenciais e utilizados apenas para verificação de maioridade (18+) e pagamentos fiscais/bancários. Na plataforma, os fãs verão apenas o teu nome artístico e @username.
            </p>
          </div>

          <div className="p-5 space-y-1">
            <h4 className="font-bold text-stone-900">
              Como o FanScale protege o meu conteúdo de vazamentos?
            </h4>
            <p className="text-stone-600 leading-relaxed">
              Implementamos proteção contra clique direito, marca d'água dinâmica com o ID do subscritor visualizador para desincentivar gravações de ecrã e sessões seguras com tokens temporários.
            </p>
          </div>

          <div className="p-5 space-y-1">
            <h4 className="font-bold text-stone-900">
              Qual é a percentagem de comissão cobrada pela plataforma?
            </h4>
            <p className="text-stone-600 leading-relaxed">
              O criador recebe 80% do valor bruto gerado pelas suas subscrições, conteúdos PPV, gorjetas e mensagens pagas. Os 20% da FanScale cobrem taxas de gateway M-Pesa/e-Mola, servidores de vídeo de alta performance, armazenamento seguro e moderação 24/7.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 p-8 sm:p-12 text-white text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <span>FanScale Africa • 18+ Only</span>
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
            Pronto para transformar a tua audiência em rendimento real?
          </h3>
          <p className="text-xs sm:text-sm text-pink-100 max-w-xl mx-auto">
            Cria a tua conta hoje, verifica a tua maioridade e começa a monetizar fãs em Moçambique e em toda a África.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="landing-cta-bottom-btn"
              onClick={onBecomeCreator}
              className="rounded-full bg-white px-8 py-3.5 text-xs sm:text-sm font-extrabold text-pink-600 hover:bg-stone-50 shadow-lg hover:scale-105 transition-all"
            >
              Tornar-se Criador FanScale
            </button>
            <button
              onClick={onStartExploring}
              className="rounded-full bg-pink-700/40 border border-white/30 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-pink-700/60 transition-all"
            >
              Explorar Conteúdo
            </button>
          </div>
        </div>
      </section>

    </PageContainer>
  );
};
