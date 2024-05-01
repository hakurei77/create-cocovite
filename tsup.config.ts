import { defineConfig } from 'tsup'
 
export default defineConfig({
    target:"node18",
    entry:["src/index.ts"],
    clean: true,
    format:["cjs"],
    minify: true,
    platform: "node",
    outDir: "dist",
})