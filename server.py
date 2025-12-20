#!/usr/bin/env python3
"""
Локальный сервер мессенджера
Все данные хранятся в SQLite базе данных
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os
import hashlib
import secrets

# Определяем базовую директорию
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, 
            static_folder=os.path.join(BASE_DIR, 'static'), 
            template_folder=os.path.join(BASE_DIR, 'templates'))
app.config['SECRET_KEY'] = secrets.token_hex(32)
CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Путь к базе данных
DB_PATH = os.path.join(BASE_DIR, 'messenger.db')

# ============= База данных =============

def init_db():
    """Инициализация базы данных"""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    # Таблица пользователей
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        avatar TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP
    )''')
    
    # Таблица сообщений
    c.execute('''CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id TEXT NOT NULL,
        sender_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        text TEXT,
        type TEXT DEFAULT 'text',
        file_url TEXT,
        file_name TEXT,
        file_size INTEGER,
        reply_to INTEGER,
        forwarded BOOLEAN DEFAULT 0,
        edited BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (recipient_id) REFERENCES users(id)
    )''')
    
    # Таблица каналов
    c.execute('''CREATE TABLE IF NOT EXISTS channels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        creator_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id)
    )''')
    
    # Таблица администраторов каналов
    c.execute('''CREATE TABLE IF NOT EXISTS channel_admins (
        channel_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (channel_id) REFERENCES channels(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        PRIMARY KEY (channel_id, user_id)
    )''')
    
    # Таблица подписчиков каналов
    c.execute('''CREATE TABLE IF NOT EXISTS channel_subscribers (
        channel_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (channel_id) REFERENCES channels(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        PRIMARY KEY (channel_id, user_id)
    )''')
    
    # Таблица закреплённых сообщений
    c.execute('''CREATE TABLE IF NOT EXISTS pinned_messages (
        chat_id TEXT NOT NULL,
        message_id INTEGER NOT NULL,
        pinned_by INTEGER NOT NULL,
        pinned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (message_id) REFERENCES messages(id),
        FOREIGN KEY (pinned_by) REFERENCES users(id),
        PRIMARY KEY (chat_id)
    )''')
    
    conn.commit()
    conn.close()
    print('✅ База данных инициализирована')

def get_db():
    """Получить подключение к БД"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    """Хешировать пароль"""
    return hashlib.sha256(password.encode()).hexdigest()

# ============= Веб-интерфейс управления =============

@app.route('/')
def admin_panel():
    """Панель управления сервером"""
    return render_template('admin.html')

@app.route('/app')
@app.route('/messenger')
def messenger_app():
    """Мессенджер - раздаём клиентские файлы"""
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/app/<path:filename>')
def serve_app_files(filename):
    """Раздача файлов клиента"""
    # Безопасная раздача только разрешённых файлов
    allowed_extensions = ['.html', '.js', '.css', '.png', '.jpg', '.svg', '.ico']
    if any(filename.endswith(ext) for ext in allowed_extensions):
        return send_from_directory(BASE_DIR, filename)
    return 'Not found', 404

@app.route('/admin/stats')
def get_stats():
    """Статистика сервера"""
    conn = get_db()
    
    users_count = conn.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    messages_count = conn.execute('SELECT COUNT(*) FROM messages').fetchone()[0]
    channels_count = conn.execute('SELECT COUNT(*) FROM channels').fetchone()[0]
    
    # Последние пользователи
    recent_users = conn.execute('''
        SELECT id, username, full_name, created_at 
        FROM users 
        ORDER BY created_at DESC 
        LIMIT 5
    ''').fetchall()
    
    # Последние сообщения
    recent_messages = conn.execute('''
        SELECT m.id, m.text, m.created_at, u.username as sender
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        ORDER BY m.created_at DESC
        LIMIT 10
    ''').fetchall()
    
    conn.close()
    
    return jsonify({
        'users_count': users_count,
        'messages_count': messages_count,
        'channels_count': channels_count,
        'recent_users': [dict(u) for u in recent_users],
        'recent_messages': [dict(m) for m in recent_messages]
    })

@app.route('/admin/users')
def get_all_users():
    """Получить всех пользователей"""
    conn = get_db()
    users = conn.execute('SELECT id, username, full_name, created_at, last_seen FROM users').fetchall()
    conn.close()
    
    return jsonify({
        'users': [dict(u) for u in users]
    })

@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Удалить пользователя"""
    conn = get_db()
    conn.execute('DELETE FROM users WHERE id = ?', (user_id,))
    conn.execute('DELETE FROM messages WHERE sender_id = ? OR recipient_id = ?', (user_id, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/admin/messages')
def get_all_messages():
    """Получить все сообщения"""
    conn = get_db()
    messages = conn.execute('''
        SELECT m.*, 
               u1.username as sender_name,
               u2.username as recipient_name
        FROM messages m
        JOIN users u1 ON m.sender_id = u1.id
        JOIN users u2 ON m.recipient_id = u2.id
        ORDER BY m.created_at DESC
        LIMIT 100
    ''').fetchall()
    conn.close()
    
    return jsonify({
        'messages': [dict(m) for m in messages]
    })

@app.route('/admin/clear-messages', methods=['POST'])
def clear_messages():
    """Очистить все сообщения"""
    conn = get_db()
    conn.execute('DELETE FROM messages')
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/admin/backup', methods=['POST'])
def create_backup():
    """Создать резервную копию БД"""
    import shutil
    backup_name = f'messenger_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.db'
    shutil.copy2(DB_PATH, backup_name)
    
    return jsonify({
        'success': True,
        'backup_file': backup_name
    })

@app.route('/admin/server/status')
def server_status():
    """Статус сервера"""
    return jsonify({
        'running': True,
        'uptime': 'Running',
        'port': 5000
    })

@app.route('/admin/server/restart', methods=['POST'])
def restart_server():
    """Перезапустить сервер"""
    import subprocess
    import sys
    
    def restart():
        import time
        time.sleep(2)
        
        # Получить путь к текущему скрипту
        script_path = os.path.abspath(__file__)
        
        # Запустить новый процесс
        if sys.platform == 'win32':
            # Windows
            subprocess.Popen([sys.executable, script_path], 
                           creationflags=subprocess.CREATE_NEW_CONSOLE)
        else:
            # Linux/Mac
            subprocess.Popen([sys.executable, script_path])
        
        # Остановить текущий сервер
        os._exit(0)
    
    import threading
    threading.Thread(target=restart, daemon=True).start()
    
    return jsonify({
        'success': True,
        'message': 'Сервер перезапускается...'
    })

@app.route('/admin/server/shutdown', methods=['POST'])
def shutdown_server():
    """Остановить сервер"""
    def shutdown():
        import time
        time.sleep(1)
        os._exit(0)
    
    import threading
    threading.Thread(target=shutdown, daemon=True).start()
    
    return jsonify({
        'success': True,
        'message': 'Сервер останавливается...'
    })

# ============= Система обновлений =============

# Текущая версия и информация об обновлении
update_info = {
    'version': '1.0.0',
    'available': False,
    'new_version': None,
    'changelog': [],
    'download_url': None,
    'mandatory': False
}

@app.route('/api/update/check')
def check_update():
    """Проверить наличие обновлений"""
    return jsonify(update_info)

@app.route('/admin/update/push', methods=['POST'])
def push_update():
    """Отправить обновление всем клиентам"""
    data = request.json
    
    update_info['available'] = True
    update_info['new_version'] = data.get('version', '1.0.1')
    update_info['changelog'] = data.get('changelog', [])
    update_info['download_url'] = data.get('download_url', '')
    update_info['mandatory'] = data.get('mandatory', False)
    
    # Отправить уведомление всем подключенным клиентам
    socketio.emit('update_available', update_info, broadcast=True)
    
    return jsonify({
        'success': True,
        'message': 'Обновление отправлено всем клиентам'
    })

@app.route('/admin/update/cancel', methods=['POST'])
def cancel_update():
    """Отменить обновление"""
    update_info['available'] = False
    update_info['new_version'] = None
    update_info['changelog'] = []
    
    socketio.emit('update_cancelled', {}, broadcast=True)
    
    return jsonify({
        'success': True,
        'message': 'Обновление отменено'
    })

# ============= API для клиента =============

@app.route('/api/register', methods=['POST'])
def register():
    """Регистрация нового пользователя"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    full_name = data.get('fullName')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    conn = get_db()
    
    # Проверить существование пользователя
    existing = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
    if existing:
        conn.close()
        return jsonify({'error': 'Username already exists'}), 400
    
    # Создать пользователя
    hashed_password = hash_password(password)
    cursor = conn.execute(
        'INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)',
        (username, hashed_password, full_name)
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'user': {
            'id': user_id,
            'username': username,
            'fullName': full_name
        }
    })

@app.route('/api/login', methods=['POST'])
def login():
    """Авторизация пользователя"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db()
    hashed_password = hash_password(password)
    
    user = conn.execute(
        'SELECT id, username, full_name FROM users WHERE username = ? AND password = ?',
        (username, hashed_password)
    ).fetchone()
    
    if not user:
        conn.close()
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Обновить last_seen
    conn.execute('UPDATE users SET last_seen = ? WHERE id = ?', (datetime.now(), user['id']))
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'fullName': user['full_name']
        }
    })

@app.route('/api/users')
def get_users():
    """Получить список пользователей"""
    conn = get_db()
    users = conn.execute('SELECT id, username, full_name, avatar FROM users').fetchall()
    conn.close()
    
    return jsonify({
        'users': [dict(u) for u in users]
    })

@app.route('/api/messages/<chat_id>')
def get_messages(chat_id):
    """Получить сообщения чата"""
    conn = get_db()
    messages = conn.execute('''
        SELECT * FROM messages 
        WHERE chat_id = ? 
        ORDER BY created_at ASC
    ''', (chat_id,)).fetchall()
    conn.close()
    
    return jsonify({
        'messages': [dict(m) for m in messages]
    })

# ============= WebSocket события =============

online_users = {}  # {user_id: socket_id}

@socketio.on('connect')
def handle_connect():
    """Подключение клиента"""
    print(f'✅ Client connected: {request.sid}')
    emit('connected', {'socketId': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    """Отключение клиента"""
    print(f'❌ Client disconnected: {request.sid}')
    
    # Удалить из онлайн пользователей
    user_id = None
    for uid, sid in online_users.items():
        if sid == request.sid:
            user_id = uid
            break
    
    if user_id:
        del online_users[user_id]
        socketio.emit('user_status', {'userId': user_id, 'online': False}, broadcast=True)

@socketio.on('user_online')
def handle_user_online(data):
    """Пользователь онлайн"""
    user_id = data.get('userId')
    online_users[user_id] = request.sid
    
    # Обновить last_seen
    conn = get_db()
    conn.execute('UPDATE users SET last_seen = ? WHERE id = ?', (datetime.now(), user_id))
    conn.commit()
    conn.close()
    
    emit('user_status', {'userId': user_id, 'online': True}, broadcast=True)
    emit('online_users', {'users': list(online_users.keys())})

@socketio.on('send_message')
def handle_send_message(data):
    """Отправка сообщения"""
    chat_id = data.get('chatId')
    message = data.get('message')
    sender_id = data.get('senderId')
    recipient_id = data.get('recipientId')
    
    # Сохранить в БД
    conn = get_db()
    cursor = conn.execute('''
        INSERT INTO messages (chat_id, sender_id, recipient_id, text, type)
        VALUES (?, ?, ?, ?, ?)
    ''', (chat_id, sender_id, recipient_id, message.get('text'), message.get('type', 'text')))
    
    message_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    message_data = {
        'id': message_id,
        'chatId': chat_id,
        'senderId': sender_id,
        'text': message.get('text'),
        'type': message.get('type', 'text'),
        'time': datetime.now().strftime('%H:%M'),
        **message
    }
    
    # Отправить получателю
    if recipient_id in online_users:
        socketio.emit('new_message', {
            'chatId': chat_id,
            'message': message_data
        }, room=online_users[recipient_id])
    
    # Подтвердить отправителю
    emit('message_sent', {'chatId': chat_id, 'message': message_data})

# ============= Запуск сервера =============

if __name__ == '__main__':
    print('=' * 60)
    print('🚀 Сервер мессенджера')
    print('=' * 60)
    
    # Инициализировать БД
    if not os.path.exists(DB_PATH):
        print('📦 Создание базы данных...')
        init_db()
        
        # Создать демо-пользователей
        conn = get_db()
        demo_users = [
            ('admin', 'admin123', 'Администратор'),
            ('user1', '123456', 'Пользователь 1'),
            ('user2', '123456', 'Пользователь 2')
        ]
        
        for username, password, full_name in demo_users:
            hashed = hash_password(password)
            conn.execute(
                'INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)',
                (username, hashed, full_name)
            )
        
        conn.commit()
        conn.close()
        print('✅ Демо-пользователи созданы')
    
    # Получить порт из переменной окружения (для облачных платформ)
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    print(f'\n📊 Сервер запущен на порту {port}')
    print('💬 Панель управления: /admin или главная страница')
    print('\n⚠️  Нажмите Ctrl+C для остановки сервера\n')
    print('=' * 60)
    
    # Запустить сервер
    socketio.run(app, host=host, port=port, debug=False, allow_unsafe_werkzeug=True)
