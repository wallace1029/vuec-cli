#!/usr/bin/env node
//这里很重要，标记为node运行环境！
const clone = require('git-clone-promise')
const program = require('commander')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs')

const docs = require('./docs')

program
  .version('1.0.0')
  .description('Craete vue component project.')

program
// 命名命令，必选参数componentName,传入action函数第一个参数
  .command('create <componentName>')
  // 可选参数，确定使用的ui库，只能传入指定值，默认'vue'
  .option('-t, --template <template>', '选择ui框架', /^(vue)$/i, 'vue')
  .action(function (componentName, options) {
    // 执行命令的的函数
    // 从options中获取template
    const {template} = options
    // 获取当前命令的路径
    const pwd = shell.pwd()
    // 获取项目的最终存放路径
    const targetPath = path.join(pwd.toString(), componentName)
    const repository = `https://github.com/youzhiwang/${template}-component`
    console.log('正在获取组件模板，请耐心等待...')
    clone(repository, targetPath).then(res => {
      // 删除.git文件
      shell.rm('-rf', path.join(targetPath, '.git'))
      // 改写package.json中的部分配置
      fs.readFile(path.join(targetPath, './package.json'), 'utf8', (err, data) => {
        if (err) throw err
        let list = JSON.parse(data)
        list.name = componentName
        list.main = `lib/${componentName}.umd.min.js`
        list.scripts.lib = `vue-cli-service build --target lib --name ${componentName} --dest lib packages/index.js`
        let newContent = JSON.stringify(list, null, 2)
        fs.writeFile(path.join(targetPath, './package.json'), newContent, 'utf8', err => {
          if (err) throw err
          console.log('模板下载完成！')
          console.log(``)
          console.log(`cd ${componentName}`)
          console.log(`npm run serve`)
        })
      })
    })
  })

program
  .on('--help', () => {
    docs.explain()
  })

program.parse(process.argv)
// 如果参数的长度为0，例如只输入了vuec，则打印出说明方法
const {args} = program
if (args.length === 0) program.help()
