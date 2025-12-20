// Конфигурация подключения к серверу
const SERVER_CONFIG = {
  // ============================================
  // ВАЖНО: Укажите здесь адрес вашего сервера!
  // ============================================
  
  // Для локального использования:
  serverUrl: 'http://localhost:5000',
  
  // Для интернета (замените на ваш адрес):
  // serverUrl: 'https://your-app.railway.app',
  // serverUrl: 'https://your-app.onrender.com',
  // serverUrl: 'http://YOUR_VPS_IP:5000',
  
  // Настройки WebSocket
  socketOptions: {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10
  },
  
  // Настройки WebRTC для звонков через интернет
  webrtcConfig: {
    iceServers: [
      // STUN серверы (бесплатные, для определения IP)
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      
      // Дополнительные STUN серверы
      { urls: 'stun:stun.stunprotocol.org:3478' },
      { urls: 'stun:stun.voip.blackberry.com:3478' }
      
      // TURN сервер (нужен для NAT/файрвол, платный или свой)
      // Раскомментируйте и укажите свой TURN сервер для надёжных звонков:
      // {
      //   urls: 'turn:your-turn-server.com:3478',
      //   username: 'user',
      //   credential: 'password'
      // }
    ]
  }
};

// Автоматическое определение URL сервера
// Если открыто с сервера - используем его адрес, иначе localhost
if (window.location.hostname !== '' && window.location.protocol !== 'file:') {
  SERVER_CONFIG.serverUrl = window.location.origin;
}

// Глобальная переменная для доступа к URL сервера
window.SERVER_URL = SERVER_CONFIG.serverUrl;

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SERVER_CONFIG;
}
