// Управление каналами

let channels = [];
let currentChannelId = null;

// Инициализация каналов
function initChannels() {
  const savedChannels = localStorage.getItem('channels');
  if (savedChannels) {
    channels = JSON.parse(savedChannels);
  } else {
    // Создать демо-каналы
    channels = [
      {
        id: 1,
        name: 'Новости',
        description: 'Последние новости и обновления',
        icon: '📰',
        subscribers: 1234,
        admins: [1], // ID пользователей-администраторов
        creator: 1,
        messages: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Технологии',
        description: 'Всё о технологиях и инновациях',
        icon: '💻',
        subscribers: 856,
        admins: [1],
        creator: 1,
        messages: [],
        createdAt: new Date().toISOString()
      }
    ];
    saveChannels();
  }
}

function saveChannels() {
  localStorage.setItem('channels', JSON.stringify(channels));
}

// Отрисовка списка каналов
function renderChannels() {
  const channelList = document.getElementById('channelList');
  if (!channelList) return;
  
  if (channels.length === 0) {
    channelList.innerHTML = `
      <div class="welcome-message" style="padding: 40px 20px;">
        <h2>Нет каналов</h2>
        <p>Создайте свой первый канал!</p>
      </div>
    `;
    return;
  }
  
  channelList.innerHTML = channels.map(channel => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = channel.admins.includes(currentUser.id);
    
    return `
      <div class="channel-item ${currentChannelId === channel.id ? 'active' : ''}" 
           onclick="selectChannel(${channel.id})">
        <div class="channel-icon">${channel.icon}</div>
        <div class="channel-content">
          <div class="channel-header">
            <div class="channel-name">
              ${channel.name}
              ${isAdmin ? '<span class="channel-badge">ADMIN</span>' : ''}
            </div>
            <span class="channel-subscribers">${channel.subscribers} подписчиков</span>
          </div>
          <div class="channel-description">${channel.description}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Выбор канала
function selectChannel(channelId) {
  currentChannelId = channelId;
  currentChatId = null; // Сбросить выбранный чат
  
  const channel = channels.find(c => c.id === channelId);
  if (!channel) return;
  
  // Обновить заголовок
  document.querySelector('.chat-name').textContent = channel.name;
  
  const avatarEl = document.querySelector('.chat-header .avatar');
  avatarEl.style.backgroundImage = '';
  avatarEl.textContent = channel.icon;
  
  document.querySelector('.chat-status').textContent = `${channel.subscribers} подписчиков`;
  
  // Показать сообщения канала
  renderChannelMessages(channel);
  renderChannels();
}

// Отрисовка сообщений канала
function renderChannelMessages(channel) {
  const container = document.getElementById('messagesContainer');
  
  if (channel.messages.length === 0) {
    container.innerHTML = `
      <div class="welcome-message">
        <h2>${channel.name}</h2>
        <p>${channel.description}</p>
        <p style="margin-top: 20px; color: #999;">Пока нет сообщений</p>
      </div>
    `;
    return;
  }
  
  // Использовать существующую функцию рендеринга
  container.innerHTML = channel.messages.map((msg, index) => {
    return `
      <div class="message received">
        <div class="message-bubble">
          <div class="message-text">${msg.text}</div>
          <div class="message-time">${msg.time}</div>
        </div>
      </div>
    `;
  }).join('');
  
  container.scrollTop = container.scrollHeight;
}

// Создание канала
function createChannel() {
  const name = prompt('Название канала:');
  if (!name) return;
  
  const description = prompt('Описание канала:');
  if (!description) return;
  
  const icon = prompt('Эмодзи для канала (например: 📢):') || '📢';
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const newChannel = {
    id: Date.now(),
    name: name,
    description: description,
    icon: icon,
    subscribers: 1,
    admins: [currentUser.id],
    creator: currentUser.id,
    messages: [],
    createdAt: new Date().toISOString()
  };
  
  channels.push(newChannel);
  saveChannels();
  renderChannels();
  
  alert(`Канал "${name}" создан!`);
}

// Управление администраторами
function manageChannelAdmins(channelId) {
  const channel = channels.find(c => c.id === channelId);
  if (!channel) return;
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  // Проверить, является ли пользователь создателем
  if (channel.creator !== currentUser.id) {
    alert('Только создатель канала может управлять администраторами');
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const availableUsers = users.filter(u => u.id !== currentUser.id);
  
  if (availableUsers.length === 0) {
    alert('Нет доступных пользователей');
    return;
  }
  
  let userList = 'Выберите пользователя для назначения администратором:\n\n';
  availableUsers.forEach((user, index) => {
    const isAdmin = channel.admins.includes(user.id);
    userList += `${index + 1}. ${user.fullName} (${user.username}) ${isAdmin ? '✓ ADMIN' : ''}\n`;
  });
  
  const choice = prompt(userList + '\nВведите номер пользователя:');
  if (!choice) return;
  
  const userIndex = parseInt(choice) - 1;
  if (userIndex < 0 || userIndex >= availableUsers.length) {
    alert('Неверный выбор');
    return;
  }
  
  const selectedUser = availableUsers[userIndex];
  
  if (channel.admins.includes(selectedUser.id)) {
    // Удалить из администраторов
    channel.admins = channel.admins.filter(id => id !== selectedUser.id);
    alert(`${selectedUser.fullName} удалён из администраторов`);
  } else {
    // Добавить в администраторы
    channel.admins.push(selectedUser.id);
    alert(`${selectedUser.fullName} назначен администратором`);
  }
  
  saveChannels();
  renderChannels();
}

// Отправка сообщения в канал
function sendChannelMessage(text) {
  if (!currentChannelId) return;
  
  const channel = channels.find(c => c.id === currentChannelId);
  if (!channel) return;
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  // Проверить, является ли пользователь администратором
  if (!channel.admins.includes(currentUser.id)) {
    alert('Только администраторы могут отправлять сообщения в канал');
    return;
  }
  
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const message = {
    text: text,
    time: time,
    author: currentUser.fullName,
    authorId: currentUser.id
  };
  
  channel.messages.push(message);
  saveChannels();
  renderChannelMessages(channel);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  initChannels();
  renderChannels();
});
