// custom-toolbar.js

function customToolbar(editor) {
    console.log(editor,'edtior');
    const toolbar = editor.getUI().getToolbar();
  
    // 添加字体按钮
    toolbar.addItem({
      type: 'button',
      options: {
        name: 'fontFamily',
        className: 'toastui-editor-custom-toolbar-font-family',
        event: 'clickFontFamily',
        tooltip: 'Font Family',
        style: 'font-family: Arial;',
        text: 'Arial'
      }
    });
  
    // 添加字体大小按钮
    toolbar.addItem({
      type: 'button',
      options: {
        name: 'fontSize',
        className: 'toastui-editor-custom-toolbar-font-size',
        event: 'clickFontSize',
        tooltip: 'Font Size',
        text: '14px'
      }
    });
  
    // 添加字体颜色按钮
    toolbar.addItem({
      type: 'button',
      options: {
        name: 'fontColor',
        className: 'toastui-editor-custom-toolbar-font-color',
        event: 'clickFontColor',
        tooltip: 'Font Color',
        style: 'color: black;',
        text: 'A'
      }
    });
  
    // 为按钮添加事件监听器
    editor.eventManager.addEventType('clickFontFamily');
    editor.eventManager.listen('clickFontFamily', () => {
      const fontFamily = prompt('Enter font family:', 'Arial');
      editor.exec('fontName', fontFamily);
    });
  
    editor.eventManager.addEventType('clickFontSize');
    editor.eventManager.listen('clickFontSize', () => {
      const fontSize = prompt('Enter font size:', '14px');
      editor.exec('fontSize', fontSize);
    });
  
    editor.eventManager.addEventType('clickFontColor');
    editor.eventManager.listen('clickFontColor', () => {
      const fontColor = prompt('Enter font color (hex/rgb):', 'black');
      editor.exec('foreColor', fontColor);
    });
  }
function createFontSizeDropdown(editor) {
    const dropdown = document.createElement('select');
    dropdown.innerHTML = `
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
    `;

    // 添加事件监听器，在选择不同的字号时触发命令
    dropdown.addEventListener('change', (event) => {
        const selectedFontSize = event.target.value;
        editor.exec('fontSize', selectedFontSize);
    });

    return dropdown;
}
  
  export default {customToolbar,createFontSizeDropdown};
  