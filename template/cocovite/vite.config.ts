import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
//引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
//mock插件提供方法
import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig(({ command }) => {
  return {
    plugins: [vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        localEnabled: command === 'serve',
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    },
    css: { //scss全局变量的配置
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@import "./src/styles/variable.scss";`
        }
      }
    },
  }
})
