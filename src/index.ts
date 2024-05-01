#!/usr/bin/env node
 
import prompts from "prompts";
import path from "node:path";
import fs from "node:fs";
const bootstrap = async () => {
    const result =  await prompts([
        {
            type: "text",
            name: "projectName",
            message: "请输入项目名称:"
        },
    ]);
    const targetPath = path.resolve(process.cwd(), result.projectName);
    const sourcePath = path.resolve(__dirname, "../template");
    console.log(targetPath);
    fs.cpSync(sourcePath, targetPath,{
        recursive: true,
    });
    fs.renameSync(
        path.resolve(targetPath, "_gitignore"),
        path.resolve(targetPath, ".gitignore")
    );
    console.log(`
    恭喜狗修金sama，项目创建成功！！！！！
    cd ${result.projectName}
    pnpm i
    pnpm run dev
    `)
};
bootstrap();