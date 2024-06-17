<template>
  <div class="content">
    <div id="editor" ref="editor"></div>
    <div class="outline-container" :class="{'hidden': !open}">
      <div :class="{'checkeditor': open, 'checkeditors': !open}" @click="openCatalogue">
        <i class="el-icon-arrow-right" v-if="open"></i>
        <i class="el-icon-arrow-left" v-else></i>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="大纲" name="first">
          <h2>**笔录</h2>
          <ul>
            <li v-for="heading in outline" :key="heading.id">
              <span
                :href="'#heading-' + heading.id"
                :class="'nav-' + heading.element.nodeName"
                @click="scrollToHeading(heading.id)"
              >{{ heading.text }}</span>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="修订" name="second">修订</el-tab-pane>
        <el-tab-pane label="评论" name="third">评论</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/i18n/zh-cn';
import  colorSyntax  from '@toast-ui/editor-plugin-color-syntax';
import fontSize from '@toast-ui/editor-plugin-fontsize-syntax';
import del from '@toast-ui/editor-plugin-del-syntax';
import bgcolor from '@toast-ui/editor-plugin-bgcolor-syntax';
import indentLeftSyntaxPlugin from '@toast-ui/editor-plugin-indentleft-syntax';
import indentRightSyntaxPlugin from '@toast-ui/editor-plugin-indentright-syntax';
import fontfamily from '@toast-ui/editor-plugin-fontfamily-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

export default {
  name: 'markingRecord',
  data() {
    return {
      editor: null,
      outline: [],
      activeName: 'first',
      markdown: `# Hello, World! <i>🔍</i> ### 被告人谭某某，女，1974
      `,
      open: true,
    };
  },
  mounted() {
    this.initEditor();
    const previewContainer = document.querySelector('#editor');
    if (previewContainer) {
      previewContainer.addEventListener('click', this.handleIconClick);
    }
  },
  methods: {
    openCatalogue() {
      this.open = !this.open;
      const proseMirror = document.querySelector('.toastui-editor-main');
      if (proseMirror) {
        if (this.open) {
          setTimeout(() => {
            proseMirror.classList.remove('closed');
          }, 0);
        } else {
          setTimeout(() => {
            proseMirror.classList.add('closed');
          }, 0);
        }
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    scrollToHeading(id) {},
    getSelectedText() {
    const selection = this.editor.getSelection();
    if (selection && selection.length > 0) {
      const [start, end] = selection;
      const selectedText = this.editor.getValue().slice(start, end);
      return selectedText;
    } else {
      console.log('No text selected.');
      return '';
    }
  },
    initEditor() {
      const markdownWithIcon = this.markdown.replace(
        /:icon:/g,
        `<i id="icon" class="icons">🔍</i>`
      );

      this.editor = new Editor({
        el: document.querySelector('#editor'),
        previewStyle: 'vertical',
        plugins: [bgcolor,colorSyntax,fontSize,del,fontfamily,indentLeftSyntaxPlugin,indentRightSyntaxPlugin],
        initialValue: markdownWithIcon,
        initialEditType: 'wysiwyg',
        hideModeSwitch: true,
        useCommandShortcut: true,
        height: '100%',
        language: 'zh',
        toolbarItems: [
          ['heading', 'bold', 'italic', ],
          // ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock']
        ]
      });
      this.$data.editor = this.editor;
      // 注册自定义命令
      // this.editor.addCommand('markdown',  'customCommand', function (payload) {
      //       return true;
      //   });
      let _this = this;
      // this.editor.addCommand('wysiwyg',
      //    'customCommand', function (payload) {
      //     let colorPicker = document.querySelector('.tui-fontsize-picker-container');
      //     if (!colorPicker) {
      //       colorPicker = document.createElement('ul');
      //       colorPicker.className = 'tui-fontsize-picker-container';
      //       colorPicker.style.display = 'none'; // 默认隐藏
      //       colorPicker.style.position = 'absolute';
      //       colorPicker.style.top = '44px';
      //       colorPicker.style.left = '226px';
      //       colorPicker.style.zIndex = '9999';
      //       colorPicker.style.background = '#fff';
      //       colorPicker.style.border = '1px solid #e8e8e8';
      //       colorPicker.innerHTML = `
      //         <li>9</li>
      //         <li>10</li>
      //         <li>11</li>
      //         <li>12</li>
      //         <li>14</li>
      //         <li>16</li>
      //         <li>18</li>
      //         <li>20</li>
      //         <li>22</li>
      //         <li>24</li>
      //         <li>28</li>
      //         <li>36</li>
      //         <li>42</li>
      //         <li>48</li>
      //         <li>72</li>
      //       `;
      //       // 将颜色选择框添加到编辑器工具栏下方
      //       const toolbar = document.querySelector('.toastui-editor-toolbar');
      //       toolbar.appendChild(colorPicker);
      //     }
      //     // 获取颜色选择框中的所有 li 元素
      //     const liElements = colorPicker.querySelectorAll('li');

      //     // 为每个 li 元素绑定 click 事件
      //     liElements.forEach(li => {
      //       li.addEventListener('click', function() {
      //         // 处理点击事件，例如获取当前选中的字号或执行其他逻辑
      //         // const fontSize = parseInt(_this.innerHTML); // 获取字号，需要转换为整数
      //         // this.editor.exec('changeFontSize', fontSize);
      //         // const selection = _this.editor.getSelectedText();
      //         const fontSize = parseInt(li.innerHTML);
    
      //         // 使用绑定的编辑器实例执行命令
      //         _this.$data.editor.exec('changeFontSize', fontSize);
      //         // 在这里可以处理选中的字号，例如应用到编辑器中
      //       });
      //     });

      //     // 切换颜色选择框的显示状态
      //     if (colorPicker.style.display === 'none') {
      //       colorPicker.style.display = 'block';
      //     } else {
      //       colorPicker.style.display = 'none';
      //     }

      //     return true; // 表示命令处理完成
      //   }
      // );
      // _this.editor.addCommand('wysiwyg', 'changeFontSize', (fontSize) => {
      //     const selection = _this.editor.getSelection();
      //     if (selection && selection[1]-selection[0] > 0) {
      //       const [start, end] = selection;
      //       const range = _this.editor.getSelection(start, end);
      //       _this.editor.applyStyle(range,{ fontSize: `${fontSize}px`});
      //     }
          
      //     return true;
      //   });
      _this.generateOutline();
      _this.editor.on('change', () => {
        _this.generateOutline();
        console.log(this.editor.getMarkdown());
      });
    },
    
   
    generateOutline() {
      const headings = Array.from(document.querySelectorAll('.toastui-editor h1, .toastui-editor h2, .toastui-editor h3'));
      this.outline = headings.map((heading, index) => ({
        id: index,
        text: heading.textContent,
        element: heading,
      }));
    },
    handleIconClick() {},
    iconClicked(event) {
      console.log(event.target.value);
    },
  },
};
</script>

<style lang="less" scoped>
.editor-container {
  overflow: hidden;
  height: 100%;
  position: relative;
  width: 770px;
}

#editor {
  height: 80%;
  width: 100%;
}

.outline-container {
  position: absolute;
  right: 0;
  background-color: #fff;
  height: 80%;
  width: 300px;
  top: 80px;
  border: 1px solid #e8e8e8;
  margin: auto;
  padding: 16px;
  z-index: 20;
  transition: transform 0.3s ease;

  &.hidden {
    transform: translateX(100%);
  }

  .checkeditor,
  .checkeditors {
    position: absolute;
    top: 0px;
    bottom: 0;
    left: 0;
    margin: auto;
    cursor: pointer;
    width: 20px;
    height: 60px;
    background: #83b5eb;
    border-radius: 0px 10px 10px 0px;
    i {
      text-align: center;
      line-height: 60px;
      font-size: 20px;
      color: #fff;
    }
  }
  .checkeditors {
    left: -20px;
    border-radius: 10px 0px 0px 10px;
  }
}

li::marker {
  display: none;
  color: #fff;
}
ul {
  padding-left: 18px;
}

.nav-H1 {
  font-size: 18px;
  font-weight: bold;
}

.nav-H2 {
  padding-left: 10px;
  font-size: 15px;
}

.nav-H3 {
  padding-left: 20px;
  font-size: 12px;
}
/deep/.el-tabs__nav-wrap{
  padding: 0 15px !important;
}
/deep/.toastui-editor-main {
  width: calc(100% - 300px) !important;
}
/deep/.toastui-editor-main.closed {
  width: 100% !important;
}
/deep/.tui-fontsize-picker-container{
  width: 120px;
  padding: 0;
  margin: 0;
  border-radius: 4px;
  box-shadow: 0px 4px 24px 0px rgba(0,0,0,0.1);

  li{
    text-align: center !important;
    padding: 5px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    min-height: 36px;
    padding: 0px 14px;
    margin: 0px 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    border-radius: 4px;
    user-select: none;
  }
  li:hover{
    background-color: #f1f2f2;
  }
}
.toastui-editor-toolbar{

}
/deep/.toastui-editor-popup{
  border: none;
}
/deep/.toastui-editor-toolbar-item-wrapper{
  margin: 0;
  width: 70px;
  height: 38px;
  div{
    padding: 3px;
    border-radius: 5px;
  }
  div >input{
    border: none !important;
  }
  div >button{
    height: 25px;
    height: 25px;
    border: none;
    margin-left: 0px;
  }
  div >button:hover{
    border: none;
    background: rgb(241, 242, 242)  ;
  }
}
/deep/.toastui-editor-popup-fontSize,/deep/ .toastui-editor-popup-fontfamily{

        width: 120px;
        padding: 3px 0;
        margin: 0;
        border-radius: 4px;
        box-shadow: 0px 4px 24px 0px rgba(0, 0, 0, 0.1);
        background: rgb(255, 255, 255);
        border: 1px solid rgb(232, 232, 232); 
        li{
          text-align: center !important;
          padding: 5px;
          display: flex;
          align-items: center;
          min-height: 36px;
          padding: 0px 14px;
          margin: 0px 4px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          border-radius: 4px;
          -webkit-user-select: none;
          -moz-user-select: none;
          user-select: none;
        }
        li:hover{
          background-color: #f1f2f2;
        }
      }
</style>
