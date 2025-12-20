// Глобальное управление настройками приложения

class AppSettings {
  constructor() {
    this.settings = this.loadSettings();
    this.applyAllSettings();
  }
  
  loadSettings() {
    const defaultSettings = {
      notifications: {
        enabled: true,
        sound: true,
        preview: true,
        vibration: false
      },
      privacy: {
        lastSeen: 'everyone',
        profilePhoto: 'everyone',
        twoFactor: false
      },
      data: {
        autoDownload: true
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        colorScheme: 'blue-green',
        animations: true
      },
      language: 'ru'
    };
    
    const saved = localStorage.getItem('appSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }
  
  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    this.applyAllSettings();
  }
  
  applyAllSettings() {
    this.applyTheme();
    this.applyFontSize();
    this.applyColorScheme();
    this.applyAnimations();
  }
  
  applyTheme() {
    const theme = this.settings.appearance.theme;
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else if (theme === 'auto') {
      // Определить системную тему
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    }
  }
  
  applyFontSize() {
    const size = this.settings.appearance.fontSize;
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${size}`);
  }
  
  applyColorScheme() {
    const scheme = this.settings.appearance.colorScheme;
    document.body.setAttribute('data-color-scheme', scheme);
  }
  
  applyAnimations() {
    if (!this.settings.appearance.animations) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }
  
  // Уведомления
  showNotification(title, body, icon) {
    if (!this.settings.notifications.enabled) return;
    
    // Проверить разрешение на уведомления
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: this.settings.notifications.preview ? body : 'Новое сообщение',
        icon: icon || 'favicon.ico',
        badge: 'favicon.ico',
        tag: 'message-notification',
        requireInteraction: false
      });
      
      // Звук уведомления
      if (this.settings.notifications.sound) {
        this.playNotificationSound();
      }
      
      // Вибрация
      if (this.settings.notifications.vibration && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
  
  playNotificationSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Sound not available');
    }
  }
  
  getSettings() {
    return this.settings;
  }
}

// Создать глобальный экземпляр
window.appSettings = new AppSettings();

// Запросить разрешение на уведомления при загрузке
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Слушать изменения системной темы для режима "авто"
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (window.appSettings.settings.appearance.theme === 'auto') {
      window.appSettings.applyTheme();
    }
  });
}
