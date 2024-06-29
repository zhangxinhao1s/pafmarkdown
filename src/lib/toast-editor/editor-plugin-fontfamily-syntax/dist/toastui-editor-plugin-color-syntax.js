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
  "default": function() { return /* binding */ fontfamilyPlugin; }
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
        'Text color': '文字颜色',
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
        tooltip: i18n.get('Text color'),
        className: PREFIX + "toolbar-icons color",
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
function fontfamilyPlugin(context, options) {
    if (options === void 0) { options = {}; }

    var eventEmitter = context.eventEmitter,
        i18n = context.i18n,
        pmState = context.pmState;

    var container = document.createElement('div');
    container.style.display = 'flex';
    container.style.height = '30px';
    container.style.marginTop = '7px';
    container.style.backgroundColor = '#f1f2f2';
    container.style.alignItems = 'center';

    var fontList = document.createElement('ul');
    var fonts = ['宋体', '微软雅黑', '华文宋体', '黑体', 'Arial'];
    fontList.style.position = 'absolute';
    fontList.className = 'toastui-editor-popup-fontStyle';
    fontList.style.top = '39px';
    fontList.style.left = '24px';
    fontList.style.display = 'none';
    fontList.style.backgroundColor = '#fff';
    fontList.style.zIndex = '1000';
    fontList.style.margin = '0';
    fontList.style.listStyle = 'none';

    fonts.forEach(function (font) {
        var listItem = document.createElement('li');
        listItem.textContent = font;
        listItem.style.cursor = 'pointer';
        listItem.style.padding = '5px';
        listItem.addEventListener('click', function () {
            input.value = font;
            eventEmitter.emit('command', 'fontStyle', { selectedFont: font });
            eventEmitter.emit('closePopup');
            fontList.style.display = 'none';
        });
        fontList.appendChild(listItem);
    });

    container.appendChild(fontList);

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Font');
    input.style.width = '58px';
    input.disabled = true;

    var dropdownButton = document.createElement('button');
    dropdownButton.setAttribute('type', 'button');
    dropdownButton.textContent = '▼';
    dropdownButton.style.cursor = 'pointer';
    dropdownButton.addEventListener('focus', function () {
        fontList.style.display = 'block';
    });

    dropdownButton.addEventListener('blur', function () {
        setTimeout(function () {
            fontList.style.display = 'none';
        }, 200);
    });

    dropdownButton.addEventListener('click', function () {
        fontList.style.display = fontList.style.display === 'none' ? 'block' : 'none';
    });

    container.appendChild(input);
    container.appendChild(dropdownButton);

    function applyFontStyle(font) {
        var currentEditorEl = getCurrentEditorEl(container, containerClassName);
        console.log('Current editor element:', currentEditorEl);

        var tr = pmState.tr;
        var selection = pmState.selection;

        if (!selection || selection.empty) {
            console.error('No selection found or selection is empty.');
            return;
        }

        var from = selection.from, to = selection.to;
        var attrs = {};

        tr.doc.nodesBetween(from, to, function (node, pos) {
            if (node.marks) {
                node.marks.forEach(function (mark) {
                    if (mark.type.name === 'span' && mark.attrs.htmlAttrs && mark.attrs.htmlAttrs.style) {
                        var styles = mark.attrs.htmlAttrs.style.split(';').filter(Boolean);
                        styles.forEach(function (style) {
                            var [key, value] = style.split(':').map(function (part) { return part.trim(); });
                            if (key !== 'font-family') {
                                attrs[key] = value;
                            }
                        });
                    }
                });
            }
        });

        attrs['font-family'] = font;

        var styleStr = Object.entries(attrs).map(function ([key, value]) {
            return key + ": " + value;
        }).join('; ');

        var markAttrs = { htmlAttrs: { style: styleStr } };
        var newMark = pmState.schema.marks.span.create(markAttrs);
        tr.addMark(from, to, newMark);

        currentEditorEl.focus();
        pmState.apply(tr);
    }

    var toolbarItem = {
        name: 'fontStyle',
        tooltip: '默认',
        el: container,
    };

    return {
        wysiwygCommands: {
            fontStyle: function (_a, _b, dispatch) {
                var selectedFont = _a.selectedFont;
                var tr = _b.tr, selection = _b.selection, schema = _b.schema;

                if (selectedFont && selection && !selection.empty) {
                    var attrs = {};

                    tr.doc.nodesBetween(selection.from, selection.to, function (node) {
                        if (node.marks) {
                            node.marks.forEach(function (mark) {
                                if (mark.type.name === 'span' && mark.attrs.htmlAttrs && mark.attrs.htmlAttrs.style) {
                                    var styles = mark.attrs.htmlAttrs.style.split(';').filter(Boolean);
                                    styles.forEach(function (style) {
                                        var [key, value] = style.split(':').map(function (part) { return part.trim(); });
                                        if (key !== 'font-family') {
                                            attrs[key] = value;
                                        }
                                    });
                                }
                            });
                        }
                    });

                    attrs['font-family'] = selectedFont;

                    var styleStr = Object.entries(attrs).map(function ([key, value]) {
                        return key + ": " + value;
                    }).join('; ');

                    var markAttrs = { htmlAttrs: { style: styleStr } };
                    var newMark = schema.marks.span.create(markAttrs);
                    tr.addMark(selection.from, selection.to, newMark);
                    dispatch(tr);
                    return true;
                }

                return false;
            },
        },

        toolbarItems: [
            {
                groupIndex: 0,
                itemIndex:0,
                item: toolbarItem,
            },
        ],
    };
}



}();
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});