import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pagesでデプロイする場合は、リポジトリ名を設定してください
// 例: https://username.github.io/repository-name/ の場合は '/repository-name/'
export default defineConfig({
  plugins: [react()],
  base: './', // 相対パスを使用（任意のパスで動作）
  build: {
    outDir: 'dist',
  },
});
