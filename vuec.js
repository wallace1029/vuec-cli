#!/usr/bin/env node   //这里很重要，标记为node运行环境！

const clone = require('git-clone-promise')
const program = require('commander')
const shell = require('shelljs')
const path = require('path')
const fs = require('fs')

program
  .version('1.0.0')
  .description('Easy to build vue component project.')

program
  // 命名命令，必选参数componentName,传入action函数第一个参数
  .command('create <componentName>')
  // 可选参数，确定使用的ui库，只能传入指定值，默认'vue'
  .option('-U, --ui [ui]', '选择ui框架', /^(vue|element|sweet)$/i, 'vue')
  .action(function (componentName, options) { // 执行命令的的函数
    // 从optiosn中获取ui
    const {ui} = options
    // 获取当前命令的路径
    const pwd = shell.pwd()
    // 获取项目的最终存放路径
    const targetPath = path.join(pwd.toString(), componentName)
    const repository = 'https://github.com/youzhiwang/sweet-banner'
    console.log('正在获取组件模板，请耐心等待...')
    clone(repository, targetPath).then(res => {
      // 删除.git文件
      shell.rm('-rf', path.join(targetPath, '.git'))
      fs.readFile(path.join(targetPath, './package.json'), 'utf8', (err, data) => {
        if (err) throw err
        let list = JSON.parse(data)
        list.name = componentName
        let newContent = JSON.stringify(list, null, 2)
        fs.writeFile(path.join(targetPath, './package.json'), newContent, 'utf8', err => {
          if (err) throw err
          console.log('模板下载完成！')
        })
      })
    })
  })

program
  .on('--help', () => {
    console.log('Example:')
    console.log('  创建一个默认的项目')
    console.log('     $ efox create  或者 $ efox c')
    console.log('  创建指定平台(web/mobile/ie8)、指定开发框架(vue/react/jQuery/angular)、指定项目名的项目')
    console.log('     $ efox create testname -p web -f react \n')
  })

program.parse(process.argv)