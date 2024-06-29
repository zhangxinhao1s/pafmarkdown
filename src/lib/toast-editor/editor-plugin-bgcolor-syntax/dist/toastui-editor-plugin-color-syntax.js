/*!
 * TOAST UI Editor : Color Syntax Plugin
 * @version 3.1.0 | Fri Aug 05 2022
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("tui-color-picker"));
	else if(typeof define === 'function' && define.amd)
		define(["tui-color-picker"], factory);
	else if(typeof exports === 'object')
		exports["toastui"] = factory(require("tui-color-picker"));
	else
		root["toastui"] = root["toastui"] || {}, root["toastui"]["Editor"] = root["toastui"]["Editor"] || {}, root["toastui"]["Editor"]["plugin"] = root["toastui"]["Editor"]["plugin"] || {}, root["toastui"]["Editor"]["plugin"]["uml"] = factory(root["tui"]["colorPicker"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__858__) {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 858:
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__858__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ bgcolorSyntaxPlugin; }
});

// EXTERNAL MODULE: external {"commonjs":"tui-color-picker","commonjs2":"tui-color-picker","amd":"tui-color-picker","root":["tui","colorPicker"]}
var external_commonjs_tui_color_picker_commonjs2_tui_color_picker_amd_tui_color_picker_root_tui_colorPicker_ = __webpack_require__(858);
var external_commonjs_tui_color_picker_commonjs2_tui_color_picker_amd_tui_color_picker_root_tui_colorPicker_default = /*#__PURE__*/__webpack_require__.n(external_commonjs_tui_color_picker_commonjs2_tui_color_picker_amd_tui_color_picker_root_tui_colorPicker_);
;// CONCATENATED MODULE: ./src/i18n/langs.ts
function addLangs(i18n) {
    i18n.setLanguage('ar', {
        'Text color': 'لون النص',
    });
    i18n.setLanguage(['cs', 'cs-CZ'], {
        'Text color': 'Barva textu',
    });
    i18n.setLanguage(['de', 'de-DE'], {
        'Text color': 'Textfarbe',
    });
    i18n.setLanguage(['en', 'en-US'], {
        'Text color': 'Text color',
    });
    i18n.setLanguage(['es', 'es-ES'], {
        'Text color': 'Color del texto',
    });
    i18n.setLanguage(['fi', 'fi-FI'], {
        'Text color': 'Tekstin väri',
    });
    i18n.setLanguage(['fr', 'fr-FR'], {
        'Text color': 'Couleur du texte',
    });
    i18n.setLanguage(['gl', 'gl-ES'], {
        'Text color': 'Cor do texto',
    });
    i18n.setLanguage(['hr', 'hr-HR'], {
        'Text color': 'Boja teksta',
    });
    i18n.setLanguage(['it', 'it-IT'], {
        'Text color': 'Colore del testo',
    });
    i18n.setLanguage(['ja', 'ja-JP'], {
        'Text color': '文字色相',
    });
    i18n.setLanguage(['ko', 'ko-KR'], {
        'Text color': '글자 색상',
    });
    i18n.setLanguage(['nb', 'nb-NO'], {
        'Text color': 'Tekstfarge',
    });
    i18n.setLanguage(['nl', 'nl-NL'], {
        'Text color': 'Tekstkleur',
    });
    i18n.setLanguage(['pl', 'pl-PL'], {
        'Text color': 'Kolor tekstu',
    });
    i18n.setLanguage(['pt', 'pt-BR'], {
        'Text color': 'Cor do texto',
    });
    i18n.setLanguage(['ru', 'ru-RU'], {
        'Text color': 'Цвет текста',
    });
    i18n.setLanguage(['sv', 'sv-SE'], {
        'Text color': 'Textfärg',
    });
    i18n.setLanguage(['tr', 'tr-TR'], {
        'Text color': 'Metin rengi',
    });
    i18n.setLanguage(['uk', 'uk-UA'], {
        'Text color': 'Колір тексту',
    });
    i18n.setLanguage('zh-CN', {
        'Text color': '背景颜色',
    });
    i18n.setLanguage('zh-TW', {
        'Text color': '文字顏色',
    });
}

;// CONCATENATED MODULE: ./src/utils/dom.ts
function hasClass(element, className) {
    return element.classList.contains(className);
}
function findParentByClassName(el, className) {
    var currentEl = el;
    while (currentEl && !hasClass(currentEl, className)) {
        currentEl = currentEl.parentElement;
    }
    return currentEl;
}
function removeProseMirrorHackNodes(html) {
    var reProseMirrorImage = /<img class="ProseMirror-separator" alt="">/g;
    var reProseMirrorTrailingBreak = / class="ProseMirror-trailingBreak"/g;
    var resultHTML = html;
    resultHTML = resultHTML.replace(reProseMirrorImage, '');
    resultHTML = resultHTML.replace(reProseMirrorTrailingBreak, '');
    return resultHTML;
}

;// CONCATENATED MODULE: ./src/index.ts



var PREFIX = 'toastui-editor-';
function createApplyButton(text) {
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.textContent = text;
    return button;
}
function createToolbarItemOption(colorPickerContainer, i18n) {
    return {
        name: 'color',
        tooltip: '文本突出显示颜色',
        className: PREFIX + "toolbar-icons color ",//﹀
        el: document.createElement('button'),
        popup: {
            className: PREFIX + "popup-color",
            body: colorPickerContainer,
            style: { width: 'auto' },
        },
    };
}
function createSelection(tr, selection, SelectionClass, openTag, closeTag) {
    var mapping = tr.mapping, doc = tr.doc;
    var from = selection.from, to = selection.to, empty = selection.empty;
    var mappedFrom = mapping.map(from) + openTag.length;
    var mappedTo = mapping.map(to) - closeTag.length;
    return empty
        ? SelectionClass.create(doc, mappedTo, mappedTo)
        : SelectionClass.create(doc, mappedFrom, mappedTo);
}
function getCurrentEditorEl(colorPickerEl, containerClassName) {
    var editorDefaultEl = findParentByClassName(colorPickerEl, PREFIX + "defaultUI");
    return editorDefaultEl.querySelector("." + containerClassName + " .ProseMirror");
}
var containerClassName;
var currentEditorEl;
// @TODO: add custom syntax for plugin
/**
 * Color syntax plugin
 * @param {Object} context - plugin context for communicating with editor
 * @param {Object} options - options for plugin
 * @param {Array.<string>} [options.preset] - preset for color palette (ex: ['#181818', '#292929'])
 * @param {boolean} [options.useCustomSyntax=false] - whether use custom syntax or not
 */
function bgcolorSyntaxPlugin(context, options) {
    if (options === void 0) { options = {}; }
    var eventEmitter = context.eventEmitter,
        i18n = context.i18n,
        _a = context.usageStatistics,
        usageStatistics = _a === void 0 ? true : _a,
        pmState = context.pmState;
    var preset = options.preset;
    var container = document.createElement('div');
    var colorPickerOption = { container: container, usageStatistics: usageStatistics };

    if (preset) {
        colorPickerOption.preset = preset;
    }
    var colorPicker = external_commonjs_tui_color_picker_commonjs2_tui_color_picker_amd_tui_color_picker_root_tui_colorPicker_default().create(colorPickerOption);
    var button = createApplyButton(i18n.get('OK'));
    var containerClassName;
    var colorPickers = ''; // 初始化 colorPickers

    eventEmitter.listen('focus', function (editType) {
        containerClassName = `${PREFIX}${editType === 'markdown' ? 'md' : 'ww'}-container`;
    });

    colorPicker.slider.toggle(true);
    container.appendChild(button);
    var toolbarItem = createToolbarItemOption(container, i18n);
    toolbarItem.el.innerHTML = `
        <svg width="25" height="25" fill="none" viewBox="0 0 20 20" class="_pen20">
            <defs>
                <clipPath id="b9ef7a_0">
                    <rect width="20" height="20" rx="0"></rect>
                </clipPath>
            </defs>
            <g clip-path="url(#b9ef7a_0)">
                <path fill="currentColor" fill-opacity="0.94" d="M9.667 3.557a2.5 2.5 0 0 1 3.481-.614l1.639 1.147a2.5 2.5 0 0 1 .617 3.478l-3.526 5.275a.499.499 0 0 1-.142.14l-2.253 1.474a.5.5 0 0 1-.552-.003L8.548 15H3.772l1.891-2.834-.017-.012a.5.5 0 0 1-.2-.524l.615-2.62a.5.5 0 0 1 .071-.165l3.529-5.279.006-.009Zm.822.57L7.513 8.579l4.096 2.867L14.582 7a1.5 1.5 0 0 0-.369-2.09l-1.638-1.147a1.5 1.5 0 0 0-2.086.365Zm-3.992 7.402 2.722 1.906 1.802-1.18L6.99 9.433l-.492 2.097Z"></path>
                <path fill="${colorPickers}" d="M17 19H3a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2"></path>
                <path fill="currentColor" fill-opacity="0.14" d="M17 19.5q.621 0 1.06-.44.44-.439.44-1.06t-.44-1.06q-.439-.44-1.06-.44H3q-.621 0-1.06.44-.44.439-.44 1.06t.44 1.06q.439.44 1.06.44h14Zm0-.5H3a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2Z"></path>
            </g>
        </svg>
    `;
    toolbarItem.el.style.background = 'none';
    container.addEventListener('click', function (ev) {
        if (ev.target.getAttribute('type') === 'button') {
            var selectedColor = colorPicker.getColor();
            colorPickers = selectedColor; // 更新 colorPickers 值
            toolbarItem.el.innerHTML = `
            <svg width="25" height="25" fill="none" viewBox="0 0 20 20" class="_pen20">
                <defs>
                    <clipPath id="b9ef7a_0">
                        <rect width="20" height="20" rx="0"></rect>
                    </clipPath>
                </defs>
                <g clip-path="url(#b9ef7a_0)">
                    <path fill="currentColor" fill-opacity="0.94" d="M9.667 3.557a2.5 2.5 0 0 1 3.481-.614l1.639 1.147a2.5 2.5 0 0 1 .617 3.478l-3.526 5.275a.499.499 0 0 1-.142.14l-2.253 1.474a.5.5 0 0 1-.552-.003L8.548 15H3.772l1.891-2.834-.017-.012a.5.5 0 0 1-.2-.524l.615-2.62a.5.5 0 0 1 .071-.165l3.529-5.279.006-.009Zm.822.57L7.513 8.579l4.096 2.867L14.582 7a1.5 1.5 0 0 0-.369-2.09l-1.638-1.147a1.5 1.5 0 0 0-2.086.365Zm-3.992 7.402 2.722 1.906 1.802-1.18L6.99 9.433l-.492 2.097Z"></path>
                    <path fill="${colorPickers}" d="M17 19H3a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2"></path>
                    <path fill="currentColor" fill-opacity="0.14" d="M17 19.5q.621 0 1.06-.44.44-.439.44-1.06t-.44-1.06q-.439-.44-1.06-.44H3q-.621 0-1.06.44-.44.439-.44 1.06t.44 1.06q.439.44 1.06.44h14Zm0-.5H3a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2Z"></path>
                </g>
            </svg>
            `;
            var currentEditorEl = getCurrentEditorEl(container, containerClassName);
            eventEmitter.emit('command', 'bgcolor', { selectedColor: selectedColor });
            eventEmitter.emit('closePopup');
            currentEditorEl.focus();
        }
    });
    return {
        wysiwygCommands: {
            bgcolor: function (_a, _b, dispatch) {
                var selectedColor = _a.selectedColor;
                var tr = _b.tr, selection = _b.selection, schema = _b.schema;
                console.log(colorPickers, 'selectedColor'); // 输出 colorPickers 的值
                if (selectedColor) {
                    var from = selection.from, to = selection.to;
                    var attrs = { htmlAttrs: { style: `background-color: ${selectedColor}` } };
                    var mark = schema.marks.span.create(attrs);
                    tr.addMark(from, to, mark);
                    dispatch(tr);
                    return true;
                }
                return false;
            },
        },
        toolbarItems: [
            {
                groupIndex: 1,
                itemIndex: 4,
                item: toolbarItem,
            },
        ],
        toHTMLRenderers: {
            htmlInline: {
                span: function (node, _a) {
                    var entering = _a.entering;
                    return entering
                        ? { type: 'openTag', tagName: 'span', attributes: node.attrs }
                        : { type: 'closeTag', tagName: 'span' };
                },
            },
        },
    };
}

function createApplyButton(label) {
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.className = 'te-ok-button';
    button.innerHTML = label;
    return button;
}



// function getCurrentEditorEl(container, containerClassName) {
//     return container.closest(`.${containerClassName}`);
// }



}();
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});