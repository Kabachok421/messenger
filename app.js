// Данные чатов
const chats = [
  { id: 1, name: 'Анна Иванова', lastMessage: 'Привет! Как дела?', time: '14:32', avatar: 'А' },
  { id: 2, name: 'Максим Петров', lastMessage: 'Отправил тебе файлы', time: '13:15', avatar: 'М' },
  { id: 3, name: 'Елена Смирнова', lastMessage: 'Спасибо за помощь!', time: '12:48', avatar: 'Е' },
  { id: 4, name: 'Дмитрий Козлов', lastMessage: 'Созвонимся завтра?', time: '11:20', avatar: 'Д' },
  { id: 5, name: 'Ольга Новикова', lastMessage: 'Отлично, договорились', time: '10:05', avatar: 'О' }
];

let currentChatId = null;
let messages = {};

// Инициализация сообщений для каждого чата
chats.forEach(chat => {
  messages[chat.id] = [
    { text: 'Привет!', sent: false, time: '10:00', type: 'text' },
    { text: 'Привет! Как дела?', sent: true, time: '10:01', type: 'text' }
  ];
});

// Отрисовка списка чатов
function renderChatList() {
  const chatList = document.getElementById('chatList');
  chatList.innerHTML = chats.map(chat => `
    <div class="chat-item ${currentChatId === chat.id ? 'active' : ''}" onclick="selectChat(${chat.id})">
      <div class="avatar">${chat.avatar}</div>
      <div class="chat-item-content">
        <div class="chat-item-header">
          <span class="chat-item-name">${chat.name}</span>
          <span class="chat-item-time">${chat.time}</span>
        </div>
        <div class="chat-item-message">${chat.lastMessage}</div>
      </div>
    </div>
  `).join('');
}

// Выбор чата
function selectChat(chatId) {
  currentChatId = chatId;
  currentChannelId = null; // Сбросить выбранный канал
  const chat = chats.find(c => c.id === chatId);
  
  // Обновление заголовка
  document.querySelector('.chat-name').textContent = chat.name;
  
  const avatarEl = document.querySelector('.chat-header .avatar');
  // Проверить, есть ли фото у контакта
  if (chat.avatarImage) {
    avatarEl.style.backgroundImage = `url(${chat.avatarImage})`;
    avatarEl.style.backgroundSize = 'cover';
    avatarEl.style.backgroundPosition = 'center';
    avatarEl.textContent = '';
  } else {
    avatarEl.style.backgroundImage = '';
    avatarEl.textContent = chat.avatar;
  }
  
  // Отрисовка сообщений
  renderMessages();
  renderChatList();
  
  // Загрузить закреплённое сообщение
  if (window.messageManager) {
    window.messageManager.loadPinnedMessage();
  }
}

// Отрисовка сообщений
function renderMessages() {
  const container = document.getElementById('messagesContainer');
  
  if (!currentChatId) {
    container.innerHTML = `
      <div class="welcome-message">
        <h2>Добро пожаловать в Мессенджер</h2>
        <p>Выберите чат из списка слева</p>
      </div>
    `;
    return;
  }
  
  const chatMessages = messages[currentChatId] || [];
  container.innerHTML = chatMessages.map((msg, index) => {
    let content = '';
    
    // Ответ на сообщение
    if (msg.replyTo) {
      content += `<div class="message-reply"><i class="fas fa-reply"></i> ${msg.replyTo.text}</div>`;
    }
    
    // Контент в зависимости от типа
    switch(msg.type) {
      case 'voice':
        content += `
          <div class="voice-message" data-url="${msg.url}">
            <button class="play-voice-btn" onclick="toggleVoicePlayback(this)">
              <i class="fas fa-play"></i>
            </button>
            <div class="voice-waveform">
              <div class="voice-bar" style="height: 40%"></div>
              <div class="voice-bar" style="height: 70%"></div>
              <div class="voice-bar" style="height: 50%"></div>
              <div class="voice-bar" style="height: 85%"></div>
              <div class="voice-bar" style="height: 60%"></div>
              <div class="voice-bar" style="height: 90%"></div>
              <div class="voice-bar" style="height: 45%"></div>
              <div class="voice-bar" style="height: 75%"></div>
              <div class="voice-bar" style="height: 55%"></div>
              <div class="voice-bar" style="height: 80%"></div>
              <div class="voice-bar" style="height: 65%"></div>
              <div class="voice-bar" style="height: 50%"></div>
              <div class="voice-bar" style="height: 70%"></div>
              <div class="voice-bar" style="height: 40%"></div>
              <div class="voice-bar" style="height: 60%"></div>
              <div class="voice-bar" style="height: 85%"></div>
              <div class="voice-bar" style="height: 45%"></div>
              <div class="voice-bar" style="height: 75%"></div>
              <div class="voice-bar" style="height: 55%"></div>
              <div class="voice-bar" style="height: 65%"></div>
            </div>
            <span class="voice-duration">${msg.duration}</span>
            <audio src="${msg.url}" style="display: none;"></audio>
          </div>
        `;
        break;
      
      case 'image':
        content += `
          <div class="message-media">
            <img src="${msg.url}" alt="${msg.fileName}" class="message-image">
          </div>
        `;
        break;
      
      case 'video':
        content += `
          <div class="message-media">
            <video src="${msg.url}" controls class="message-video"></video>
          </div>
        `;
        break;
      
      case 'audio':
        content += `
          <div class="message-file">
            <i class="fas fa-music file-icon"></i>
            <div class="file-info">
              <div class="file-name">${msg.fileName}</div>
              <div class="file-size">${msg.size}</div>
            </div>
          </div>
        `;
        break;
      
      case 'file':
        content += `
          <div class="message-file">
            <i class="fas fa-file file-icon"></i>
            <div class="file-info">
              <div class="file-name">${msg.fileName}</div>
              <div class="file-size">${msg.size}</div>
            </div>
            <button class="download-btn"><i class="fas fa-download"></i></button>
          </div>
        `;
        break;
      
      case 'sticker':
        content += `<img src="${msg.url}" alt="Sticker" class="message-sticker">`;
        break;
      
      case 'location':
        content += `
          <div class="message-location">
            <i class="fas fa-map-marker-alt"></i>
            <div class="location-text">${msg.text}</div>
          </div>
        `;
        break;
      
      default:
        content += `<div class="message-text">${msg.text}</div>`;
    }
    
    // Время и статус редактирования
    const timeHtml = `
      <div class="message-time">
        ${msg.edited ? '<i class="fas fa-pencil-alt edited-icon"></i> ' : ''}
        ${msg.time}
      </div>
    `;
    
    // Проверить, закреплено ли сообщение
    const isPinned = window.messageManager && window.messageManager.pinnedMessage && 
                     window.messageManager.pinnedMessage.chatId === currentChatId && 
                     window.messageManager.pinnedMessage.index === index;
    
    return `
      <div class="message ${msg.sent ? 'sent' : 'received'} ${isPinned ? 'pinned' : ''} ${msg.forwarded ? 'forwarded' : ''}" 
           data-message-index="${index}">
        <div class="message-bubble ${msg.type === 'sticker' ? 'sticker-bubble' : ''}">
          ${content}
          ${msg.type !== 'sticker' ? timeHtml : ''}
        </div>
      </div>
    `;
  }).join('');
  
  // Прокрутка вниз
  container.scrollTop = container.scrollHeight;
  
  // Добавить обработчики контекстного меню после рендеринга
  setTimeout(() => {
    const messages = container.querySelectorAll('.message');
    console.log('Adding context menu handlers to', messages.length, 'messages');
    
    messages.forEach(messageEl => {
      messageEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const index = parseInt(messageEl.dataset.messageIndex);
        console.log('Right click on message index:', index);
        
        if (window.messageManager) {
          window.messageManager.showContextMenu(e, index);
        } else {
          console.error('messageManager not found');
        }
      });
    });
  }, 100);
}

// Отправка сообщения
function sendMessage() {
  if (!currentChatId) return;
  
  const input = document.getElementById('messageInput');
  const text = input.value.trim();
  
  if (!text) return;
  
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  messages[currentChatId].push({
    text: text,
    sent: true,
    time: time
  });
  
  // Обновление последнего сообщения в списке чатов
  const chat = chats.find(c => c.id === currentChatId);
  chat.lastMessage = text;
  chat.time = time;
  
  input.value = '';
  renderMessages();
  renderChatList();
  
  // Симуляция ответа
  setTimeout(() => {
    const responseMessage = {
      text: 'Получил ваше сообщение!',
      sent: false,
      time: `${now.getHours()}:${String(now.getMinutes() + 1).padStart(2, '0')}`,
      type: 'text'
    };
    
    messages[currentChatId].push(responseMessage);
    renderMessages();
    
    // Показать уведомление о новом сообщении
    if (window.appSettings) {
      const chat = chats.find(c => c.id === currentChatId);
      window.appSettings.showNotification(
        chat.name,
        responseMessage.text,
        null
      );
    }
  }, 1000);
}

// Инициализация
renderChatList();


// Воспроизведение голосовых сообщений
function toggleVoicePlayback(button) {
  const voiceMessage = button.closest('.voice-message');
  const audio = voiceMessage.querySelector('audio');
  const icon = button.querySelector('i');
  const bars = voiceMessage.querySelectorAll('.voice-bar');
  
  if (audio.paused) {
    // Остановить все другие голосовые сообщения
    document.querySelectorAll('.voice-message audio').forEach(a => {
      if (a !== audio) {
        a.pause();
        a.currentTime = 0;
        const btn = a.closest('.voice-message').querySelector('.play-voice-btn i');
        btn.className = 'fas fa-play';
        a.closest('.voice-message').querySelectorAll('.voice-bar').forEach(bar => {
          bar.classList.remove('playing');
        });
      }
    });
    
    audio.play();
    icon.className = 'fas fa-pause';
    bars.forEach((bar, index) => {
      bar.classList.add('playing');
      bar.style.animationDelay = `${index * 0.05}s`;
    });
  } else {
    audio.pause();
    icon.className = 'fas fa-play';
    bars.forEach(bar => bar.classList.remove('playing'));
  }
  
  audio.onended = () => {
    icon.className = 'fas fa-play';
    bars.forEach(bar => bar.classList.remove('playing'));
    audio.currentTime = 0;
  };
}


// Управление интерфейсом
document.addEventListener('DOMContentLoaded', () => {
  // Кнопка настроек
  const settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      window.location.href = 'settings.html';
    });
  }
  
  // Кнопка меню (сворачивание боковой панели)
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.querySelector('.sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }
  
  // Переключение вкладок
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      // Обновить активную вкладку
      document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Показать соответствующий список
      if (tabName === 'chats') {
        document.getElementById('chatList').style.display = 'block';
        document.getElementById('channelList').style.display = 'none';
        currentChannelId = null;
      } else if (tabName === 'channels') {
        document.getElementById('chatList').style.display = 'none';
        document.getElementById('channelList').style.display = 'block';
        currentChatId = null;
      }
    });
  });
  
  // Кнопка создания
  const createBtn = document.getElementById('createBtn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const activeTab = document.querySelector('.sidebar-tab.active').dataset.tab;
      
      if (activeTab === 'channels') {
        createChannel();
      } else {
        alert('Создание новых чатов будет доступно позже');
      }
    });
  }
  
  // Поиск
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      
      // Поиск в чатах
      document.querySelectorAll('.chat-item').forEach(item => {
        const name = item.querySelector('.chat-item-name').textContent.toLowerCase();
        const message = item.querySelector('.chat-item-message').textContent.toLowerCase();
        
        if (name.includes(query) || message.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
      
      // Поиск в каналах
      document.querySelectorAll('.channel-item').forEach(item => {
        const name = item.querySelector('.channel-name').textContent.toLowerCase();
        const desc = item.querySelector('.channel-description').textContent.toLowerCase();
        
        if (name.includes(query) || desc.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
  
  // Контекстное меню для каналов
  document.addEventListener('contextmenu', (e) => {
    const channelItem = e.target.closest('.channel-item');
    if (channelItem) {
      e.preventDefault();
      const channelId = parseInt(channelItem.onclick.toString().match(/\d+/)[0]);
      showChannelContextMenu(e, channelId);
    }
  });
});


// Контекстное меню для каналов
function showChannelContextMenu(e, channelId) {
  const menu = document.createElement('div');
  menu.className = 'message-context-menu';
  menu.style.display = 'block';
  menu.style.left = e.pageX + 'px';
  menu.style.top = e.pageY + 'px';
  
  const channel = channels.find(c => c.id === channelId);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isCreator = channel.creator === currentUser.id;
  
  menu.innerHTML = `
    <button class="context-menu-item" onclick="selectChannel(${channelId}); this.parentElement.remove();">
      <i class="fas fa-eye"></i>
      <span>Открыть</span>
    </button>
    ${isCreator ? `
      <button class="context-menu-item" onclick="manageChannelAdmins(${channelId}); this.parentElement.remove();">
        <i class="fas fa-user-shield"></i>
        <span>Управление админами</span>
      </button>
      <button class="context-menu-item danger" onclick="deleteChannel(${channelId}); this.parentElement.remove();">
        <i class="fas fa-trash"></i>
        <span>Удалить канал</span>
      </button>
    ` : ''}
  `;
  
  document.body.appendChild(menu);
  
  // Закрыть при клике вне меню
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 0);
}

// Удаление канала
function deleteChannel(channelId) {
  if (!confirm('Удалить канал? Это действие нельзя отменить.')) return;
  
  channels = channels.filter(c => c.id !== channelId);
  saveChannels();
  renderChannels();
  
  if (currentChannelId === channelId) {
    currentChannelId = null;
    document.getElementById('messagesContainer').innerHTML = `
      <div class="welcome-message">
        <h2>Добро пожаловать в Мессенджер</h2>
        <p>Выберите чат или канал из списка слева</p>
      </div>
    `;
  }
}
