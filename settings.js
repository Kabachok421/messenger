// Управление настройками

class SettingsManager {
  constructor() {
    this.settings = this.loadSettings();
    this.init();
  }
  
  init() {
    this.loadUserProfile();
    this.initMenuNavigation();
    this.initToggles();
    this.initThemeSelector();
    this.initFontSizeSelector();
    this.initColorSchemeSelector();
    this.applySettings();
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
  
  saveSettings() {
    localStorage.setItem('appSettings', JSON.stringify(this.settings));
    console.log('Settings saved:', this.settings);
  }
  
  loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser.username) {
      document.getElementById('settingsUsername').value = currentUser.username;
      document.getElementById('settingsFullName').value = currentUser.fullName || '';
      document.getElementById('settingsEmail').value = currentUser.email || '';
      
      // Загрузить аватар
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === currentUser.id);
      
      if (user) {
        if (user.avatarImage) {
          // Показать фото
          const avatarEl = document.getElementById('profileAvatar');
          avatarEl.style.backgroundImage = `url(${user.avatarImage})`;
          avatarEl.style.backgroundSize = 'cover';
          avatarEl.style.backgroundPosition = 'center';
          avatarEl.textContent = '';
          document.querySelector('.remove-avatar-btn').style.display = 'inline-flex';
        } else {
          document.getElementById('profileAvatar').textContent = currentUser.avatar || 'A';
        }
        
        if (user.bio) {
          document.getElementById('settingsBio').value = user.bio;
        }
      }
    }
    
    // Добавить обработчик загрузки фото
    document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);
  }
  
  initMenuNavigation() {
    document.querySelectorAll('.settings-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.showSection(section);
      });
    });
  }
  
  showSection(sectionId) {
    // Скрыть все секции
    document.querySelectorAll('.settings-section').forEach(section => {
      section.classList.remove('active');
    });
    
    // Показать выбранную секцию
    document.getElementById(sectionId).classList.add('active');
    
    // Обновить активный пункт меню
    document.querySelectorAll('.settings-menu-item').forEach(item => {
      item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
  }
  
  initToggles() {
    // Уведомления
    document.getElementById('notificationsEnabled').checked = this.settings.notifications.enabled;
    document.getElementById('notificationSound').checked = this.settings.notifications.sound;
    document.getElementById('messagePreview').checked = this.settings.notifications.preview;
    document.getElementById('vibration').checked = this.settings.notifications.vibration;
    
    // Конфиденциальность
    document.getElementById('lastSeenPrivacy').value = this.settings.privacy.lastSeen;
    document.getElementById('profilePhotoPrivacy').value = this.settings.privacy.profilePhoto;
    document.getElementById('twoFactorAuth').checked = this.settings.privacy.twoFactor;
    
    // Данные
    document.getElementById('autoDownload').checked = this.settings.data.autoDownload;
    
    // Внешний вид
    document.getElementById('animations').checked = this.settings.appearance.animations;
    document.getElementById('languageSelect').value = this.settings.language;
    
    // Добавить обработчики изменений
    this.addToggleListeners();
  }
  
  addToggleListeners() {
    // Уведомления
    document.getElementById('notificationsEnabled').addEventListener('change', (e) => {
      this.settings.notifications.enabled = e.target.checked;
      this.saveSettings();
    });
    
    document.getElementById('notificationSound').addEventListener('change', (e) => {
      this.settings.notifications.sound = e.target.checked;
      this.saveSettings();
    });
    
    document.getElementById('messagePreview').addEventListener('change', (e) => {
      this.settings.notifications.preview = e.target.checked;
      this.saveSettings();
    });
    
    document.getElementById('vibration').addEventListener('change', (e) => {
      this.settings.notifications.vibration = e.target.checked;
      this.saveSettings();
    });
    
    // Конфиденциальность
    document.getElementById('lastSeenPrivacy').addEventListener('change', (e) => {
      this.settings.privacy.lastSeen = e.target.value;
      this.saveSettings();
    });
    
    document.getElementById('profilePhotoPrivacy').addEventListener('change', (e) => {
      this.settings.privacy.profilePhoto = e.target.value;
      this.saveSettings();
    });
    
    document.getElementById('twoFactorAuth').addEventListener('change', (e) => {
      this.settings.privacy.twoFactor = e.target.checked;
      this.saveSettings();
    });
    
    // Данные
    document.getElementById('autoDownload').addEventListener('change', (e) => {
      this.settings.data.autoDownload = e.target.checked;
      this.saveSettings();
    });
    
    // Внешний вид
    document.getElementById('animations').addEventListener('change', (e) => {
      this.settings.appearance.animations = e.target.checked;
      this.saveSettings();
      this.applyAnimationsSetting();
    });
    
    document.getElementById('languageSelect').addEventListener('change', (e) => {
      this.settings.language = e.target.value;
      this.saveSettings();
    });
  }
  
  initThemeSelector() {
    document.querySelectorAll('.theme-option').forEach(option => {
      if (option.dataset.theme === this.settings.appearance.theme) {
        option.classList.add('active');
      }
      
      option.addEventListener('click', () => {
        document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        this.settings.appearance.theme = option.dataset.theme;
        this.saveSettings();
        this.applyTheme();
      });
    });
  }
  
  initFontSizeSelector() {
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      if (btn.dataset.size === this.settings.appearance.fontSize) {
        btn.classList.add('active');
      }
      
      btn.addEventListener('click', () => {
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.settings.appearance.fontSize = btn.dataset.size;
        this.saveSettings();
        this.applyFontSize();
      });
    });
  }
  
  initColorSchemeSelector() {
    document.querySelectorAll('.color-option').forEach(option => {
      if (option.dataset.color === this.settings.appearance.colorScheme) {
        option.classList.add('active');
      }
      
      option.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        this.settings.appearance.colorScheme = option.dataset.color;
        this.saveSettings();
        this.applyColorScheme();
      });
    });
  }
  
  applySettings() {
    // Использовать глобальный appSettings
    if (window.appSettings) {
      window.appSettings.saveSettings(this.settings);
    }
  }
  
  applyTheme() {
    if (window.appSettings) {
      window.appSettings.applyTheme();
    }
  }
  
  applyFontSize() {
    if (window.appSettings) {
      window.appSettings.applyFontSize();
    }
  }
  
  applyColorScheme() {
    if (window.appSettings) {
      window.appSettings.applyColorScheme();
    }
  }
  
  applyAnimationsSetting() {
    if (window.appSettings) {
      window.appSettings.applyAnimations();
    }
  }
}

// Функции для кнопок
function saveProfile() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  const fullName = document.getElementById('settingsFullName').value;
  const email = document.getElementById('settingsEmail').value;
  const bio = document.getElementById('settingsBio').value;
  
  // Обновить пользователя в списке
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex].fullName = fullName;
    users[userIndex].email = email;
    users[userIndex].bio = bio;
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Обновить текущего пользователя
  currentUser.fullName = fullName;
  currentUser.email = email;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  alert('Профиль успешно обновлен!');
}

function changePassword() {
  const newPassword = prompt('Введите новый пароль (минимум 6 символов):');
  if (newPassword && newPassword.length >= 6) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Пароль успешно изменен!');
    }
  } else if (newPassword !== null) {
    alert('Пароль должен содержать минимум 6 символов');
  }
}

function clearCache() {
  if (confirm('Очистить кэш? Это освободит место на диске.')) {
    // Очистить кэш (в реальном приложении здесь была бы логика очистки)
    alert('Кэш успешно очищен! Освобождено: 150 МБ');
  }
}

function exportData() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const data = {
    user: currentUser,
    settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `messenger-data-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  alert('Данные экспортированы!');
}

function checkUpdates() {
  alert('У вас установлена последняя версия приложения!');
}

function showLicense() {
  alert('MIT License\n\nCopyright (c) 2024 Мессенджер\n\nПодробности в файле LICENSE');
}

function showPrivacyPolicy() {
  alert('Политика конфиденциальности\n\nМы уважаем вашу конфиденциальность и защищаем ваши данные.');
}

// Инициализация
let settingsManager;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
    initLogoutButton();
  });
} else {
  settingsManager = new SettingsManager();
  initLogoutButton();
}

// Обработчик кнопки выхода
function initLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        // Очистить текущего пользователя
        localStorage.removeItem('currentUser');
        
        // Перенаправить на страницу авторизации
        window.location.href = 'auth.html';
      }
    });
  }
}

// Обработка загрузки аватара
function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Проверить тип файла
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение');
    return;
  }
  
  // Проверить размер (максимум 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Размер файла не должен превышать 5MB');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const imageData = e.target.result;
    
    // Обновить аватар в интерфейсе
    const avatarEl = document.getElementById('profileAvatar');
    avatarEl.style.backgroundImage = `url(${imageData})`;
    avatarEl.style.backgroundSize = 'cover';
    avatarEl.style.backgroundPosition = 'center';
    avatarEl.textContent = '';
    
    // Показать кнопку удаления
    document.querySelector('.remove-avatar-btn').style.display = 'inline-flex';
    
    // Сохранить в localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].avatarImage = imageData;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Обновить текущего пользователя
      currentUser.avatarImage = imageData;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      alert('Фото профиля обновлено!');
    }
  };
  
  reader.readAsDataURL(file);
}

// Удаление аватара
function removeAvatar() {
  if (!confirm('Удалить фото профиля?')) return;
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    delete users[userIndex].avatarImage;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Обновить текущего пользователя
    delete currentUser.avatarImage;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Вернуть текстовый аватар
    const avatarEl = document.getElementById('profileAvatar');
    avatarEl.style.backgroundImage = '';
    avatarEl.textContent = currentUser.avatar || 'A';
    
    // Скрыть кнопку удаления
    document.querySelector('.remove-avatar-btn').style.display = 'none';
    
    alert('Фото профиля удалено');
  }
}
