#!/usr/bin/env node
 
import prompts from "prompts";
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";
const bootstrap = async () => {
    const result =  await prompts([
        {
            type: "text",
            name: "projectName",
            message: "请输入项目名称:"
        },
    ]);
    //管理控制台输入
    //————————————————————————————————————————————————————————————————————————————————————————————————
    const targetPath = path.resolve(process.cwd(), result.projectName);
    const sourcePath = path.resolve(__dirname, "../template");
    // Copy files from sourcePath to targetPath
    fs.cpSync(sourcePath, targetPath, { recursive: true });
    // Update package.json
    const packageJsonPath = path.resolve(targetPath, 'package.json');
    const packageJson = require(packageJsonPath);
    packageJson.name = result.projectName;
    // Write the updated package.json back to the file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    // Rename _gitignore to .gitignore
    fs.renameSync(
        path.resolve(targetPath, "_gitignore"),
        path.resolve(targetPath, ".gitignore")
    );
    //————————————————————————————————————————————————————————————————————————————————————————————————
    //最后输出
    console.log(`
    cd ${result.projectName}
    pnpm i
    pnpm run dev
    `)
};
bootstrap();