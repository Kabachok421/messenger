// Инициализация демо-пользователей для тестирования

function initDemoUsers() {
  // Проверить, есть ли уже пользователи
  const existingUsers = localStorage.getItem('users');
  
  if (existingUsers) {
    console.log('Users already exist, skipping demo initialization');
    return;
  }
  
  // Создать демо-пользователей
  const demoUsers = [
    {
      id: 1,
      username: 'admin',
      fullName: 'Администратор',
      email: 'admin@messenger.com',
      password: 'admin123',
      avatar: 'А',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      username: 'user1',
      fullName: 'Иван Иванов',
      email: 'ivan@example.com',
      password: '123456',
      avatar: 'И',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      username: 'user2',
      fullName: 'Мария Петрова',
      email: 'maria@example.com',
      password: '123456',
      avatar: 'М',
      createdAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('users', JSON.stringify(demoUsers));
  console.log('Demo users initialized:', demoUsers.length);
  
  // Показать информацию о демо-пользователях
  showDemoInfo();
}

function showDemoInfo() {
  const infoDiv = document.createElement('div');
  infoDiv.className = 'demo-info';
  infoDiv.innerHTML = `
    <div class="demo-info-content">
      <h3><i class="fas fa-info-circle"></i> Демо-аккаунты</h3>
      <p>Для быстрого входа используйте:</p>
      <ul>
        <li><strong>admin</strong> / admin123</li>
        <li><strong>user1</strong> / 123456</li>
        <li><strong>user2</strong> / 123456</li>
      </ul>
      <button onclick="this.parentElement.parentElement.remove()">Понятно</button>
    </div>
  `;
  document.body.appendChild(infoDiv);
}

// Инициализация при загрузке страницы авторизации
if (window.location.pathname.includes('auth.html') || window.location.pathname === '/') {
  window.addEventListener('load', initDemoUsers);
}
