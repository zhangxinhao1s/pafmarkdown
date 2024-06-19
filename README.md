# 卷宗制作

# env.production 为打包环境
# 其他env地址，同时改变，目前不知道原来的人用的哪一个，建议全部改变
编辑器中文显示
修改了 @toast-ui/editor/dist/i18n/zh-cn';文件
_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage('zh-CN'
改为
_editorCore__WEBPACK_IMPORTED_MODULE_0___default().setLanguage(['zh','zh-cn']

字体颜色功能需要另装插件
 # npm install @toast-ui/editor-plugin-color-syntax
```vue
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

import Editor from '@toast-ui/editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
  
const editor = new Editor({
  // ...
  plugins: [colorSyntax]
});```

```


主要内容完成页面框架搭建，然后就是markdown编辑器模块，完成了一部分的工具栏模块功能

难点：主要是部分工具栏需要自己做插件，然后和原先的工具有点冲突，后续需要改动

卷宗展示
1.卷宗目录展示
2.卷宗文件展示（需要对卷宗文件进行缓存，当前查看文件的前三后三）
3.卷宗文件展示中提供框选后插入笔录、添加书签功能
4.卷宗文件展示中提供截图功能
阅卷笔录
1.Markdown文本展示
2.MarkDown文本中光标位置工具栏
3.Markdown文本定位图标点击定位到卷宗文件中，并在卷宗文件中框选相应内容
4.Markdown文本定位连接点击定位到卷宗文件中，并在卷宗文件中框选相应内容
5.Markdown文本大纲显示
6.markdown文本修订功能
7.Markdown文本评论功能
8.阅卷笔录三种展现形式（导图式、表格式、时间线式）
9.智能写作