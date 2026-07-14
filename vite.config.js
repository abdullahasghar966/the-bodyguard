import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// THE BODYGUARD — dev/build config.
// PORT env (set by preview tooling) wins so parallel sessions don't clash.
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    host: true,
  },
})
