import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/src/utils/usePWAInstall';
import { SoundEffects } from '@/src/utils/audio';

interface PWAInstallBannerProps {
  onDismiss?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onDismiss }) => {
  const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || !canInstall || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    SoundEffects.playTap();
    if (isIOS) {
      setShowIOSGuide(true);
    } else {
      await promptInstall();
    }
  };

  const handleDismiss = () => {
    SoundEffects.playTap();
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <>
      <div className="relative mx-auto w-full max-w-xl px-4 py-2">
        <div className="flex items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg border border-emerald-500/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                100% Offline auf deinem Smartphone
              </p>
              <p className="text-sm font-semibold truncate">
                Als App installieren für schnellen Zugriff
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 active:scale-95 transition-transform shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Installieren</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Schließen"
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Home Screen Guide Modal */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-lg">Auf iPhone / iPad installieren</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              So nutzt du die App wie eine echte iOS-App komplett offline und ohne Browserleiste:
            </p>

            <ol className="space-y-4 mb-6 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-medium">Teilen-Symbol antippen:</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    Tippe unten in Safari auf <Share2 className="w-3.5 h-3.5 text-blue-500 inline" /> (Teilen).
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-medium">Zum Home-Bildschirm hinzufügen:</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    Scrolle nach unten und wähle <PlusSquare className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 inline" /> „Zum Home-Bildschirm“.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-medium">Fertig!</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Die App erscheint sofort auf deinem Homescreen und lädt komplett offline im Flugzeugmodus.
                  </p>
                </div>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verstanden</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
