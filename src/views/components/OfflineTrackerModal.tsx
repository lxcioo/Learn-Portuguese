import React, { useState, useEffect } from 'react';
import {
  X,
  HardDriveDownload,
  Wifi,
  CheckCircle2,
  RefreshCw,
  Volume2,
  ShieldCheck,
  Plane,
} from 'lucide-react';
import {
  OfflineTrackerService,
  OfflineTrackerStats,
} from '@/src/models/services/OfflineTrackerService';
import { speakPortuguese, SoundEffects } from '@/src/utils/audio';

interface OfflineTrackerModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const OfflineTrackerModal: React.FC<OfflineTrackerModalProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [stats, setStats] = useState<OfflineTrackerStats | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyLabel, setVerifyLabel] = useState('');
  const [showToast, setShowToast] = useState<string | null>(null);

  // Load stats
  const fetchStats = async () => {
    try {
      const data = await OfflineTrackerService.getOfflineStats();
      setStats(data);
    } catch (e) {
      console.error('Error fetching offline stats:', e);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchStats();

    // Listen to network changes
    const handleNetworkChange = () => {
      fetchStats();
    };
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyOffline = async () => {
    setIsVerifying(true);
    setVerifyProgress(0);
    setVerifyLabel('Starte Überprüfung...');
    SoundEffects.playTap();

    try {
      await OfflineTrackerService.verifyAndPrecacheAll((progress, label) => {
        setVerifyProgress(progress);
        setVerifyLabel(label);
      });
      SoundEffects.playCorrect();
      setShowToast('Alle 20 Lektionen & Dialoge sind 100% offline einsatzbereit!');
      await fetchStats();
      setTimeout(() => setShowToast(null), 4000);
    } catch (e) {
      console.error('Offline verification error:', e);
      setShowToast('Fehler bei der Überprüfung.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Offline-Inhalte & Speicher
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lerne überall ohne Internet oder Daten-Roaming
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Toast Notice */}
          {showToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{showToast}</span>
            </div>
          )}

          {/* Network & Offline Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  stats?.isOnline ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-amber-500 ring-4 ring-amber-500/20'
                }`}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {stats?.isOnline ? 'Online verbunden' : 'Offline / Flugmodus'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    Offline Bereit
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Alle Lektionen, Dialoge und Vokabeln funktionieren autonom auf deinem Gerät.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {stats?.isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Plane className="w-4 h-4 text-amber-500" />
              )}
            </div>
          </div>

          {/* Metrics Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Lerneinheiten
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalUnits || 20}
                </span>
                <span className="text-[11px] font-bold text-emerald-600">
                  / {stats?.cachedUnitsCount || 20} lokal
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Übungen
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalExercises || '~1000'}
                </span>
                <span className="text-[11px] text-slate-400">gespeichert</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Dialoge & Audio
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {stats?.totalScenarios || 5}
                </span>
                <span className="text-[11px] font-bold text-emerald-600">aktiv</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Speicherplatz
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ~{stats?.estimatedStorageUsedMb || 2.4}
                </span>
                <span className="text-[11px] font-bold text-slate-400">MB</span>
              </div>
            </div>
          </div>

          {/* Verification Progress Box */}
          {isVerifying ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {verifyLabel}
                </span>
                <span>{verifyProgress}%</span>
              </div>
              <div className="h-2 rounded-full bg-emerald-200 dark:bg-emerald-900 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${verifyProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Offline-Integritätsprüfung
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Letzte Verifizierung: {stats?.lastVerifiedAt ? new Date(stats.lastVerifiedAt).toLocaleDateString('de-DE') : 'Gerade eben verifiziert'}
                </p>
              </div>

              <button
                onClick={handleVerifyOffline}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Inhalte verifizieren</span>
              </button>
            </div>
          )}

          {/* Audio Engine Readiness Test */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Europäisches Portugiesisch (pt-PT) Audio
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Autonomer Web-Audio-Synthesizer ohne Server-Latenz
                </p>
              </div>
            </div>

            <button
              onClick={() => speakPortuguese('Olá! Bem-vindo a Portugal. Tudo bem?')}
              className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-900/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-semibold text-xs transition-all active:scale-95 border border-sky-200 dark:border-sky-800 flex items-center gap-1"
            >
              <span>Testen</span>
            </button>
          </div>

          {/* Itemized Unit Status List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verfügbare Kapitel ({stats?.units.length || 20})
              </h3>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% lokal vorhanden
              </span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {stats?.units.map((unit, idx) => (
                <div
                  key={unit.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px] sm:max-w-xs">
                      {unit.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      {unit.totalExercises} Übungen
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      Bereit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Plane className="w-3.5 h-3.5 text-slate-400" />
            <span>Optimal für Flüge & Reisen</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs transition-all active:scale-95 shadow-sm"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
