import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: "127.0.0.1",
    port: 9999,
    open: false,
    strictPort: false,
    cors: true,
    proxy: {
      // 代理规则直接放在 server 对象下，而非嵌套的 server 对象中
      '/oauth': {
        target: "https://aip.baidubce.com",
        changeOrigin: true,
      },
      '/rpc':{
        target: "https://aip.baidubce.com",
        changeOrigin: true,
      },
      '/api/v2':{
        target: "https://sex.nyan.xyz",
        changeOrigin: true,
      }
    },
  },
})
