import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const prod = process.env.NODE_ENV === 'production';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base : prod ? '/Seraph/' : '/',
})
