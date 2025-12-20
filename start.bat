@echo off
chcp 65001 >nul
cls
echo ========================================
echo   🚀 Запуск мессенджера
echo ========================================
echo.
echo Запуск сервера...
start "" python server.py
echo.
echo Ожидание запуска (5 сек)...
timeout /t 5 /nobreak >nul
echo.
echo Открытие мессенджера...
start http://localhost:5000/app
echo.
echo ========================================
echo ✅ Готово!
echo ========================================
echo.
echo 📊 Панель управления: http://localhost:5000
echo 💬 Мессенджер: http://localhost:5000/app
echo.
echo ДЕМО-АККАУНТЫ:
echo - admin / admin123
echo - user1 / 123456
echo - user2 / 123456
echo.
pause
