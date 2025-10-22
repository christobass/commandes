import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ⚠️ IMPORTANT : Remplacez par le nom EXACT de votre repo GitHub
  base: '/christobass/commandes',
})