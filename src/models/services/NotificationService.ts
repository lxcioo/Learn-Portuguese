let activeReminderTimer: any = null;

export const NotificationService = {
  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  hasPermission(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  },

  async requestPermissions(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (err) {
        console.warn('Notification permission error:', err);
        return false;
      }
    }
    return false;
  },

  async showNotification(title: string, options?: NotificationOptions) {
    if (!this.hasPermission()) return;

    try {
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification(title, {
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            ...options,
          });
          return;
        }
      }
      new Notification(title, {
        icon: '/pwa-192x192.png',
        ...options,
      });
    } catch (e) {
      console.warn('Failed to display notification:', e);
    }
  },

  /**
   * Schedules a gentle reminder when Leitner Box 1 vocabulary is about to expire
   */
  async scheduleLeitnerBox1Reminder(box1Count: number, earliestDueDate: Date) {
    if (!this.hasPermission() || box1Count <= 0) return;

    if (activeReminderTimer) {
      clearTimeout(activeReminderTimer);
      activeReminderTimer = null;
    }

    const now = Date.now();
    const dueTime = earliestDueDate.getTime();
    const delayMs = Math.max(0, dueTime - now);

    const title = '🧠 Vokabel-Erinnerung (Kasten 1)';
    const body =
      box1Count === 1
        ? '1 Vokabel aus Kasten 1 ist bereit zur Wiederholung! Frische dein Gedächtnis jetzt auf.'
        : `${box1Count} Vokabeln aus Kasten 1 verblassen bald! Jetzt kurz wiederholen und festigen.`;

    if (delayMs <= 1000) {
      // Due right now or overdue
      this.showNotification(title, {
        body,
        tag: 'leitner-box1-due',
      });
    } else if (delayMs < 24 * 60 * 60 * 1000) {
      // Schedule reminder within the next 24 hours
      activeReminderTimer = setTimeout(() => {
        this.showNotification(title, {
          body,
          tag: 'leitner-box1-due',
        });
      }, delayMs);
    }
  },

  async rescheduleReminders(hasPracticedToday: boolean) {
    if (!this.hasPermission()) return;
    if (!hasPracticedToday) {
      // Safe streak reminder
    }
  },

  async scheduleNotification(title: string, body: string, _triggerDate?: Date) {
    this.showNotification(title, { body });
  },
};
