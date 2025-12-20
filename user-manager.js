// Управление пользователями в мессенджере

class UserManager {
  constructor() {
    this.currentUser = null;
    this.init();
  }
  
  init() {
    // Проверить авторизацию
    const userData = localStorage.getItem('currentUser');
    
    if (!userData) {
      // Пользователь не авторизован, перенаправить на страницу входа
      window.location.href = 'auth.html';
      return;
    }
    
    this.currentUser = JSON.parse(userData);
    console.log('Current user:', this.currentUser);
    
    // Обновить интерфейс
    this.updateUI();
  }
  
  updateUI() {
    // Обновить информацию о пользователе в интерфейсе
    const userAvatar = document.querySelector('.sidebar-header .menu-btn');
    if (userAvatar && this.currentUser) {
      // Проверить, есть ли фото профиля
      if (this.currentUser.avatarImage) {
        userAvatar.innerHTML = '';
        userAvatar.style.backgroundImage = `url(${this.currentUser.avatarImage})`;
        userAvatar.style.backgroundSize = 'cover';
        userAvatar.style.backgroundPosition = 'center';
      } else {
        userAvatar.innerHTML = `<span style="font-size: 20px; font-weight: bold;">${this.currentUser.avatar}</span>`;
        userAvatar.style.backgroundImage = '';
      }
      userAvatar.title = this.currentUser.fullName;
    }
  }
  
  getCurrentUser() {
    return this.currentUser;
  }
  
  getAllUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Исключить текущего пользователя
    return users.filter(u => u.id !== this.currentUser.id);
  }
  
  getUserById(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === userId);
  }
}

// Инициализация
window.userManager = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUserManager);
} else {
  initUserManager();
}

function initUserManager() {
  console.log('Initializing UserManager');
  try {
    window.userManager = new UserManager();
    console.log('UserManager initialized successfully');
  } catch (error) {
    console.error('Error initializing UserManager:', error);
  }
}
