import beautify from 'js-beautify'

// 美化JS代码,前面4个空格间距,有时候用于展示和调试方便
function beautifyJS(str){
    return beautify.js_beautify(str, {indent_size: 4})
}

// 美化CSS格式,前面4个空格间距,有时候用于展示和调试方便
function beautifyCSS(str) {
    return beautify.css_beautify(str, { indent_size: 4 })
}

export default {
    beautifyJS,
    beautifyCSS
}