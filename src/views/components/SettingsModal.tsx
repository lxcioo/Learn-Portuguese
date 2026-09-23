import React, { useState, useRef } from 'react';
import {
  X,
  Moon,
  Sun,
  Trash2,
  User,
  Check,
  Volume2,
  Download,
  Upload,
  Bell,
  BellOff,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { StorageService } from '@/src/models/services/StorageService';
import { BackupService } from '@/src/models/services/BackupService';
import { NotificationService } from '@/src/models/services/NotificationService';
import { LeitnerService } from '@/src/models/services/LeitnerService';
import { speakPortuguese } from '@/src/utils/audio';

interface SettingsModalProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onClose: () => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isDarkMode,
  onToggleTheme,
  onClose,
  onDataReset,
}) => {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(
    NotificationService.hasPermission()
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    StorageService.getItem<{ name: string }>('userProfile').then((profile) => {
      if (profile?.name) setName(profile.name);
    });
  }, []);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    await StorageService.setItem('userProfile', { name: name.trim(), hasCompletedOnboarding: true });
    setSavedName(true);
    setTimeout(() => setSavedName(false), 2000);
  };

  const handleToggleNotifications = async () => {
    if (!hasNotificationPermission) {
      const granted = await NotificationService.requestPermissions();
      setHasNotificationPermission(granted);
      if (granted) {
        setBackupStatus('Benachrichtigungen für Kasten 1 aktiviert! 🔔');
        await LeitnerService.checkAndScheduleBox1Reminders();
        setTimeout(() => setBackupStatus(null), 3500);
      } else {
        setBackupError('Berechtigung im Browser abgelehnt oder blockiert.');
        setTimeout(() => setBackupError(null), 3500);
      }
    } else {
      setBackupStatus('Push-Benachrichtigungen sind im Browser bereits aktiv.');
      setTimeout(() => setBackupStatus(null), 3000);
    }
  };

  const handleExportBackup = async () => {
    try {
      setBackupError(null);
      const res = await BackupService.exportToFile();
      setBackupStatus(`Backup heruntergeladen (${res.filename})!`);
      setTimeout(() => setBackupStatus(null), 4000);
    } catch (e: any) {
      setBackupError(`Export fehlgeschlagen: ${e?.message || 'Fehler'}`);
      setTimeout(() => setBackupError(null), 4000);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setBackupError(null);
      const text = await file.text();
      const res = await BackupService.importFromText(text);
      if (res.success) {
        setBackupStatus(res.message);
        setTimeout(() => {
          onDataReset(); // Triggers re-fetch of progress in parent view
          setBackupStatus(null);
        }, 1500);
      } else {
        setBackupError(res.message);
        setTimeout(() => setBackupError(null), 5000);
      }
    } catch (err: any) {
      setBackupError(`Import-Fehler: ${err?.message || 'Ungültige Datei'}`);
      setTimeout(() => setBackupError(null), 5000);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetAll = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    localStorage.clear();
    StorageService.clearCache();
    onDataReset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#232526] rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-[#333] space-y-5 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Einstellungen</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {backupStatus && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-scale-in">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupStatus}</span>
          </div>
        )}
        {backupError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-scale-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{backupError}</span>
          </div>
        )}

        {/* User Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
            Dein Name
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name eingeben..."
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-[#1a1b1c] rounded-xl border border-gray-200 dark:border-[#333] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#58cc02]"
              />
            </div>
            <button
              onClick={handleSaveName}
              className="px-4 py-2.5 bg-[#58cc02] text-white rounded-xl text-xs font-bold hover:bg-[#46a302] transition-colors flex items-center gap-1 shadow-sm"
            >
              {savedName ? <Check className="w-4 h-4" /> : 'Speichern'}
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-2.5 border-t border-gray-100 dark:border-[#333]">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Dunkler Modus</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Dunkles Farbschema aktivieren</p>
          </div>
          <button
            onClick={onToggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              isDarkMode ? 'bg-[#58cc02] justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center">
              {isDarkMode ? (
                <Moon className="w-2.5 h-2.5 text-gray-800" />
              ) : (
                <Sun className="w-2.5 h-2.5 text-amber-500" />
              )}
            </div>
          </button>
        </div>

        {/* Leitner Box 1 Spaced Repetition Notifications */}
        <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Spaced Repetition (Kasten 1)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Erinnerung bevor Vokabeln verblassen
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleNotifications}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                hasNotificationPermission
                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {hasNotificationPermission ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Aktiv</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Aktivieren</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Data Loss Prevention: Export & Import */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#58cc02]" />
              <span>Datensicherung &amp; Wiederherstellung</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Sichere deinen Lernfortschritt als Datei (.lxcioo), um Datenverlust beim Leeren des
              Browsers zu verhindern.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportBackup}
              className="px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-[#58cc02] transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
            >
              <Download className="w-3.5 h-3.5 text-[#58cc02]" />
              <span>Exportieren (.lxcioo)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-400 transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              <span>Importieren</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".lxcioo,.json"
            onChange={handleFileSelected}
            className="hidden"
          />
        </div>

        {/* Audio Test (European Portuguese) */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Aussprache-Test (pt-PT)</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Europäische Sprachausgabe prüfen</p>
          </div>
          <button
            onClick={() => speakPortuguese('Olá, bom dia! Como estás?')}
            className="p-2.5 bg-[#1cb0f6]/10 text-[#1cb0f6] hover:bg-[#1cb0f6]/20 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4" />
            <span>Testen</span>
          </button>
        </div>

        {/* Reset progress */}
        <div className="pt-2 border-t border-gray-100 dark:border-[#333]">
          <button
            onClick={handleResetAll}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              confirmReset
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {confirmReset
                ? 'Wirklich alle Fortschritte löschen? (Klicken zum Bestätigen)'
                : 'Lernfortschritt zurücksetzen'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
