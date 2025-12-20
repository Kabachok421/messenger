/**
 * Система обновлений мессенджера
 * Проверяет наличие обновлений и показывает красивое модальное окно
 */

class UpdateManager {
  constructor() {
    this.currentVersion = '1.0.0';
    this.checkInterval = 30000; // Проверять каждые 30 секунд
    this.updateInfo = null;
    
    this.init();
  }
  
  init() {
    // Создать модальное окно обновления
    this.createUpdateModal();
    
    // Проверить доступность сервера перед запуском проверки обновлений
    this.checkServerAvailability().then(available => {
      if (available) {
        // Проверить обновления при загрузке
        this.checkForUpdates();
        
        // Периодически проверять обновления
        setInterval(() => this.checkForUpdates(), this.checkInterval);
      } else {
        console.log('Update system disabled - server not available');
      }
    });
    
    // Слушать события от сервера через Socket.IO
    if (window.socket) {
      window.socket.on('update_available', (data) => {
        console.log('Update available:', data);
        this.updateInfo = data;
        this.showUpdateNotification(data);
      });
      
      window.socket.on('update_cancelled', () => {
        this.hideUpdateNotification();
      });
    }
  }
  
  async checkServerAvailability() {
    try {
      if (!window.SERVER_URL) {
        return false;
      }
      
      const response = await fetch(`${window.SERVER_URL}/api/update/check`, {
        method: 'GET',
        timeout: 5000
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  async checkForUpdates() {
    try {
      // Проверить доступность сервера
      if (!window.SERVER_URL) {
        console.log('Server URL not configured');
        return;
      }
      
      const response = await fetch(`${window.SERVER_URL}/api/update/check`);
      
      if (!response.ok) {
        console.log('Server not available for updates');
        return;
      }
      
      const data = await response.json();
      
      if (data.available && data.new_version !== this.currentVersion) {
        this.updateInfo = data;
        this.showUpdateNotification(data);
      }
    } catch (error) {
      // Тихо игнорировать ошибки подключения - сервер может быть не запущен
      console.log('Update check skipped - server not available');
    }
  }
  
  createUpdateModal() {
    const modal = document.createElement('div');
    modal.id = 'updateNotification';
    modal.className = 'update-notification';
    modal.innerHTML = `
      <div class="update-content">
        <div class="update-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <div class="update-info">
          <h2 class="update-title">Доступно обновление!</h2>
          <p class="update-version">Версия <span id="updateVersionText"></span></p>
          <div class="update-changelog">
            <h3>Что нового:</h3>
            <ul id="updateChangelogList"></ul>
          </div>
        </div>
        <div class="update-actions">
          <button class="update-btn update-btn-primary" onclick="updateManager.installUpdate()">
            <i class="fas fa-download"></i>
            <span>Обновить сейчас</span>
          </button>
          <button class="update-btn update-btn-secondary" onclick="updateManager.remindLater()">
            <i class="fas fa-clock"></i>
            <span>Напомнить позже</span>
          </button>
        </div>
        <div class="update-progress" id="updateProgress">
          <div class="progress-bar">
            <div class="progress-fill" id="updateProgressFill"></div>
          </div>
          <p class="progress-text" id="updateProgressText">Загрузка обновления...</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Добавить стили
    this.addStyles();
  }
  
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .update-notification {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.4s ease;
      }
      
      .update-notification.show {
        display: flex;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      .update-content {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 30px;
        padding: 50px;
        max-width: 600px;
        width: 90%;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(100px) scale(0.9);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
      
      .update-icon {
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 30px;
        animation: pulse 2s infinite, rotate 20s linear infinite;
      }
      
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      .update-icon i {
        font-size: 50px;
        color: white;
      }
      
      .update-info {
        text-align: center;
        color: white;
        margin-bottom: 30px;
      }
      
      .update-title {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 10px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }
      
      .update-version {
        font-size: 18px;
        opacity: 0.9;
        margin-bottom: 25px;
      }
      
      .update-changelog {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 15px;
        padding: 20px;
        text-align: left;
        backdrop-filter: blur(10px);
      }
      
      .update-changelog h3 {
        font-size: 18px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      
      .update-changelog ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .update-changelog li {
        padding: 8px 0;
        padding-left: 30px;
        position: relative;
        font-size: 15px;
        line-height: 1.6;
        animation: slideInLeft 0.5s ease forwards;
        opacity: 0;
      }
      
      .update-changelog li:nth-child(1) { animation-delay: 0.1s; }
      .update-changelog li:nth-child(2) { animation-delay: 0.2s; }
      .update-changelog li:nth-child(3) { animation-delay: 0.3s; }
      .update-changelog li:nth-child(4) { animation-delay: 0.4s; }
      .update-changelog li:nth-child(5) { animation-delay: 0.5s; }
      
      @keyframes slideInLeft {
        from {
          transform: translateX(-20px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .update-changelog li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #43e97b;
        font-weight: bold;
        font-size: 18px;
      }
      
      .update-actions {
        display: flex;
        gap: 15px;
        margin-top: 30px;
      }
      
      .update-btn {
        flex: 1;
        padding: 18px 30px;
        border: none;
        border-radius: 15px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
      }
      
      .update-btn:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      
      .update-btn:hover:before {
        width: 300px;
        height: 300px;
      }
      
      .update-btn span,
      .update-btn i {
        position: relative;
        z-index: 1;
      }
      
      .update-btn-primary {
        background: white;
        color: #667eea;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }
      
      .update-btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      }
      
      .update-btn-secondary {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
      }
      
      .update-btn-secondary:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-3px);
      }
      
      .update-progress {
        display: none;
        margin-top: 30px;
        animation: fadeIn 0.3s;
      }
      
      .update-progress.show {
        display: block;
      }
      
      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 15px;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #43e97b, #38f9d7);
        border-radius: 10px;
        width: 0%;
        transition: width 0.3s ease;
        box-shadow: 0 0 20px rgba(67, 233, 123, 0.5);
      }
      
      .progress-text {
        text-align: center;
        color: white;
        font-size: 14px;
        opacity: 0.9;
      }
      
      @media (max-width: 768px) {
        .update-content {
          padding: 30px;
        }
        
        .update-title {
          font-size: 24px;
        }
        
        .update-actions {
          flex-direction: column;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  showUpdateNotification(data) {
    const modal = document.getElementById('updateNotification');
    const versionText = document.getElementById('updateVersionText');
    const changelogList = document.getElementById('updateChangelogList');
    
    // Установить версию
    versionText.textContent = data.new_version;
    
    // Установить список изменений
    changelogList.innerHTML = '';
    data.changelog.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      changelogList.appendChild(li);
    });
    
    // Показать модальное окно
    modal.classList.add('show');
    
    // Если обновление обязательное, скрыть кнопку "Напомнить позже"
    if (data.mandatory) {
      const remindBtn = modal.querySelector('.update-btn-secondary');
      if (remindBtn) {
        remindBtn.style.display = 'none';
      }
    }
  }
  
  hideUpdateNotification() {
    const modal = document.getElementById('updateNotification');
    modal.classList.remove('show');
  }
  
  async installUpdate() {
    const progressDiv = document.getElementById('updateProgress');
    const progressFill = document.getElementById('updateProgressFill');
    const progressText = document.getElementById('updateProgressText');
    const actionsDiv = document.querySelector('.update-actions');
    
    // Скрыть кнопки, показать прогресс
    actionsDiv.style.display = 'none';
    progressDiv.classList.add('show');
    
    // Симуляция загрузки обновления
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      
      progressFill.style.width = progress + '%';
      
      if (progress < 30) {
        progressText.textContent = 'Загрузка обновления...';
      } else if (progress < 60) {
        progressText.textContent = 'Установка файлов...';
      } else if (progress < 90) {
        progressText.textContent = 'Применение изменений...';
      } else if (progress >= 100) {
        progressText.textContent = 'Обновление завершено!';
        clearInterval(interval);
        
        // Через 2 секунды перезагрузить страницу
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }, 200);
  }
  
  remindLater() {
    this.hideUpdateNotification();
    
    // Показать уведомление
    if (window.showNotification) {
      window.showNotification('Напомним об обновлении позже', 'info');
    }
  }
}

// Создать глобальный экземпляр
window.updateManager = new UpdateManager();
