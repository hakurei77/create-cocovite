import { fileURLToPath, URL } from 'node:url'
import { resolve, dirname } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    publicDir:'empty',
    build: {
        outDir: 'dist/es',
        lib: {
            entry: resolve(__dirname, 'src/bundle.ts'),
            name: "cocoreimuUI",
            fileName: "cocoreimu-ui",
            formats: ['es']
        },
        rollupOptions:{
            external:[
                'vue'
            ]
        }
    }
})