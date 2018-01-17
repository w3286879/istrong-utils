import jdf from 'jsondiffpatch/src/diffpatcher'
import jdfHtml from 'jsondiffpatch/src/formatters/html'
import 'jsondiffpatch/public/formatters-styles/html.css'

// 对比json 差异
function diff(oldJson, newJson) {
    return new jdf.DiffPatcher().diff(oldJson, newJson)
}

// 展示成HTML数据
function diffHtml(oldJson, newJson) {
    var delta = diff(oldJson, newJson)
    return jdfHtml.format(delta, oldJson)
}

export default {
    diff,
    diffHtml
}