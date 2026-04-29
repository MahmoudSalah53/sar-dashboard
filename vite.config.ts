import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL

  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is required in .env/.env.local')
  }

  return {
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      rolldownOptions: {
        output: {
          manualChunks: (moduleId: string) => {
            if (moduleId.includes('node_modules/recharts')) return 'recharts'
            if (moduleId.includes('node_modules/@tanstack/react-query')) return 'query'
            if (moduleId.includes('node_modules/@tanstack/react-table')) return 'table'
            if (
              moduleId.includes('node_modules/react/') ||
              moduleId.includes('node_modules/react-dom/') ||
              moduleId.includes('node_modules/react-router-dom/')
            ) {
              return 'react'
            }
            return undefined
          },
        },
      },
    },
  }
})
