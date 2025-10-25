@echo off
echo ============================================
echo NETTOYAGE COMPLET - Suppression des fichiers casses
echo ============================================
echo.

echo [1/6] Arret du serveur si actif...
taskkill /F /IM node.exe 2>nul
echo OK

echo.
echo [2/6] Suppression des fichiers React casses...
if exist src\App.jsx del /F /Q src\App.jsx
if exist src\order-tracking-app-with-auth.tsx del /F /Q src\order-tracking-app-with-auth.tsx
echo OK - Fichiers casses supprimes

echo.
echo [3/6] Suppression du cache...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .vite rmdir /s /q .vite
echo OK - Cache supprime

echo.
echo [4/6] Nettoyage npm...
npm cache clean --force
echo OK

echo.
echo [5/6] Reinstallation...
npm install
if errorlevel 1 (
    echo ERREUR lors de npm install
    pause
    exit /b 1
)
echo OK

echo.
echo [6/6] Verification de package.json...
findstr /C:"bcrypt" package.json >nul 2>&1
if not errorlevel 1 (
    echo ATTENTION: bcrypt trouve dans package.json !
    echo Supprimez les lignes contenant "bcrypt" manuellement
    pause
)

echo.
echo ============================================
echo NETTOYAGE TERMINE !
echo ============================================
echo.
echo PROCHAINES ETAPES:
echo.
echo 1. Telechargez App.jsx (59 KB)
echo 2. Copiez-le dans src\
echo 3. Lancez: npm run dev
echo.
echo Appuyez sur une touche pour continuer...
pause >nul
