// Система авторизации и регистрации

// Проверка авторизации при загрузке
window.addEventListener('load', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    // Пользователь уже авторизован, перенаправить в мессенджер
    window.location.href = 'index.html';
  }
});

// Переключение между формами
function showRegister() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
  clearMessages();
}

function showLogin() {
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
  clearMessages();
}

// Очистка сообщений об ошибках
function clearMessages() {
  const messages = document.querySelectorAll('.error-message, .success-message');
  messages.forEach(msg => msg.remove());
}

// Показать ошибку
function showError(formId, message) {
  clearMessages();
  const form = document.getElementById(formId);
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  form.querySelector('form').prepend(errorDiv);
}

// Показать успех
function showSuccess(formId, message) {
  clearMessages();
  const form = document.getElementById(formId);
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  form.querySelector('form').prepend(successDiv);
}

// Обработка входа
function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  // Получить список пользователей
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Найти пользователя
  const user = users.find(u => u.username === username);
  
  if (!user) {
    showError('loginForm', 'Пользователь не найден');
    return;
  }
  
  if (user.password !== password) {
    showError('loginForm', 'Неверный пароль');
    return;
  }
  
  // Успешный вход
  localStorage.setItem('currentUser', JSON.stringify({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar
  }));
  
  showSuccess('loginForm', 'Вход выполнен успешно!');
  
  // Перенаправление в мессенджер
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// Обработка регистрации
function handleRegister(event) {
  event.preventDefault();
  
  const username = document.getElementById('registerUsername').value.trim();
  const fullName = document.getElementById('registerFullName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  
  // Валидация
  if (username.length < 3) {
    showError('registerForm', 'Имя пользователя должно быть не менее 3 символов');
    return;
  }
  
  if (password.length < 6) {
    showError('registerForm', 'Пароль должен быть не менее 6 символов');
    return;
  }
  
  if (password !== confirmPassword) {
    showError('registerForm', 'Пароли не совпадают');
    return;
  }
  
  // Получить список пользователей
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Проверить, существует ли пользователь
  if (users.find(u => u.username === username)) {
    showError('registerForm', 'Пользователь с таким именем уже существует');
    return;
  }
  
  if (users.find(u => u.email === email)) {
    showError('registerForm', 'Пользователь с таким email уже существует');
    return;
  }
  
  // Создать нового пользователя
  const newUser = {
    id: Date.now(),
    username: username,
    fullName: fullName,
    email: email,
    password: password,
    avatar: fullName.charAt(0).toUpperCase(),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  showSuccess('registerForm', 'Регистрация успешна! Перенаправление...');
  
  // Автоматический вход
  localStorage.setItem('currentUser', JSON.stringify({
    id: newUser.id,
    username: newUser.username,
    fullName: newUser.fullName,
    email: newUser.email,
    avatar: newUser.avatar
  }));
  
  // Перенаправление в мессенджер
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}
