import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포를 위한 설정: 레포지토리 이름이 'xujia_studying'인 경우 아래와 같이 설정합니다.
  // 주소가 https://dghjsh-max.github.io/xujia_studying/ 이므로 경로 앞뒤에 슬래시(/)가 포함되어야 합니다.
  base: '/xujia_studying/', 
})