import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // eslint-disable-next-line no-undef
    process.env.VITE_SINGLE_FILE === 'true' ? viteSingleFile() : null
  ],
  base: './', // Use relative paths for assets
})
