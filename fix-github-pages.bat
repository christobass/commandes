@echo off
echo ============================================
echo DIAGNOSTIC ET CORRECTION GITHUB PAGES
echo ============================================
echo.

echo [DIAGNOSTIC 1] Verification de vite.config.js...
if exist vite.config.js (
    echo [OK] vite.config.js existe
    echo.
    echo Contenu actuel:
    type vite.config.js
    echo.
) else (
    echo [ERREUR] vite.config.js n'existe pas!
    echo.
)

echo.
echo [DIAGNOSTIC 2] Verification de package.json...
if exist package.json (
    echo [OK] package.json existe
    echo.
    echo Scripts de build:
    findstr "build" package.json
    echo.
) else (
    echo [ERREUR] package.json n'existe pas!
)

echo.
echo ============================================
echo CORRECTION AUTOMATIQUE
echo ============================================
echo.

echo [ETAPE 1/5] Suppression de l'ancien vite.config.js...
if exist vite.config.js del vite.config.js
echo OK

echo.
echo [ETAPE 2/5] Creation du nouveau vite.config.js...
(
echo import { defineConfig } from 'vite'
echo import react from '@vitejs/plugin-react'
echo.
echo // https://vitejs.dev/config/
echo export default defineConfig^(^{
echo   plugins: [react^(^)],
echo   base: '/gestion-commandes/'
echo }^)
) > vite.config.js
echo OK

echo.
echo [ETAPE 3/5] Verification du contenu...
type vite.config.js
echo.

echo.
echo [ETAPE 4/5] Suppression du cache de build...
if exist dist (
    rmdir /s /q dist
    echo OK - dist supprime
) else (
    echo OK - pas de dist a supprimer
)

if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo OK - cache Vite supprime
) else (
    echo OK - pas de cache Vite
)

echo.
echo [ETAPE 5/5] Test du build local...
echo Lancement de: npm run build
echo.
call npm run build

if errorlevel 1 (
    echo.
    echo [ERREUR] Le build a echoue!
    echo Verifiez les erreurs ci-dessus.
    pause
    exit /b 1
)

echo.
echo ============================================
echo BUILD REUSSI!
echo ============================================
echo.

echo Verifiez le dossier dist:
if exist dist\index.html (
    echo [OK] dist\index.html existe
) else (
    echo [ERREUR] dist\index.html manquant!
)

echo.
echo ============================================
echo PROCHAINES ETAPES
echo ============================================
echo.
echo 1. Verifiez que vite.config.js contient:
echo    base: '/gestion-commandes/'
echo.
echo 2. Committez les changements:
echo    git add .
echo    git commit -m "Fix: vite.config.js base path"
echo    git push origin main
echo.
echo 3. Attendez 2-5 minutes
echo.
echo 4. Testez: https://christobass.github.io/gestion-commandes/
echo.
echo ============================================
pause
