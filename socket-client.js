// Клиент для работы с WebSocket сервером
class SocketClient {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.currentUser = null;
    this.messageHandlers = [];
    this.statusHandlers = [];
    this.callHandlers = [];
  }
  
  // Подключение к серверу
  connect(userId) {
    return new Promise((resolve, reject) => {
      try {
        // Загрузить Socket.IO клиент
        if (typeof io === 'undefined') {
          console.error('Socket.IO client not loaded. Add: <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>');
          reject(new Error('Socket.IO not loaded'));
          return;
        }
        
        this.socket = io(SERVER_CONFIG.serverUrl, SERVER_CONFIG.socketOptions);
        
        this.socket.on('connect', () => {
          console.log('✅ Connected to server');
          this.connected = true;
          
          // Отправить статус онлайн
          this.socket.emit('user_online', { userId: userId });
          this.currentUser = userId;
          
          resolve();
        });
        
        this.socket.on('disconnect', () => {
          console.log('❌ Disconnected from server');
          this.connected = false;
        });
        
        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });
        
        // Обработчики событий
        this.setupEventHandlers();
        
      } catch (error) {
        console.error('Failed to connect:', error);
        reject(error);
      }
    });
  }
  
  // Настройка обработчиков событий
  setupEventHandlers() {
    // Новое сообщение
    this.socket.on('new_message', (data) => {
      console.log('📨 New message:', data);
      this.messageHandlers.forEach(handler => handler(data));
    });
    
    // Сообщение отправлено
    this.socket.on('message_sent', (data) => {
      console.log('✅ Message sent:', data);
    });
    
    // Статус пользователя
    this.socket.on('user_status', (data) => {
      console.log('👤 User status:', data);
      this.statusHandlers.forEach(handler => handler(data));
    });
    
    // Входящий звонок
    this.socket.on('incoming_call', (data) => {
      console.log('📞 Incoming call:', data);
      this.callHandlers.forEach(handler => handler('incoming', data));
    });
    
    // Звонок принят
    this.socket.on('call_answered', (data) => {
      console.log('✅ Call answered:', data);
      this.callHandlers.forEach(handler => handler('answered', data));
    });
    
    // Звонок отклонён
    this.socket.on('call_rejected', (data) => {
      console.log('❌ Call rejected:', data);
      this.callHandlers.forEach(handler => handler('rejected', data));
    });
    
    // Звонок завершён
    this.socket.on('call_ended', (data) => {
      console.log('📴 Call ended:', data);
      this.callHandlers.forEach(handler => handler('ended', data));
    });
    
    // WebRTC signaling
    this.socket.on('webrtc_offer', (data) => {
      this.callHandlers.forEach(handler => handler('offer', data));
    });
    
    this.socket.on('webrtc_answer', (data) => {
      this.callHandlers.forEach(handler => handler('answer', data));
    });
    
    this.socket.on('webrtc_ice_candidate', (data) => {
      this.callHandlers.forEach(handler => handler('ice_candidate', data));
    });
  }
  
  // Отправить сообщение
  sendMessage(chatId, recipientId, message) {
    if (!this.connected) {
      console.error('Not connected to server');
      return;
    }
    
    this.socket.emit('send_message', {
      chatId: chatId,
      recipientId: recipientId,
      senderId: this.currentUser,
      message: message
    });
  }
  
  // Получить историю сообщений
  getMessages(chatId) {
    return new Promise((resolve) => {
      if (!this.connected) {
        resolve([]);
        return;
      }
      
      this.socket.emit('get_messages', { chatId: chatId });
      
      this.socket.once('messages_history', (data) => {
        resolve(data.messages);
      });
    });
  }
  
  // Инициировать звонок
  initiateCall(recipientId, callType) {
    return new Promise((resolve) => {
      if (!this.connected) {
        resolve(null);
        return;
      }
      
      this.socket.emit('call_initiate', {
        callerId: this.currentUser,
        recipientId: recipientId,
        type: callType
      });
      
      this.socket.once('call_initiated', (data) => {
        resolve(data.callId);
      });
    });
  }
  
  // Принять звонок
  answerCall(callId) {
    if (!this.connected) return;
    this.socket.emit('call_answer', { callId: callId });
  }
  
  // Отклонить звонок
  rejectCall(callId) {
    if (!this.connected) return;
    this.socket.emit('call_reject', { callId: callId });
  }
  
  // Завершить звонок
  endCall(callId) {
    if (!this.connected) return;
    this.socket.emit('call_end', { callId: callId });
  }
  
  // WebRTC signaling
  sendOffer(callId, offer) {
    if (!this.connected) return;
    this.socket.emit('webrtc_offer', {
      callId: callId,
      offer: offer
    });
  }
  
  sendAnswer(callId, answer) {
    if (!this.connected) return;
    this.socket.emit('webrtc_answer', {
      callId: callId,
      answer: answer
    });
  }
  
  sendIceCandidate(callId, candidate) {
    if (!this.connected) return;
    this.socket.emit('webrtc_ice_candidate', {
      callId: callId,
      senderId: this.currentUser,
      candidate: candidate
    });
  }
  
  // Подписаться на новые сообщения
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }
  
  // Подписаться на изменения статуса
  onUserStatus(handler) {
    this.statusHandlers.push(handler);
  }
  
  // Подписаться на события звонков
  onCall(handler) {
    this.callHandlers.push(handler);
  }
  
  // Отключиться от сервера
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
    }
  }
}

// Создать глобальный экземпляр
window.socketClient = new SocketClient();
