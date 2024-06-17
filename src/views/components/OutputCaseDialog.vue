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
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

export default {
  name: 'markingRecord',
  data() {
    return {
      editor: null,
      outline: [],
      activeName: 'first',
      markdown: `# Hello, World! :icon: ### 被告人谭某某，女，1974
        ##### 指定辩护人胡建和，广东瑞霆律师事务所律师。
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
    initEditor() {
      const markdownWithIcon = this.markdown.replace(
        /:icon:/g,
        `<i id="icon" class="icons">🔍</i>`
      );

      this.editor = new Editor({
        el: document.querySelector('#editor'),
        previewStyle: 'vertical',
        plugins: [colorSyntax],
        initialValue: markdownWithIcon,
        initialEditType: 'wysiwyg',
        hideModeSwitch: true,
        useCommandShortcut: true,
        height: '100%',
        language: 'zh',
        toolbarItems: [
          ['heading', 'bold', 'italic', 'strike', {
            name: 'customButton',
            tooltip: 'Custom Button',
            command: 'customCommand',
            className: 'toastui-editor-customButton',
            text: '字体',
            func:()=>{
              console.log('自定义按钮点击');
            }
          }],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock']
        ]
      });

      // 注册自定义命令
      this.editor.addCommand('markdown', {
        name: 'customCommand',
        exec: (mdEditor) => {
          mdEditor.replaceSelection('**This is a custom command!**');
        }
      });
      let a= '123'
      this.editor.addCommand('wysiwyg', {
        name: 'customCommand',
        exec: (a) => {
          const selection = this.editor.getCurrentModeEditor().getSelection();
          this.editor.getCurrentModeEditor().replaceSelection(`**This is a custom command!** ${selection}`);
        }
      });

      this.generateOutline();
      this.editor.on('change', () => {
        this.generateOutline();
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
</style>
