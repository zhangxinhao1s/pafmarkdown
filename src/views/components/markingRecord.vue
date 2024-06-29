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
    <div class="clipboard-box outline-container" :class="{'hidden': opencli}">
      <cliboardbox
      :clipboardList="clipboardList"
      @delete="handleDelete"
      @copy="handleCopy"
      @close="handleClose"
      ></cliboardbox>
    </div>
    <div id="sc-muc">
      <img src="./../../assets/svg/float.svg" alt="">
    </div>
  </div>
</template>

<script>
import '../../lib/toast-editor/editor/dist/toastui-editor.css';
import './../../lib/toast-editor/editor/dist/i18n/zh-cn.js';
import Editor from './../../lib/toast-editor/editor/dist/esm/index.js';
import  colorSyntax  from './../../lib/toast-editor/editor-plugin-color-syntax';
import fontSize from './../../lib/toast-editor/editor-plugin-fontsize-syntax';
import del from './../../lib/toast-editor/editor-plugin-del-syntax';
import bgcolor from './../../lib/toast-editor/editor-plugin-bgcolor-syntax';
import fontfamily from './../../lib/toast-editor/editor-plugin-fontfamily-syntax';
import underline from './../../lib/toast-editor/editor-plugin-underline-syntax';
import cliboardbox from '@/components/clipboardbox.vue';

// import 'tui-color-picker/dist/tui-color-picker.css';
import './../../lib/toast-editor/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

export default {
  name: 'markingRecord',
  components: {
      cliboardbox
    },
  data() {
    return {
      editor: null,
      outline: [],
      activeName: 'first',
      clipboardList: [
        {
          title:'摘要',
          time:'2024.06.02',
          abstract:'犯罪嫌疑人万从某（曾用名：仁磊，绰号：老二老六老八）',
          briefSummary:'小结小结',
          prompt:'无'
        },
        {
          title:'截图',
          time:'2024.06.02',
          abstract:'犯罪嫌疑人万从某（曾用名：仁磊，绰号：老二老六老八）',
          briefSummary:'大结大结',
          prompt:'无',
          screenshot:'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
        },
        {
          title:'摘要',
          time:'2024.06.02',
          abstract:'犯罪嫌疑人万从某（曾用名：仁磊，绰号：老二老六老八）',
          briefSummary:'小结小结',
          prompt:'无'
        },
        {
          title:'摘要',
          time:'2024.06.02',
          abstract:'犯罪嫌疑人万从某（曾用名：仁磊，绰号：老二老六老八）',
          briefSummary:'小结小结',
          prompt:'无'
        },
        {
          title:'摘要',
          time:'2024.06.02',
          abstract:'犯罪嫌疑人万从某（曾用名：仁磊，绰号：老二老六老八）',
          briefSummary:'小结小结',
          prompt:'无'
        },  
      ],
      opencli:true,
      markdown: `

<div><p class="yjbl_zjxj">（5）户籍信息。（证据卷P63-P64）<span id="yjblzjzy_c601292de228f472291fc69e200acfba" class="yjbl_yh" style="display:none;">证据卷/第10页:mlbh/wjxh</span></p></div>
<div>证据小结：<span class="yjbl_zjxj">证实犯罪嫌疑人+++的抓获经过<span class="yjbl_yh" style="display:none;">证据卷/第10页:mlbh/wjxh</span></span></div>
<div>证据摘要：<span class="yjbl_zjzy">鹏程市黔西县公安局刑事侦察大队侦查员张杰、陈明仁出具的抓获经过一份。</span></div>
<div>风险提示：<span class="yjbl_fxts">嫌疑人逃避侦查</span></div>
<div>证据小结：<span class="yjbl_zjxj">证实犯罪嫌疑人+++的抓获经过</span></div>
</sapn>
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
    // 关闭剪贴板
    handleClose() {
      this.opencli = true;
    },
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
      var editorInstance;
      editorInstance = new Editor({
        el: document.querySelector('#editor'),
        previewStyle: 'vertical',
        plugins: [bgcolor,underline,fontSize,del,colorSyntax,fontfamily,],
        initialValue: markdownWithIcon,
        initialEditType: 'wysiwyg',
        hideModeSwitch: true,
        useCommandShortcut: true,
        height: '100%',
        language: 'zh',
        toolbarItems: [
          ['heading' ],
          ['bold', 'code','italic'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],    [{
          name: 'customFontSize',
          tooltip: '剪贴板',
          className: 'toastui-editor-custom-clipboard',
          el: this.createCustomButton(),
          command: 'customCommand'
        }],
          ['table', 'image', 'link'],
        ],
        events: {
          'load': this.onEditorLoad,
          // 'change': this.onEditorChange
        }
      });
      this.editor = editorInstance;
      this.$data.editor = this.editor;
      // 注册自定义命令
      let _this = this;
      _this.generateOutline();
        // _this.editor.on('load', () => {
        // });
      _this.editor.on('change', () => {
        // const editorContent = _this.editor.getEl().querySelector('.toastui-editor-contents');
        // console.log('text------', _this.editor.getMarkdown());
        this.onEditorLoad();
        _this.generateOutline();
      });
    },
    onEditorLoad(){
      setTimeout(() => {
        // const editorContent = document.querySelector('.toastui-editor-contents');
      const proseMirror = document.querySelector('.toastui-editor-ww-container');
        if (proseMirror) {
          const absoluteElement = document.getElementById('sc-muc');
          absoluteElement.style.display = 'none'; // 初始隐藏
          absoluteElement.style.transition = 'left 0.2s ease, top 0.2s ease';
          // 将绝对定位元素添加到 proseMirror 容器中
          proseMirror.appendChild(absoluteElement);
          // 获取所有孙子节点的后代元素中的指定标签
          const tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'code'];
          proseMirror.addEventListener('mousemove', (event) => {
          const mouseY = event.pageY;

          tags.forEach(tag => {
            const elements = proseMirror.querySelectorAll(`* > * > ${tag}`);

            elements.forEach(element => {
              const elementRect = element.getBoundingClientRect();
              
              // 如果鼠标高度等于某个标签的高度，显示绝对定位元素
              if (mouseY >= elementRect.top && mouseY <= elementRect.bottom) {
                absoluteElement.style.display = 'block';
                absoluteElement.style.left = `${elementRect.left-70}px`;
                absoluteElement.style.top = `${elementRect.top-148}px`;

              }
            });
          });
        });
        }
      },10);
    },
    createCustomButton() {
      let _this = this;
      const button = document.createElement('button');
      button.innerHTML = `
      <svg width="23px" height="23px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>剪切板</title>
        <g id="辅助办案" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="阅卷笔录-大纲" transform="translate(-1687, -115)" fill="#000000" fill-rule="nonzero">
                <g id="编组-26" transform="translate(980, 103)">
                    <g id="编组-7" transform="translate(89, 0)">
                        <g id="剪切板" transform="translate(618, 12)">
                            <rect id="矩形" opacity="0" x="0" y="0" width="16" height="16"></rect>
                            <path d="M13.7690469,2.71573437 L12.107875,2.71573437 C11.9272812,2.71573437 11.7811406,2.86201562 11.7811406,3.04245312 C11.7811406,3.22289062 11.9272812,3.36921875 12.1078594,3.36921875 L13.7690625,3.36921875 L13.7690625,14.3559375 L2.241125,14.3559375 L2.241125,3.36921875 L3.92909375,3.36921875 C4.10971875,3.36921875 4.25584375,3.22289062 4.25584375,3.04246875 C4.25584375,2.86201562 4.10970312,2.71573437 3.92910937,2.71573437 L2.241125,2.71573437 C1.880875,2.71573437 1.58764062,3.00879687 1.58764062,3.36921875 L1.58764062,14.3559375 C1.58764062,14.7162031 1.880875,15.0094375 2.241125,15.0094375 L13.7690469,15.0094375 C14.1292812,15.0094375 14.4225312,14.7162031 14.4225312,14.3559531 L14.4225312,3.36921875 C14.4225312,3.00879687 14.1292812,2.71573437 13.7690469,2.71573437 Z M5.41154688,3.38964062 L10.5986094,3.38964062 C10.7792188,3.38964062 10.9253594,3.24334375 10.9253594,3.062875 C10.9253594,2.88245312 10.7792188,2.73615625 10.5986094,2.73615625 L9.59667188,2.73615625 C9.60146875,2.692125 9.60817188,2.64873437 9.60817188,2.60340625 C9.60817188,1.71953125 8.88895313,1.00032812 8.00510938,1.00032812 C7.12123438,1.00032812 6.40201563,1.71954687 6.40201563,2.60340625 C6.40201563,2.64873437 6.40873438,2.692125 6.4135,2.73615625 L5.4115625,2.73615625 C5.23096875,2.73615625 5.08484374,2.88245312 5.08484374,3.062875 C5.08484374,3.24334375 5.2309375,3.38964062 5.4115625,3.38964062 L5.41154688,3.38964062 Z M7.05548437,2.60340625 C7.05548437,2.07979687 7.48145312,1.6538125 8.00509375,1.6538125 C8.52870312,1.6538125 8.9546875,2.07979687 8.9546875,2.60340625 C8.9546875,2.649375 8.94415625,2.692125 8.93714062,2.73615625 L7.07303125,2.73615625 C7.066,2.692125 7.05548437,2.64935937 7.05548437,2.60340625 L7.05548437,2.60340625 Z M4.72042187,6.58559375 L11.28975,6.58559375 C11.4703437,6.58559375 11.6164687,6.43928125 11.6164687,6.25884375 C11.6164687,6.07840625 11.4703437,5.93209375 11.28975,5.93209375 L4.72042187,5.93209375 C4.53979687,5.93209375 4.3936875,6.07842188 4.3936875,6.25884375 C4.3936875,6.43926563 4.53982812,6.58557813 4.72040625,6.58557813 L4.72042187,6.58559375 Z M4.72042187,9.39353125 L11.28975,9.39353125 C11.4703437,9.39353125 11.6164687,9.24739062 11.6164687,9.0668125 C11.6164687,8.88623437 11.4703437,8.74004687 11.28975,8.74004687 L4.72042187,8.74004687 C4.53979687,8.74004687 4.3936875,8.88620312 4.3936875,9.06679687 C4.3936875,9.24739062 4.53982812,9.39353125 4.72040625,9.39353125 L4.72042187,9.39353125 Z M4.72042187,12.2015 L11.28975,12.2015 C11.4703437,12.2015 11.6164687,12.0553594 11.6164687,11.8747344 C11.6164687,11.6941406 11.4703437,11.5480156 11.28975,11.5480156 L4.72042187,11.5480156 C4.53979687,11.5480156 4.3936875,11.6941406 4.3936875,11.8747344 C4.3936875,12.0553594 4.53982812,12.2014844 4.72040625,12.2014844 L4.72042187,12.2015 Z" id="形状"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
      `;
      button.style.background = 'none';
      button.className = 'toastui-editor-custom-button';
      button.addEventListener('click', function (ev) {
        // 控制剪贴板显示
        _this.opencli = !_this.opencli;
      })
      return button;
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
    handleDelete(){
      console.log('handleDelete');
    },
    handleCopy() {
      console.log('handleCopy');
    }
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
  top: 65px;
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
    width: 16px;
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
  // width: 70px;
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
/deep/.toastui-editor-popup-fontSize,/deep/ .toastui-editor-popup-fontStyle{

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

.clipboard-box{
  width: 350px;
  height: 89%;  
}
#sc-muc{
  position: absolute;
  img{
    width: 18px;
    height: 18px;
  }
}
</style>
