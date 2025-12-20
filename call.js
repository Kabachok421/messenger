// Управление звонками и трансляцией экрана
class CallManager {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.screenStream = null;
    this.peerConnection = null;
    this.isVideoCall = false;
    this.isScreenSharing = false;
    this.isMicEnabled = true;
    this.isCameraEnabled = true;
    this.isSpeakerEnabled = true;
    
    this.initElements();
    this.initEventListeners();
  }
  
  initElements() {
    this.callModal = document.getElementById('callModal');
    this.localVideo = document.getElementById('localVideo');
    this.remoteVideo = document.getElementById('remoteVideo');
    this.callTitle = document.getElementById('callTitle');
    this.callerName = document.getElementById('callerName');
    this.callStatus = document.getElementById('callStatus');
    this.callInfo = document.getElementById('callInfo');
  }
  
  initEventListeners() {
    // Кнопки в заголовке чата
    document.getElementById('voiceCallBtn').addEventListener('click', () => this.startCall(false));
    document.getElementById('videoCallBtn').addEventListener('click', () => this.startCall(true));
    document.getElementById('screenShareBtn').addEventListener('click', () => this.startScreenShare());
    
    // Кнопки управления звонком
    document.getElementById('closeCallBtn').addEventListener('click', () => this.endCall());
    document.getElementById('endCallBtn').addEventListener('click', () => this.endCall());
    document.getElementById('toggleMicBtn').addEventListener('click', () => this.toggleMic());
    document.getElementById('toggleCameraBtn').addEventListener('click', () => this.toggleCamera());
    document.getElementById('toggleScreenBtn').addEventListener('click', () => this.toggleScreenShare());
    document.getElementById('toggleSpeakerBtn').addEventListener('click', () => this.toggleSpeaker());
  }
  
  async startCall(isVideo) {
    if (!currentChatId) {
      alert('Выберите чат для звонка');
      return;
    }
    
    this.isVideoCall = isVideo;
    this.callTitle.textContent = isVideo ? 'Видео звонок' : 'Голосовой звонок';
    
    const chat = chats.find(c => c.id === currentChatId);
    this.callerName.textContent = chat.name;
    this.callStatus.textContent = 'Соединение...';
    
    try {
      // Получение медиа потока
      const constraints = {
        audio: true,
        video: isVideo ? { width: 1280, height: 720 } : false
      };
      
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localVideo.srcObject = this.localStream;
      
      // Показать модальное окно
      this.callModal.classList.add('active');
      
      if (isVideo) {
        this.localVideo.style.display = 'block';
        this.callInfo.style.display = 'none';
      } else {
        this.localVideo.style.display = 'none';
        this.callInfo.style.display = 'flex';
      }
      
      // Симуляция подключения
      setTimeout(() => {
        this.callStatus.textContent = 'Звонок...';
      }, 500);
      
      setTimeout(() => {
        this.callStatus.textContent = 'Соединено';
        this.simulateRemoteStream(isVideo);
      }, 2000);
      
    } catch (error) {
      console.error('Ошибка доступа к медиа устройствам:', error);
      alert('Не удалось получить доступ к камере/микрофону. Проверьте разрешения.');
      this.endCall();
    }
  }
  
  async startScreenShare() {
    if (!currentChatId) {
      alert('Выберите чат для трансляции экрана');
      return;
    }
    
    try {
      // Получение потока экрана
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false
      });
      
      // Получение аудио потока
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Объединение потоков
      this.localStream = new MediaStream([
        ...this.screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);
      
      this.isVideoCall = true;
      this.isScreenSharing = true;
      this.callTitle.textContent = 'Трансляция экрана';
      
      const chat = chats.find(c => c.id === currentChatId);
      this.callerName.textContent = chat.name;
      this.callStatus.textContent = 'Трансляция экрана...';
      
      this.localVideo.srcObject = this.localStream;
      this.localVideo.style.display = 'block';
      this.callInfo.style.display = 'none';
      
      // Показать модальное окно
      this.callModal.classList.add('active');
      
      // Обработка остановки трансляции
      this.screenStream.getVideoTracks()[0].onended = () => {
        this.endCall();
      };
      
      setTimeout(() => {
        this.callStatus.textContent = 'Соединено';
        this.simulateRemoteStream(true);
      }, 1000);
      
    } catch (error) {
      console.error('Ошибка трансляции экрана:', error);
      if (error.name !== 'NotAllowedError') {
        alert('Не удалось начать трансляцию экрана');
      }
    }
  }
  
  simulateRemoteStream(isVideo) {
    // Симуляция удаленного потока (в реальном приложении это будет WebRTC)
    if (isVideo) {
      // Создаем canvas для симуляции удаленного видео
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      
      const drawFrame = () => {
        if (!this.remoteStream) return;
        
        // Градиентный фон
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#3498db');
        gradient.addColorStop(1, '#2ecc71');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Текст
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Удаленное видео', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText('(симуляция)', canvas.width / 2, canvas.height / 2 + 20);
        
        requestAnimationFrame(drawFrame);
      };
      
      this.remoteStream = canvas.captureStream(30);
      this.remoteVideo.srcObject = this.remoteStream;
      this.remoteVideo.style.display = 'block';
      drawFrame();
    } else {
      this.remoteVideo.style.display = 'none';
    }
  }
  
  toggleMic() {
    if (!this.localStream) return;
    
    this.isMicEnabled = !this.isMicEnabled;
    const audioTracks = this.localStream.getAudioTracks();
    audioTracks.forEach(track => track.enabled = this.isMicEnabled);
    
    const micIcon = document.getElementById('micIcon');
    micIcon.className = this.isMicEnabled ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    
    const btn = document.getElementById('toggleMicBtn');
    btn.classList.toggle('disabled', !this.isMicEnabled);
  }
  
  toggleCamera() {
    if (!this.localStream || !this.isVideoCall || this.isScreenSharing) return;
    
    this.isCameraEnabled = !this.isCameraEnabled;
    const videoTracks = this.localStream.getVideoTracks();
    videoTracks.forEach(track => track.enabled = this.isCameraEnabled);
    
    const cameraIcon = document.getElementById('cameraIcon');
    cameraIcon.className = this.isCameraEnabled ? 'fas fa-video' : 'fas fa-video-slash';
    
    const btn = document.getElementById('toggleCameraBtn');
    btn.classList.toggle('disabled', !this.isCameraEnabled);
  }
  
  async toggleScreenShare() {
    if (this.isScreenSharing) {
      // Остановить трансляцию экрана и вернуться к камере
      if (this.screenStream) {
        this.screenStream.getTracks().forEach(track => track.stop());
        this.screenStream = null;
      }
      
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        
        // Заменить видео трек
        const sender = this.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
        
        // Обновить локальный поток
        const oldVideoTrack = this.localStream.getVideoTracks()[0];
        this.localStream.removeTrack(oldVideoTrack);
        this.localStream.addTrack(videoTrack);
        this.localVideo.srcObject = this.localStream;
        
        this.isScreenSharing = false;
        this.callTitle.textContent = 'Видео звонок';
        
        const screenIcon = document.getElementById('screenIcon');
        screenIcon.className = 'fas fa-desktop';
      } catch (error) {
        console.error('Ошибка переключения на камеру:', error);
      }
    } else {
      // Начать трансляцию экрана
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' },
          audio: false
        });
        
        const screenTrack = this.screenStream.getVideoTracks()[0];
        
        // Заменить видео трек
        const sender = this.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
        
        // Обновить локальный поток
        const oldVideoTrack = this.localStream.getVideoTracks()[0];
        this.localStream.removeTrack(oldVideoTrack);
        this.localStream.addTrack(screenTrack);
        this.localVideo.srcObject = this.localStream;
        
        this.isScreenSharing = true;
        this.callTitle.textContent = 'Трансляция экрана';
        
        const screenIcon = document.getElementById('screenIcon');
        screenIcon.className = 'fas fa-desktop active-screen';
        
        // Обработка остановки трансляции
        screenTrack.onended = () => {
          this.toggleScreenShare();
        };
      } catch (error) {
        console.error('Ошибка трансляции экрана:', error);
      }
    }
  }
  
  toggleSpeaker() {
    this.isSpeakerEnabled = !this.isSpeakerEnabled;
    this.remoteVideo.muted = !this.isSpeakerEnabled;
    
    const speakerIcon = document.getElementById('speakerIcon');
    speakerIcon.className = this.isSpeakerEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    
    const btn = document.getElementById('toggleSpeakerBtn');
    btn.classList.toggle('disabled', !this.isSpeakerEnabled);
  }
  
  endCall() {
    // Остановить все медиа потоки
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
    
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }
    
    // Очистить видео элементы
    this.localVideo.srcObject = null;
    this.remoteVideo.srcObject = null;
    
    // Закрыть peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Скрыть модальное окно
    this.callModal.classList.remove('active');
    
    // Сбросить состояние
    this.isVideoCall = false;
    this.isScreenSharing = false;
    this.isMicEnabled = true;
    this.isCameraEnabled = true;
    this.isSpeakerEnabled = true;
    
    // Сбросить иконки
    document.getElementById('micIcon').className = 'fas fa-microphone';
    document.getElementById('cameraIcon').className = 'fas fa-video';
    document.getElementById('screenIcon').className = 'fas fa-desktop';
    document.getElementById('speakerIcon').className = 'fas fa-volume-up';
    
    // Убрать классы disabled
    document.querySelectorAll('.call-control-btn').forEach(btn => {
      btn.classList.remove('disabled');
    });
  }
}

// Инициализация менеджера звонков
let callManager;
document.addEventListener('DOMContentLoaded', () => {
  callManager = new CallManager();
});
