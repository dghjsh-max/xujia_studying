import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/xujia_studying/', // 반드시 레포지토리 이름과 일치해야 함
})