import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/xujia_studying/', // 레포지토리 이름을 정확히 입력
})
