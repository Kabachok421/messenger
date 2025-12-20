// Управление расширенными возможностями сообщений
class MessageManager {
  constructor() {
    this.emojis = {
      smileys: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐'],
      animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🕷','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐓','🦃','🦚','🦜','🦢','🦩','🕊','🐇','🦝','🦨','🦡','🦦','🦥','🐁','🐀','🐿','🦔'],
      food: ['🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🫐','🥝','🍅','🫒','🥥','🥑','🍆','🥔','🥕','🌽','🌶','🫑','🥒','🥬','🥦','🧄','🧅','🍄','🥜','🌰','🍞','🥐','🥖','🫓','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🫔','🥙','🧆','🥚','🍳','🥘','🍲','🫕','🥣','🥗','🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🦀','🦞','🦐','🦑','🦪','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯'],
      activities: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸','🥌','🎿','⛷','🏂','🪂','🏋️','🤼','🤸','🤺','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖','🏵','🎗','🎫','🎟','🎪','🤹','🎭','🩰','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🪗','🎸','🪕','🎻','🎲','♟','🎯','🎳','🎮','🎰','🧩'],
      travel: ['🚗','🚕','🚙','🚌','🚎','🏎','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🦯','🦽','🦼','🛴','🚲','🛵','🏍','🛺','🚨','🚔','🚍','🚘','🚖','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩','💺','🛰','🚀','🛸','🚁','🛶','⛵','🚤','🛥','🛳','⛴','🚢','⚓','⛽','🚧','🚦','🚥','🚏','🗺','🗿','🗽','🗼','🏰','🏯','🏟','🎡','🎢','🎠','⛲','⛱','🏖','🏝','🏜','🌋','⛰','🏔','🗻','🏕','⛺','🏠','🏡','🏘','🏚','🏗','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏪','🏫','🏩','💒','🏛','⛪','🕌','🕍','🛕','🕋'],
      objects: ['⌚','📱','📲','💻','⌨️','🖥','🖨','🖱','🖲','🕹','🗜','💾','💿','📀','📼','📷','📸','📹','🎥','📽','🎞','📞','☎️','📟','📠','📺','📻','🎙','🎚','🎛','🧭','⏱','⏲','⏰','🕰','⌛','⏳','📡','🔋','🔌','💡','🔦','🕯','🪔','🧯','🛢','💸','💵','💴','💶','💷','🪙','💰','💳','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒','🛠','⛏','🪚','🔩','⚙️','🪤','🧱','⛓','🧲','🔫','💣','🧨','🪓','🔪','🗡','⚔️','🛡','🚬','⚰️','🪦','⚱️','🏺','🔮','📿','🧿','💈','⚗️','🔭','🔬','🕳','🩹','🩺','💊','💉','🩸','🧬','🦠','🧫','🧪','🌡','🧹','🪠','🧺','🧻','🚽','🚰','🚿','🛁','🛀','🧼','🪥','🪒','🧽','🪣','🧴','🛎','🔑','🗝','🚪','🪑','🛋','🛏','🛌','🧸','🪆','🖼','🪞','🪟','🛍','🛒','🎁','🎈','🎏','🎀','🪄','🪅','🎊','🎉','🎎','🏮','🎐','🧧','✉️','📩','📨','📧','💌','📥','📤','📦','🏷','🪧','📪','📫','📬','📭','📮','📯','📜','📃','📄','📑','📊','📈','📉','🗒','🗓','📆','📅','🗑','📇','🗃','🗳','🗄','📋','📁','📂','🗂','🗞','📰','📓','📔','📒','📕','📗','📘','📙','📚','📖','🔖','🧷','🔗','📎','🖇','📐','📏','🧮','📌','📍','✂️','🖊','🖋','✒️','🖌','🖍','📝','✏️','🔍','🔎','🔏','🔐','🔒','🔓'],
      symbols: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','⏏️','▶️','⏸','⏯','⏹','⏺','⏭','⏮','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','♾','💲','💱','™️','©️','®️','〰️','➰','➿','🔚','🔙','🔛','🔝','🔜','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','💬','💭','🗯','♠️','♣️','♥️','♦️','🃏','🎴','🀄','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛','🕜','🕝','🕞','🕟','🕠','🕡','🕢','🕣','🕤','🕥','🕦','🕧']
    };
    
    this.replyToMessage = null;
    this.editingMessage = null;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.customStickers = [];
    this.pinnedMessage = null;
    this.forwardingMessage = null;
    this.selectedChatsForForward = [];
    
    this.initElements();
    this.initEventListeners();
    this.loadCustomStickers();
    this.initPinnedMessage();
    this.initForwardModal();
  }
  
  initElements() {
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.voiceBtn = document.getElementById('voiceBtn');
    this.attachBtn = document.getElementById('attachBtn');
    this.emojiBtn = document.getElementById('emojiBtn');
    this.attachMenu = document.getElementById('attachMenu');
    this.emojiPicker = document.getElementById('emojiPicker');
    this.stickerPicker = document.getElementById('stickerPicker');
    this.messageContextMenu = document.getElementById('messageContextMenu');
    this.replyPreview = document.getElementById('replyPreview');
    
    const elementsStatus = {
      messageInput: !!this.messageInput,
      sendBtn: !!this.sendBtn,
      voiceBtn: !!this.voiceBtn,
      attachBtn: !!this.attachBtn,
      emojiBtn: !!this.emojiBtn,
      attachMenu: !!this.attachMenu,
      emojiPicker: !!this.emojiPicker,
      stickerPicker: !!this.stickerPicker,
      messageContextMenu: !!this.messageContextMenu,
      replyPreview: !!this.replyPreview
    };
    
    console.log('Elements initialized:', elementsStatus);
    
    // Проверить, что все критичные элементы найдены
    const missingElements = Object.entries(elementsStatus)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingElements.length > 0) {
      console.error('Missing elements:', missingElements);
    }
  }
  
  initEventListeners() {
    // Ввод текста
    if (this.messageInput) {
      this.messageInput.addEventListener('input', () => this.handleInput());
      this.messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
    
    // Кнопки
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', () => this.sendMessage());
    }
    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecording());
    }
    if (this.attachBtn) {
      this.attachBtn.addEventListener('click', () => this.toggleAttachMenu());
    }
    if (this.emojiBtn) {
      this.emojiBtn.addEventListener('click', () => this.toggleEmojiPicker());
    }
    
    // Меню вложений
    document.querySelectorAll('.attach-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        this.handleAttachment(type);
      });
    });
    
    // Файловые инпуты
    document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e, 'file'));
    document.getElementById('imageInput').addEventListener('change', (e) => this.handleFileSelect(e, 'image'));
    document.getElementById('videoInput').addEventListener('change', (e) => this.handleFileSelect(e, 'video'));
    document.getElementById('audioInput').addEventListener('change', (e) => this.handleFileSelect(e, 'audio'));
    document.getElementById('stickerInput').addEventListener('change', (e) => this.handleStickerUpload(e));
    
    // Эмодзи
    this.renderEmojis('smileys');
    document.querySelectorAll('.emoji-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderEmojis(e.currentTarget.dataset.category);
      });
    });
    
    // Стикеры
    this.renderStickers('pack1');
    document.querySelectorAll('.sticker-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.sticker-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.renderStickers(e.currentTarget.dataset.pack);
      });
    });
    
    // addStickerBtn создается динамически, обработчик добавляется в renderStickers
    
    // Контекстное меню - закрытие по клику вне меню
    document.addEventListener('click', (e) => {
      if (this.messageContextMenu && !e.target.closest('.message-context-menu')) {
        this.messageContextMenu.style.display = 'none';
      }
      if (!e.target.closest('.attach-menu-content') && !e.target.closest('#attachBtn')) {
        this.attachMenu.classList.remove('active');
      }
      if (!e.target.closest('.emoji-picker') && !e.target.closest('#emojiBtn')) {
        this.emojiPicker.classList.remove('active');
      }
    });
    
    // Закрытие контекстного меню по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.messageContextMenu) {
        this.messageContextMenu.style.display = 'none';
      }
    });
    
    // Отмена ответа
    const cancelReplyBtn = document.getElementById('cancelReplyBtn');
    if (cancelReplyBtn) {
      cancelReplyBtn.addEventListener('click', () => this.cancelReply());
    }
    
    // Контекстное меню сообщений
    document.querySelectorAll('.context-menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleContextAction(action);
      });
    });
  }
  
  handleInput() {
    const text = this.messageInput.textContent.trim();
    if (text.length > 0) {
      this.sendBtn.style.display = 'flex';
      this.voiceBtn.style.display = 'none';
    } else {
      this.sendBtn.style.display = 'none';
      this.voiceBtn.style.display = 'flex';
    }
  }
  
  sendMessage() {
    // Проверить, отправляем в чат или канал
    if (currentChannelId) {
      const text = this.messageInput.textContent.trim();
      if (!text) return;
      
      sendChannelMessage(text);
      this.messageInput.textContent = '';
      this.handleInput();
      return;
    }
    
    if (!currentChatId) return;
    
    const text = this.messageInput.textContent.trim();
    if (!text) return;
    
    if (this.editingMessage) {
      this.saveEditedMessage(text);
      return;
    }
    
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const message = {
      text: text,
      sent: true,
      time: time,
      type: 'text',
      edited: false,
      replyTo: this.replyToMessage
    };
    
    messages[currentChatId].push(message);
    
    const chat = chats.find(c => c.id === currentChatId);
    chat.lastMessage = text;
    chat.time = time;
    
    this.messageInput.textContent = '';
    this.cancelReply();
    this.handleInput();
    renderMessages();
    renderChatList();
    
    // Воспроизвести звук отправки (если включено)
    if (window.appSettings && window.appSettings.settings.notifications.sound) {
      this.playDeleteSound(); // Используем существующий звук
    }
  }
  
  async toggleVoiceRecording() {
    if (!currentChatId) return;
    
    if (!this.isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        this.recordedChunks = [];
        
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            this.recordedChunks.push(e.data);
          }
        };
        
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
          this.sendVoiceMessage(blob);
          stream.getTracks().forEach(track => track.stop());
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        this.voiceBtn.classList.add('recording');
        this.voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
      } catch (error) {
        console.error('Ошибка записи аудио:', error);
        alert('Не удалось получить доступ к микрофону');
      }
    } else {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.voiceBtn.classList.remove('recording');
      this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
  }
  
  sendVoiceMessage(blob) {
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const url = URL.createObjectURL(blob);
    
    const message = {
      text: 'Голосовое сообщение',
      sent: true,
      time: time,
      type: 'voice',
      url: url,
      duration: '0:05'
    };
    
    messages[currentChatId].push(message);
    
    const chat = chats.find(c => c.id === currentChatId);
    chat.lastMessage = '🎤 Голосовое сообщение';
    chat.time = time;
    
    renderMessages();
    renderChatList();
    
    // Показать уведомление (если включено)
    if (window.appSettings) {
      window.appSettings.showNotification(
        'Голосовое сообщение отправлено',
        `Отправлено в чат "${chat.name}"`,
        null
      );
    }
  }
  
  toggleAttachMenu() {
    this.attachMenu.classList.toggle('active');
    this.emojiPicker.classList.remove('active');
    this.stickerPicker.classList.remove('active');
    
    // Закрытие по клику на overlay
    if (this.attachMenu.classList.contains('active')) {
      const overlay = this.attachMenu.querySelector('.attach-menu-overlay');
      overlay.onclick = () => {
        this.attachMenu.classList.remove('active');
      };
    }
  }
  
  toggleEmojiPicker() {
    this.emojiPicker.classList.toggle('active');
    this.attachMenu.classList.remove('active');
    
    // Переключение между эмодзи и стикерами
    if (this.emojiPicker.classList.contains('active')) {
      this.stickerPicker.classList.remove('active');
    }
  }
  
  handleAttachment(type) {
    this.attachMenu.classList.remove('active');
    
    console.log('handleAttachment called with type:', type);
    
    switch(type) {
      case 'file':
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.click();
        } else {
          console.error('fileInput not found');
        }
        break;
      case 'image':
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
          imageInput.click();
        } else {
          console.error('imageInput not found');
        }
        break;
      case 'video':
        const videoInput = document.getElementById('videoInput');
        if (videoInput) {
          videoInput.click();
        } else {
          console.error('videoInput not found');
        }
        break;
      case 'audio':
        const audioInput = document.getElementById('audioInput');
        if (audioInput) {
          audioInput.click();
        } else {
          console.error('audioInput not found');
        }
        break;
      case 'location':
        this.sendLocation();
        break;
      case 'contact':
        alert('Функция отправки контакта будет доступна позже');
        break;
    }
  }
  
  sendLocation() {
    if (!currentChatId) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const message = {
          text: `📍 Геолокация: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          sent: true,
          time: time,
          type: 'location',
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        messages[currentChatId].push(message);
        
        const chat = chats.find(c => c.id === currentChatId);
        chat.lastMessage = '📍 Геолокация';
        chat.time = time;
        
        renderMessages();
        renderChatList();
      }, (error) => {
        alert('Не удалось получить геолокацию: ' + error.message);
      });
    } else {
      alert('Геолокация не поддерживается вашим браузером');
    }
  }
  
  handleFileSelect(e, type) {
    console.log('handleFileSelect called with type:', type);
    const files = Array.from(e.target.files);
    console.log('Selected files:', files.length);
    
    if (files.length === 0) return;
    
    files.forEach(file => {
      console.log('Sending file:', file.name);
      this.sendFileMessage(file, type);
    });
    
    e.target.value = '';
  }
  
  sendFileMessage(file, type) {
    if (!currentChatId) {
      alert('Выберите чат для отправки файла');
      return;
    }
    
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const url = URL.createObjectURL(file);
    
    const message = {
      text: file.name,
      sent: true,
      time: time,
      type: type,
      url: url,
      size: this.formatFileSize(file.size),
      fileName: file.name
    };
    
    messages[currentChatId].push(message);
    
    const chat = chats.find(c => c.id === currentChatId);
    const icons = { file: '📄', image: '🖼️', video: '🎬', audio: '🎵' };
    chat.lastMessage = `${icons[type]} ${file.name}`;
    chat.time = time;
    
    renderMessages();
    renderChatList();
  }
  
  formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  renderEmojis(category) {
    const grid = document.getElementById('emojiGrid');
    const emojiList = this.emojis[category] || [];
    
    grid.innerHTML = emojiList.map(emoji => 
      `<button class="emoji-item" data-emoji="${emoji}">${emoji}</button>`
    ).join('');
    
    grid.querySelectorAll('.emoji-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const emoji = e.currentTarget.dataset.emoji;
        this.insertEmoji(emoji);
      });
    });
  }
  
  insertEmoji(emoji) {
    this.messageInput.textContent += emoji;
    this.messageInput.focus();
    this.handleInput();
    
    // Переместить курсор в конец
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(this.messageInput);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  renderStickers(pack) {
    const grid = document.getElementById('stickerGrid');
    
    if (pack === 'custom') {
      if (this.customStickers.length === 0) {
        grid.innerHTML = `
          <div class="sticker-placeholder">
            <i class="fas fa-plus-circle"></i>
            <p>Добавьте свои стикеры</p>
            <button class="add-sticker-btn" id="addStickerBtn">Добавить стикеры</button>
          </div>
        `;
        document.getElementById('addStickerBtn').addEventListener('click', () => {
          document.getElementById('stickerInput').click();
        });
      } else {
        grid.innerHTML = this.customStickers.map((sticker, index) => 
          `<button class="sticker-item" data-index="${index}">
            <img src="${sticker}" alt="Sticker">
          </button>`
        ).join('');
        
        grid.querySelectorAll('.sticker-item').forEach(item => {
          item.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            this.sendSticker(this.customStickers[index]);
          });
        });
      }
    } else {
      grid.innerHTML = '<div class="sticker-placeholder"><p>Стикеры будут доступны после добавления</p></div>';
    }
  }
  
  handleStickerUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.customStickers.push(event.target.result);
        this.saveCustomStickers();
        this.renderStickers('custom');
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }
  
  sendSticker(stickerUrl) {
    if (!currentChatId) return;
    
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const message = {
      text: '',
      sent: true,
      time: time,
      type: 'sticker',
      url: stickerUrl
    };
    
    messages[currentChatId].push(message);
    
    const chat = chats.find(c => c.id === currentChatId);
    chat.lastMessage = '🎭 Стикер';
    chat.time = time;
    
    this.emojiPicker.classList.remove('active');
    this.stickerPicker.classList.remove('active');
    renderMessages();
    renderChatList();
  }
  
  saveCustomStickers() {
    localStorage.setItem('customStickers', JSON.stringify(this.customStickers));
  }
  
  loadCustomStickers() {
    const saved = localStorage.getItem('customStickers');
    if (saved) {
      this.customStickers = JSON.parse(saved);
    }
  }
  
  showContextMenu(e, messageIndex) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Show context menu for message index:', messageIndex);
    
    if (!this.messageContextMenu) {
      console.error('Context menu element not found');
      // Попробовать найти снова
      this.messageContextMenu = document.getElementById('messageContextMenu');
      if (!this.messageContextMenu) {
        console.error('Still cannot find context menu element');
        return;
      }
    }
    
    // Получить сообщение для проверки прав
    const message = messages[currentChatId]?.[messageIndex];
    if (!message) {
      console.error('Message not found');
      return;
    }
    
    // Скрыть другие меню
    this.attachMenu.classList.remove('active');
    this.emojiPicker.classList.remove('active');
    
    // Показать/скрыть пункты меню в зависимости от прав
    const isOwnMessage = message.sent === true;
    const editBtn = this.messageContextMenu.querySelector('[data-action="edit"]');
    const deleteBtn = this.messageContextMenu.querySelector('[data-action="delete"]');
    
    if (editBtn) {
      editBtn.style.display = isOwnMessage ? 'flex' : 'none';
    }
    if (deleteBtn) {
      deleteBtn.style.display = isOwnMessage ? 'flex' : 'none';
    }
    
    // Показать меню для получения его размеров
    this.messageContextMenu.style.display = 'block';
    this.messageContextMenu.style.visibility = 'hidden';
    this.messageContextMenu.dataset.messageIndex = messageIndex;
    
    // Получить размеры меню и окна
    const menuWidth = this.messageContextMenu.offsetWidth;
    const menuHeight = this.messageContextMenu.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Вычислить позицию с учетом краев экрана
    let left = e.pageX;
    let top = e.pageY;
    
    // Проверка по горизонтали
    if (left + menuWidth > windowWidth) {
      // Меню не помещается справа - показать слева от курсора
      left = e.pageX - menuWidth;
    }
    
    // Проверка по вертикали
    if (top + menuHeight > windowHeight) {
      // Меню не помещается снизу - показать сверху
      top = e.pageY - menuHeight;
    }
    
    // Убедиться, что меню не выходит за левый край
    if (left < 0) {
      left = 10;
    }
    
    // Убедиться, что меню не выходит за верхний край
    if (top < 0) {
      top = 10;
    }
    
    // Применить позицию
    this.messageContextMenu.style.left = left + 'px';
    this.messageContextMenu.style.top = top + 'px';
    this.messageContextMenu.style.visibility = 'visible';
    
    console.log('Context menu shown at', left, top, '(original:', e.pageX, e.pageY, ')');
  }
  
  handleContextAction(action) {
    const messageIndex = parseInt(this.messageContextMenu.dataset.messageIndex);
    
    if (!currentChatId || !messages[currentChatId]) {
      console.error('No current chat or messages');
      return;
    }
    
    const message = messages[currentChatId][messageIndex];
    
    if (!message) {
      console.error('Message not found at index:', messageIndex);
      return;
    }
    
    console.log('Context action:', action, 'Message:', message);
    
    // Проверка, что это сообщение пользователя (только для редактирования и удаления)
    const isOwnMessage = message.sent === true;
    
    switch(action) {
      case 'reply':
        this.replyTo(message, messageIndex);
        break;
      case 'edit':
        if (!isOwnMessage) {
          alert('Вы можете редактировать только свои сообщения');
          break;
        }
        if (message.type === 'text' || !message.type) {
          console.log('Starting edit for message:', message);
          this.editMessage(message, messageIndex);
        } else {
          alert('Можно редактировать только текстовые сообщения');
        }
        break;
      case 'copy':
        if (message.text) {
          navigator.clipboard.writeText(message.text);
        }
        break;
      case 'forward':
        this.openForwardModal(message, messageIndex);
        break;
      case 'pin':
        this.pinMessage(message, messageIndex);
        break;
      case 'delete':
        if (!isOwnMessage) {
          alert('Вы можете удалять только свои сообщения');
          break;
        }
        this.deleteMessage(messageIndex);
        break;
    }
    
    this.messageContextMenu.style.display = 'none';
  }
  
  replyTo(message, index) {
    this.replyToMessage = { text: message.text, index: index };
    this.replyPreview.style.display = 'flex';
    document.getElementById('replyText').textContent = message.text;
    this.messageInput.focus();
  }
  
  cancelReply() {
    this.replyToMessage = null;
    this.editingMessage = null;
    this.replyPreview.style.display = 'none';
    
    // Восстановить обработчик кнопки отмены
    const cancelBtn = document.getElementById('cancelReplyBtn');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.cancelReply();
    }
  }
  
  editMessage(message, index) {
    console.log('Edit message called:', message, index);
    
    if (!message || !message.text) {
      console.error('Invalid message for editing');
      return;
    }
    
    this.editingMessage = { message: message, index: index };
    this.messageInput.textContent = message.text;
    
    console.log('Editing message set:', this.editingMessage);
    
    // Показать индикатор редактирования
    this.replyPreview.style.display = 'flex';
    const replyText = document.getElementById('replyText');
    if (replyText) {
      replyText.textContent = '✏️ Редактирование: ' + message.text;
    }
    
    // Изменить кнопку отмены
    const cancelBtn = document.getElementById('cancelReplyBtn');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.cancelEdit();
    }
    
    this.handleInput();
    this.messageInput.focus();
    
    // Переместить курсор в конец
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(this.messageInput);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  }
  
  saveEditedMessage(newText) {
    console.log('Save edited message:', newText, this.editingMessage);
    
    if (!this.editingMessage) {
      console.error('No message being edited');
      return;
    }
    
    const { message, index } = this.editingMessage;
    
    if (!message) {
      console.error('Invalid message object');
      return;
    }
    
    console.log('Updating message text from', message.text, 'to', newText);
    
    message.text = newText;
    message.edited = true;
    
    // Обновить последнее сообщение в чате если это оно
    const chat = chats.find(c => c.id === currentChatId);
    const lastMessageIndex = messages[currentChatId].length - 1;
    if (index === lastMessageIndex) {
      chat.lastMessage = newText;
    }
    
    this.editingMessage = null;
    this.messageInput.textContent = '';
    this.replyPreview.style.display = 'none';
    this.handleInput();
    
    // Восстановить обработчик кнопки отмены
    const cancelBtn = document.getElementById('cancelReplyBtn');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.cancelReply();
    }
    
    console.log('Rendering messages after edit');
    renderMessages();
    renderChatList();
  }
  
  cancelEdit() {
    this.editingMessage = null;
    this.messageInput.textContent = '';
    this.replyPreview.style.display = 'none';
    this.handleInput();
    
    // Восстановить обработчик кнопки отмены
    const cancelBtn = document.getElementById('cancelReplyBtn');
    if (cancelBtn) {
      cancelBtn.onclick = () => this.cancelReply();
    }
  }
  
  deleteMessage(index) {
    // Найти элемент сообщения для анимации
    const messageElements = document.querySelectorAll('.message');
    const messageToDelete = messageElements[index];
    
    if (messageToDelete) {
      // Создать эффект частиц (как в Telegram)
      this.createDeleteParticles(messageToDelete);
      
      // Добавить класс для анимации
      messageToDelete.classList.add('deleting');
      
      // Добавить звуковой эффект (опционально)
      this.playDeleteSound();
      
      // Удалить после анимации (250ms как в Telegram)
      setTimeout(() => {
        messages[currentChatId].splice(index, 1);
        
        // Обновить последнее сообщение в списке чатов
        const chat = chats.find(c => c.id === currentChatId);
        const lastMsg = messages[currentChatId][messages[currentChatId].length - 1];
        if (lastMsg) {
          chat.lastMessage = lastMsg.text || 'Медиа';
          chat.time = lastMsg.time;
        } else {
          chat.lastMessage = 'Нет сообщений';
        }
        
        renderMessages();
        renderChatList();
      }, 250);
    } else {
      // Если элемент не найден, удалить сразу
      messages[currentChatId].splice(index, 1);
      
      const chat = chats.find(c => c.id === currentChatId);
      const lastMsg = messages[currentChatId][messages[currentChatId].length - 1];
      if (lastMsg) {
        chat.lastMessage = lastMsg.text || 'Медиа';
        chat.time = lastMsg.time;
      } else {
        chat.lastMessage = 'Нет сообщений';
      }
      
      renderMessages();
      renderChatList();
    }
  }
  
  createDeleteParticles(messageElement) {
    const rect = messageElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Создать 8 частиц
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'delete-particle';
      
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      particle.style.left = centerX + 'px';
      particle.style.top = centerY + 'px';
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      
      document.body.appendChild(particle);
      
      // Удалить частицу после анимации
      setTimeout(() => {
        particle.remove();
      }, 300);
    }
  }
  
  playDeleteSound() {
    // Создать короткий звуковой эффект удаления
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Игнорировать ошибки звука
      console.log('Sound not available');
    }
  }
  
  // Инициализация закреплённого сообщения
  initPinnedMessage() {
    this.pinnedMessageBar = document.getElementById('pinnedMessageBar');
    this.unpinBtn = document.getElementById('unpinBtn');
    
    if (this.pinnedMessageBar) {
      this.pinnedMessageBar.addEventListener('click', (e) => {
        if (!e.target.closest('.unpin-btn')) {
          this.scrollToPinnedMessage();
        }
      });
    }
    
    if (this.unpinBtn) {
      this.unpinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unpinMessage();
      });
    }
    
    // Загрузить закреплённое сообщение из localStorage
    this.loadPinnedMessage();
  }
  
  // Закрепить сообщение
  pinMessage(message, index) {
    if (!currentChatId) return;
    
    this.pinnedMessage = {
      chatId: currentChatId,
      message: message,
      index: index
    };
    
    // Сохранить в localStorage
    const pinnedMessages = JSON.parse(localStorage.getItem('pinnedMessages') || '{}');
    pinnedMessages[currentChatId] = this.pinnedMessage;
    localStorage.setItem('pinnedMessages', JSON.stringify(pinnedMessages));
    
    // Показать панель
    this.showPinnedMessageBar();
    
    // Перерисовать сообщения чтобы добавить класс pinned
    renderMessages();
  }
  
  // Открепить сообщение
  unpinMessage() {
    if (!currentChatId) return;
    
    this.pinnedMessage = null;
    
    // Удалить из localStorage
    const pinnedMessages = JSON.parse(localStorage.getItem('pinnedMessages') || '{}');
    delete pinnedMessages[currentChatId];
    localStorage.setItem('pinnedMessages', JSON.stringify(pinnedMessages));
    
    // Скрыть панель
    this.pinnedMessageBar.classList.remove('active');
    
    // Перерисовать сообщения
    renderMessages();
  }
  
  // Показать панель закреплённого сообщения
  showPinnedMessageBar() {
    if (!this.pinnedMessage) return;
    
    const { message } = this.pinnedMessage;
    
    document.getElementById('pinnedAuthor').textContent = message.sent ? 'Вы' : 'Собеседник';
    document.getElementById('pinnedText').textContent = message.text || 'Медиа';
    
    this.pinnedMessageBar.classList.add('active');
  }
  
  // Прокрутить к закреплённому сообщению
  scrollToPinnedMessage() {
    if (!this.pinnedMessage) return;
    
    const messageElements = document.querySelectorAll('.message');
    const targetElement = messageElements[this.pinnedMessage.index];
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Подсветить сообщение
      targetElement.style.animation = 'none';
      setTimeout(() => {
        targetElement.style.animation = 'highlightMessage 1s ease';
      }, 10);
    }
  }
  
  // Загрузить закреплённое сообщение
  loadPinnedMessage() {
    if (!currentChatId) return;
    
    const pinnedMessages = JSON.parse(localStorage.getItem('pinnedMessages') || '{}');
    this.pinnedMessage = pinnedMessages[currentChatId] || null;
    
    if (this.pinnedMessage && this.pinnedMessage.chatId === currentChatId) {
      this.showPinnedMessageBar();
    } else {
      this.pinnedMessageBar.classList.remove('active');
    }
  }
  
  // Инициализация модального окна пересылки
  initForwardModal() {
    this.forwardModal = document.getElementById('forwardModal');
    this.forwardList = document.getElementById('forwardList');
    this.forwardSearch = document.getElementById('forwardSearch');
    this.closeForwardBtn = document.getElementById('closeForwardBtn');
    this.cancelForwardBtn = document.getElementById('cancelForwardBtn');
    this.confirmForwardBtn = document.getElementById('confirmForwardBtn');
    
    if (this.closeForwardBtn) {
      this.closeForwardBtn.addEventListener('click', () => this.closeForwardModal());
    }
    
    if (this.cancelForwardBtn) {
      this.cancelForwardBtn.addEventListener('click', () => this.closeForwardModal());
    }
    
    if (this.confirmForwardBtn) {
      this.confirmForwardBtn.addEventListener('click', () => this.confirmForward());
    }
    
    if (this.forwardSearch) {
      this.forwardSearch.addEventListener('input', (e) => this.filterForwardChats(e.target.value));
    }
    
    // Закрытие по клику на overlay
    if (this.forwardModal) {
      this.forwardModal.querySelector('.forward-overlay').addEventListener('click', () => {
        this.closeForwardModal();
      });
    }
  }
  
  // Открыть модальное окно пересылки
  openForwardModal(message, index) {
    this.forwardingMessage = { message, index };
    this.selectedChatsForForward = [];
    
    // Отрисовать список чатов
    this.renderForwardChats();
    
    // Показать модальное окно
    this.forwardModal.classList.add('active');
    
    // Обновить кнопку
    this.updateForwardButton();
  }
  
  // Закрыть модальное окно пересылки
  closeForwardModal() {
    this.forwardModal.classList.remove('active');
    this.forwardingMessage = null;
    this.selectedChatsForForward = [];
  }
  
  // Отрисовать список чатов для пересылки
  renderForwardChats() {
    if (!this.forwardList) return;
    
    this.forwardList.innerHTML = chats.map(chat => `
      <div class="forward-chat-item" data-chat-id="${chat.id}">
        <div class="forward-chat-checkbox">
          <i class="fas fa-check" style="display: none;"></i>
        </div>
        <div class="forward-chat-avatar">${chat.avatar}</div>
        <div class="forward-chat-name">${chat.name}</div>
      </div>
    `).join('');
    
    // Добавить обработчики
    this.forwardList.querySelectorAll('.forward-chat-item').forEach(item => {
      item.addEventListener('click', () => {
        const chatId = parseInt(item.dataset.chatId);
        this.toggleChatSelection(chatId, item);
      });
    });
  }
  
  // Переключить выбор чата
  toggleChatSelection(chatId, element) {
    const index = this.selectedChatsForForward.indexOf(chatId);
    
    if (index > -1) {
      this.selectedChatsForForward.splice(index, 1);
      element.classList.remove('selected');
      element.querySelector('.forward-chat-checkbox i').style.display = 'none';
    } else {
      this.selectedChatsForForward.push(chatId);
      element.classList.add('selected');
      element.querySelector('.forward-chat-checkbox i').style.display = 'block';
    }
    
    this.updateForwardButton();
  }
  
  // Обновить кнопку пересылки
  updateForwardButton() {
    if (this.confirmForwardBtn) {
      this.confirmForwardBtn.disabled = this.selectedChatsForForward.length === 0;
      this.confirmForwardBtn.textContent = this.selectedChatsForForward.length > 0 
        ? `Переслать (${this.selectedChatsForForward.length})` 
        : 'Переслать';
    }
  }
  
  // Подтвердить пересылку
  confirmForward() {
    if (!this.forwardingMessage || this.selectedChatsForForward.length === 0) return;
    
    const { message } = this.forwardingMessage;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Переслать в выбранные чаты
    this.selectedChatsForForward.forEach(chatId => {
      const forwardedMessage = {
        ...message,
        sent: true,
        time: time,
        forwarded: true,
        originalSender: message.sent ? 'Вы' : chats.find(c => c.id === currentChatId)?.name || 'Неизвестно'
      };
      
      if (!messages[chatId]) {
        messages[chatId] = [];
      }
      
      messages[chatId].push(forwardedMessage);
      
      // Обновить последнее сообщение в чате
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = '↪️ Пересланное сообщение';
        chat.time = time;
      }
    });
    
    // Закрыть модальное окно
    this.closeForwardModal();
    
    // Обновить интерфейс
    renderChatList();
    
    // Показать уведомление
    if (window.appSettings) {
      window.appSettings.showNotification(
        'Сообщение переслано',
        `Переслано в ${this.selectedChatsForForward.length} ${this.selectedChatsForForward.length === 1 ? 'чат' : 'чата'}`,
        null
      );
    }
  }
  
  // Фильтр чатов для пересылки
  filterForwardChats(query) {
    const items = this.forwardList.querySelectorAll('.forward-chat-item');
    const lowerQuery = query.toLowerCase();
    
    items.forEach(item => {
      const name = item.querySelector('.forward-chat-name').textContent.toLowerCase();
      item.style.display = name.includes(lowerQuery) ? 'flex' : 'none';
    });
  }
}

// Инициализация
window.messageManager = null;

// Создать messageManager сразу после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMessageManager);
} else {
  initMessageManager();
}

function initMessageManager() {
  console.log('Initializing MessageManager');
  try {
    window.messageManager = new MessageManager();
    console.log('MessageManager initialized successfully:', !!window.messageManager);
  } catch (error) {
    console.error('Error initializing MessageManager:', error);
    console.error('Error stack:', error.stack);
  }
}
