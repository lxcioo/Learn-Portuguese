import { registerSW } from 'virtual:pwa-register';
import { OfflineTrackerService } from './models/services/OfflineTrackerService';
import { LeitnerService } from './models/services/LeitnerService';

export function registerPWA() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    registerSW({
      immediate: true,
      onNeedRefresh() {
        console.log('[PWA] New content ready for refresh');
      },
      onOfflineReady() {
        console.log('[PWA] App is ready for 100% offline usage');
        OfflineTrackerService.prefetchEarTrainingAudio();
      },
    });

    window.addEventListener('load', () => {
      setTimeout(() => {
        OfflineTrackerService.prefetchEarTrainingAudio();
        LeitnerService.checkAndScheduleBox1Reminders();
      }, 1500);
    });
  }
}
