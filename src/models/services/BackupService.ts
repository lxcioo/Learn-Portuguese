import { StorageService } from './StorageService';

export interface BackupData {
  version: number;
  appName: string;
  exportedAt: string;
  summary: {
    totalStars: number;
    wordsLearned: number;
    streakDays: number;
  };
  storage: Record<string, any>;
}

const CRITICAL_KEYS = [
  'lessonScores',
  'examScores',
  'dailyStats_v2',
  'seenVocabulary_v2',
  'globalVocabDB',
  'currentPracticeSession',
  'streakData',
  'dailyProgress',
  'userProfile',
  'offline_tracker_last_verified',
  'app_settings',
];

export class BackupService {
  /**
   * Generates a complete snapshot of user learning progress
   */
  static async createBackupSnapshot(): Promise<BackupData> {
    const storageDump: Record<string, any> = {};

    // Collect known critical keys
    for (const key of CRITICAL_KEYS) {
      const val = await StorageService.getItem<any>(key, false);
      if (val !== null && val !== undefined) {
        storageDump[key] = val;
      }
    }

    // Also collect any extra keys in localStorage starting with custom prefixes or existing keys
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith('cached_content_') && !storageDump[key]) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              storageDump[key] = JSON.parse(raw);
            }
          } catch {
            // raw string
            const raw = localStorage.getItem(key);
            if (raw) storageDump[key] = raw;
          }
        }
      }
    }

    // Calculate summary
    const lessonScores = storageDump['lessonScores'] || {};
    const totalStars = Object.values(lessonScores).reduce<number>(
      (acc, s) => acc + (typeof s === 'number' ? s : 0),
      0
    );
    const seenVocab = storageDump['seenVocabulary_v2'] || {};
    const wordsLearned = Object.keys(seenVocab).length;
    const streakData = storageDump['streakData'] || {};
    const streakDays = streakData.currentStreak || 0;

    return {
      version: 1,
      appName: 'Learn-Portuguese-lxcioo',
      exportedAt: new Date().toISOString(),
      summary: {
        totalStars,
        wordsLearned,
        streakDays,
      },
      storage: storageDump,
    };
  }

  /**
   * Triggers download of the progress snapshot as a custom .lxcioo file
   */
  static async exportToFile(): Promise<{ filename: string; summary: BackupData['summary'] }> {
    const backup = await this.createBackupSnapshot();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });

    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `learn_portuguese_backup_${dateStr}.lxcioo`;

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    return { filename, summary: backup.summary };
  }

  /**
   * Validates and restores a backup from JSON text
   */
  static async importFromText(jsonContent: string): Promise<{ success: boolean; restoredCount: number; message: string }> {
    try {
      const parsed = JSON.parse(jsonContent);

      // Validate structure
      let dataToRestore: Record<string, any> = {};

      if (parsed.storage && typeof parsed.storage === 'object') {
        dataToRestore = parsed.storage;
      } else if (parsed.lessonScores || parsed.streakData || parsed.seenVocabulary_v2) {
        // Direct dump format
        dataToRestore = parsed;
      } else {
        return {
          success: false,
          restoredCount: 0,
          message: 'Ungültiges Dateiformat. Keine erkennbaren Lernfortschritte gefunden.',
        };
      }

      let restoredCount = 0;
      for (const [key, value] of Object.entries(dataToRestore)) {
        if (value !== undefined && value !== null) {
          await StorageService.setItem(key, value);
          restoredCount++;
        }
      }

      // Flush cache
      StorageService.clearCache();

      return {
        success: true,
        restoredCount,
        message: `Erfolgreich ${restoredCount} Fortschritts-Einträge wiederhergestellt!`,
      };
    } catch (err: any) {
      return {
        success: false,
        restoredCount: 0,
        message: `Fehler beim Importieren der Datei: ${err?.message || 'Ungültiges JSON'}`,
      };
    }
  }
}
