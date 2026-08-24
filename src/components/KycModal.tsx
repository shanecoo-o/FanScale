import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  FileText, 
  CheckCircle, 
  Smartphone, 
  Upload, 
  Camera, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';
import { ResponsiveDialog } from './ui/ResponsiveDialog';

interface KycModalProps {
  onClose: () => void;
  presentation?: 'dialog' | 'page';
  onSubmitKyc: (data: {
    fullName: string;
    publicName: string;
    dateOfBirth: string;
    docType: 'BI' | 'Passaporte' | 'DIRE';
    docNumber: string;
    nuit: string;
    phone: string;
    payoutMethod: string;
    isOver18: boolean;
    hasConsent: boolean;
  }) => void;
}

export const KycModal: React.FC<KycModalProps> = ({ onClose, onSubmitKyc, presentation = 'dialog' }) => {
  const [legalFullName, setLegalFullName] = useState('Nádia Silva Cassamo');
  const [publicName, setPublicName] = useState('Luna Moz (@luna_exclusive)');
  const [dateOfBirth, setDateOfBirth] = useState('2001-05-14');
  const [docType, setDocType] = useState<'BI' | 'Passaporte' | 'DIRE'>('BI');
  const [docNumber, setDocNumber] = useState('110100452319A');
  const [nuit, setNuit] = useState('149823091');
  const [phone, setPhone] = useState('84 123 4567');
  const [payoutMethod, setPayoutMethod] = useState('mpesa');
  
  // Upload status states
  const [docFrontUploaded, setDocFrontUploaded] = useState(true);
  const [docBackUploaded, setDocBackUploaded] = useState(true);
  const [selfieUploaded, setSelfieUploaded] = useState(true);

  // 18+ Consent checkboxes
  const [isOver18Confirmed, setIsOver18Confirmed] = useState(true);
  const [isParticipantConsentConfirmed, setIsParticipantConsentConfirmed] = useState(true);
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOver18Confirmed || !isParticipantConsentConfirmed || !isTermsAccepted) {
      alert('É obrigatório confirmar a declaração de maioridade (+18) e consentimentos para monetizar.');
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitKyc({
        fullName: legalFullName,
        publicName,
        dateOfBirth,
        docType,
        docNumber,
        nuit,
        phone,
        payoutMethod,
        isOver18: isOver18Confirmed,
        hasConsent: isParticipantConsentConfirmed,
      });
      onClose();
    }, 1200);
  };

  const content = (
    <>
        <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3.5">
          <div className="flex min-w-0 items-start gap-2.5 sm:items-center sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white shadow-md shadow-pink-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-col items-start gap-1 min-[390px]:flex-row min-[390px]:items-center min-[390px]:gap-2">
                <h1 id="kyc-page-title" className="font-display text-base font-bold text-stone-900">
                  Verificação de Criador 18+ (KYC)
                </h1>
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-black text-pink-700">
                  18+ Obrigatório
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Conformidade com a legislação de Moçambique & Proteção de Identidade
              </p>
            </div>
          </div>

          <button onClick={onClose} aria-label="Fechar verificação de criador" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3.5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto shadow-inner">
              <CheckCircle className="h-9 w-9" />
            </div>
            <h4 className="font-display text-lg font-bold text-stone-900">
              Documentos e Selfie 18+ Submetidos!
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              A equipa de conformidade da FanScale Moçambique irá rever os teus dados em até 24 horas. O teu nome civil permanecerá 100% confidencial.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-stone-800">
            <ol aria-label="Progresso da verificação" className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold text-stone-500 min-[390px]:text-[11px]">
              <li aria-current="step" className="flex min-h-11 items-center justify-center rounded-xl bg-pink-100 px-1.5 py-1 text-pink-700">1. Identidade</li>
              <li className="flex min-h-11 items-center justify-center rounded-xl bg-stone-100 px-1.5 py-1">2. Documentos</li>
              <li className="flex min-h-11 items-center justify-center rounded-xl bg-stone-100 px-1.5 py-1">3. Pagamento</li>
            </ol>
            
            {/* Privacy Badge */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-pink-50/70 border border-pink-100 p-3 text-stone-700">
              <Lock className="h-4 w-4 text-pink-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-pink-900 block font-bold">Privacidade Total da Marca:</strong>
                O teu nome legal e documento nunca são exibidos ao público. Os fãs verão apenas o teu nome artístico e @username.
              </div>
            </div>

            {/* Public vs Private Name */}
            <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-2">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700">
                  Nome Legal Completo <span className="text-pink-600 font-normal">(Confidencial)</span>
                </label>
                <input
                  type="text"
                  required
                  value={legalFullName}
                  onChange={(e) => setLegalFullName(e.target.value)}
                  placeholder="Nome conforme consta no B.I."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">
                  Nome Artístico Público
                </label>
                <input
                  type="text"
                  required
                  value={publicName}
                  onChange={(e) => setPublicName(e.target.value)}
                  placeholder="Ex: Luna Moz VIP"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Date of Birth & Document Type */}
            <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-2">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700">
                  Data de Nascimento <span className="text-rose-600 font-bold">(+18)</span>
                </label>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  max="2008-01-01"
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Tipo de Documento Oficial</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                >
                  <option value="BI">Bilhete de Identidade (B.I. Moçambique)</option>
                  <option value="Passaporte">Passaporte Moçambicano / Internacional</option>
                  <option value="DIRE">DIRE (Estrangeiro Residente)</option>
                </select>
              </div>
            </div>

            {/* Document Number & NUIT */}
            <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-2">
              <div className="space-y-1">
                <label className="block font-bold text-stone-700">Número do Documento</label>
                <input
                  type="text"
                  required
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Ex: 110100452319A"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-stone-700">NUÍT Moçambique</label>
                <input
                  type="text"
                  required
                  value={nuit}
                  onChange={(e) => setNuit(e.target.value)}
                  placeholder="9 dígitos para emissão fiscal"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Document Photo Uploads Simulation */}
            <div className="space-y-1.5 pt-1">
              <label className="block font-bold text-stone-700">
                Fotos do Documento & Selfie de Validação Facial
              </label>
              <div className="grid grid-cols-3 gap-1.5 min-[390px]:gap-2">
                <div 
                  onClick={() => setDocFrontUploaded(!docFrontUploaded)}
                  className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition-all min-[390px]:gap-1.5 sm:rounded-2xl sm:p-3 ${
                    docFrontUploaded ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800' : 'border-dashed border-stone-300 bg-stone-50 text-stone-600'
                  }`}
                >
                  {docFrontUploaded ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Upload className="h-5 w-5 text-stone-400" />
                  )}
                  <span className="text-[11px] font-bold">Frente do B.I.</span>
                  <span className="text-[9px] text-stone-500">{docFrontUploaded ? 'Anexado' : 'Clique p/ carregar'}</span>
                </div>

                <div 
                  onClick={() => setDocBackUploaded(!docBackUploaded)}
                  className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition-all min-[390px]:gap-1.5 sm:rounded-2xl sm:p-3 ${
                    docBackUploaded ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800' : 'border-dashed border-stone-300 bg-stone-50 text-stone-600'
                  }`}
                >
                  {docBackUploaded ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Upload className="h-5 w-5 text-stone-400" />
                  )}
                  <span className="text-[11px] font-bold">Verso do B.I.</span>
                  <span className="text-[9px] text-stone-500">{docBackUploaded ? 'Anexado' : 'Clique p/ carregar'}</span>
                </div>

                <div 
                  onClick={() => setSelfieUploaded(!selfieUploaded)}
                  className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-2 text-center transition-all min-[390px]:gap-1.5 sm:rounded-2xl sm:p-3 ${
                    selfieUploaded ? 'border-pink-300 bg-pink-50/70 text-pink-800' : 'border-dashed border-stone-300 bg-stone-50 text-stone-600'
                  }`}
                >
                  {selfieUploaded ? (
                    <UserCheck className="h-5 w-5 text-pink-600" />
                  ) : (
                    <Camera className="h-5 w-5 text-stone-400" />
                  )}
                  <span className="text-[11px] font-bold">Selfie com B.I.</span>
                  <span className="text-[9px] text-stone-500">{selfieUploaded ? 'Validado' : 'Clique p/ selfie'}</span>
                </div>
              </div>
            </div>

            {/* Payout Information */}
            <div className="space-y-1.5 pt-1">
              <label className="block font-bold text-stone-700">Telemóvel M-Pesa / e-Mola para Levantamento (80% Receita Líquida)</label>
              <div className="grid grid-cols-1 gap-3 min-[720px]:grid-cols-2">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="84 / 86..."
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 font-semibold text-stone-900 focus:border-pink-500 focus:bg-white focus:outline-none"
                />

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('mpesa')}
                    className={`min-h-11 py-2 px-1 rounded-xl border text-[11px] font-bold transition-all ${
                      payoutMethod === 'mpesa' ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-sm' : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    M-Pesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('emola')}
                    className={`min-h-11 py-2 px-1 rounded-xl border text-[11px] font-bold transition-all ${
                      payoutMethod === 'emola' ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-sm' : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    e-Mola
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`min-h-11 py-2 px-1 rounded-xl border text-[11px] font-bold transition-all ${
                      payoutMethod === 'bank' ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-sm' : 'border-stone-200 bg-stone-50 text-stone-600'
                    }`}
                  >
                    Banco MZ
                  </button>
                </div>
              </div>
            </div>

            {/* Legal Declarations & Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOver18Confirmed}
                  onChange={(e) => setIsOver18Confirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-[11px] text-stone-700 leading-tight">
                  <strong className="text-stone-900">Declaração de Maioridade (+18):</strong> Confirmo sob compromisso de honra que possuo idade igual ou superior a 18 anos completos.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isParticipantConsentConfirmed}
                  onChange={(e) => setIsParticipantConsentConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-[11px] text-stone-700 leading-tight">
                  <strong className="text-stone-900">Consentimento de Participantes:</strong> Declaro que todo o conteúdo publicado por mim conta com consentimento voluntário e explícito de todas as pessoas retratadas, todas maiores de 18 anos.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-pink-600 focus:ring-pink-500"
                />
                <span className="text-[11px] text-stone-700 leading-tight">
                  Concordo com os Termos de Proteção Anti-Pirataria FanScale, retenção de comissão de 20% e pagamentos em Meticais (80% repassados ao criador).
                </span>
              </label>
            </div>

            <button
              id="submit-kyc-btn"
              type="submit"
              disabled={!isOver18Confirmed || !isParticipantConsentConfirmed || !isTermsAccepted}
              className="w-full rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 py-3.5 font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 transition-all disabled:opacity-50 hover:scale-[1.01]"
            >
              Submeter Verificação 18+ para Ativação
            </button>

          </form>
        )}
    </>
  );

  if (presentation === 'page') {
    return (
      <section aria-labelledby="kyc-page-title" className="page-container page-container--form py-4 sm:py-8">
        <div className="space-y-5 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-7">
          {content}
        </div>
      </section>
    );
  }

  return (
    <ResponsiveDialog
      ariaLabel="Verificação de criador maior de 18 anos"
      onClose={onClose}
      closeOnBackdrop
      overlayClassName="p-0 sm:p-6"
      panelClassName="max-w-xl rounded-none bg-white p-4 shadow-2xl space-y-5 sm:rounded-3xl sm:border sm:border-pink-100 sm:p-7"
    >
      {content}
    </ResponsiveDialog>
  );
};

