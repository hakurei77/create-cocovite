#!/usr/bin/env node
 
import prompts from "prompts";
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";
const bootstrap = async () => {
    //别动字体画，这样能正常显示！！！！！！！！！！！！！
    console.log(`⣿⣿⣿⠟⠛⠛⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢋⣩⣉⢻⣿⣿
⣿⣿⣿⠀⣿⣶⣕⣈⠹⠿⠿⠿⠿⠟⠛⣛⢋⣰⠣⣿⣿⠀⣿⣿
⣿⣿⣿⡀⣿⣿⣿⣧⢻⣿⣶⣷⣿⣿⣿⣿⣿⣿⠿⠶⡝⠀⣿⣿
⣿⣿⣿⣷⠘⣿⣿⣿⢏⣿⣿⣋⣀⣈⣻⣿⣿⣷⣤⣤⣿⡐⢿⣿
⣿⣿⣿⣿⣆⢩⣝⣫⣾⣿⣿⣿⣿⡟⠿⠿⠦⠀⠸⠿⣻⣿⡄⢻
⣿⣿⣿⣿⣿⡄⢻⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣾⣿⣿⣿⣿⠇⣼
⣿⣿⣿⣿⣿⣿⡄⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣰⣿
⣿⣿⣿⣿⣿⣿⠇⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢀⣿⣿
⣿⣿⣿⣿⣿⠏⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿
⣿⣿⣿⣿⠟⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿
⣿⣿⣿⠋⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⣿⣿
⣿⣿⠋⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢸⣿
    `)
    //还有这里！！！！！！！！！！！！！！！！！！！！！
    console.log(`———————————————————————————————————————————————————`)
    console.log(chalk.bold(`关注博丽七七喵，关注博丽七七谢谢喵(＾• ω •＾)`))
    console.log(`———————————————————————————————————————————————————`)
    //————————————————————————————————————————————————————————————————————————————
    const result =  await prompts([
        {
            type: "text",
            name: "projectName",
            message: "请输入项目名称:"
        },
        {
            type: 'select',
            name: 'projectSelect',
            message: '请选择项目类型:',
            choices: [
                { title: chalk.cyan("cocovite"), value:"cocovite"},
                { title: chalk.green('npmvite') , value:"npmvite"},
                { title: chalk.blue("uivite"), value:"uivite"},
            ],
            initial: 0
        }
        
    ]);
    //管理控制台输入
    //————————————————————————————————————————————————————————————————————————————————————————————————
    const targetPath = path.resolve(process.cwd(), result.projectName);
    let sourcePath:string = "";
    function projectSelectfn(projectName:string){
        sourcePath = path.resolve(__dirname, `../template/${projectName}`);
    }
    projectSelectfn(result.projectSelect);
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
    恭喜狗修金sama，项目创建成功！！！！！
    cd ${result.projectName}
    pnpm i
    pnpm run dev
    `)
};
bootstrap();