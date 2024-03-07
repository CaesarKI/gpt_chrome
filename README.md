### 关于 gpt 文档模型使用的 chrome 插件

## 支持后台自定义配置

![image-20240307163132959](https://raw.githubusercontent.com/CaesarKI/gpt_chrome/master/back.png)

## 插件效果展示

Mac 快捷键 command+shift+1

Window 快捷键 Alt+1

使用快捷键会弹出一个输入框，输入内容后会调用 gpt 接口将答复内容展示在页面上。页面展示如下：

![image-20240307163802445](https://raw.githubusercontent.com/CaesarKI/gpt_chrome/master/input.png)

![image-20240307164012188](https://raw.githubusercontent.com/CaesarKI/gpt_chrome/master/panel.png)

## 使用方式

1. **git clone**仓库
2. **npm install **安装依赖，**node** 版本 14.x.x
3. **npm run build:dev** 打包代码
4. 将打包生成的 dist 文件放入 chrome 插件解压后便可以使用了
