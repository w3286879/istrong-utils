// 去除左侧空格
function trimLeft(str) {
    return str.replace(/(^\s*)/g, "")
}

// 去除右侧空格
function trimRight(str) {
    return str.replace(/(\s*$)/g, "")
}

// 去除空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}

// str 转换成 Json
function toJson(str) {
    return (new Function("return " + str))()
}

export default {
    trimLeft,
    trimRight,
    trim,
    toJson
}