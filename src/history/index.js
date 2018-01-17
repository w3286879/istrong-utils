import * as history from 'history'

var hashHistory
const listerners = {},
    _options = {} //{isAlias:()=>{}, toAlias:()=>{}, toRealName:()=>{}}

function setHistoryInstance() {
    if (!hashHistory)
        hashHistory = history.createHashHistory()
}

function config(options) {
    Object.assign(_options, options)
}

// 获得路径别名
function getAlias(pathName) {
    if (!_options.isAlias || !_options.toAlias || _options.isAlias(pathName))
        return pathName
    return _options.toAlias(pathName)
}

// 获得路径真名
function getRealName(pathName) {
    if (!_options.isAlias || !_options.toRealName || !_options.isAlias(pathName))
        return pathName
    return _options.toRealName(pathName)
}

// 监听APP
function listen(selfApp, handler) {
    setHistoryInstance()
    if (!listerners[selfApp]) {
        listerners[selfApp] = []
    }

    var h = listerners[selfApp].find(o => o.listen == handler)
    if (!h) {

        h = handler
        var unlisten = hashHistory.listen((location, action) => {
            const childApp = getChildApp(selfApp)
            handler(childApp, location, action)
        })

        listerners[selfApp].push({
            listen: h,
            unlisten
        })
    }
}

// 关闭监听
function unlisten(selfApp, handler) {
    if (!listerners[selfApp])
        return

    const index = listerners[selfApp].findIndex(o => o.listen == handler)

    if (index == -1)
        return

    listerners[selfApp][index].unlisten()
    listerners[selfApp].splice(index, 1)
}

// 获得所有的子App
function getChildApp(selfApp) {
    setHistoryInstance()
    var pathName = hashHistory.location.pathname + hashHistory.location.search
    pathName = getRealName(pathName)
    if (!pathName || pathName == '/' || pathName.indexOf(selfApp) == -1)
        return

    const segs = pathName.split('/')

    const selfIndex = segs.findIndex(s => s.indexOf(selfApp) != -1)

    if (segs.length - 1 == selfIndex)
        return

    const ret = segs[selfIndex + 1]

    return ret == '/' ? undefined : ret
}

// 新增App
function pushChildApp(selfApp, childApp) {
    setHistoryInstance()
    var pathName = hashHistory.location.pathname
    pathName = getRealName(pathName)
    if (!pathName || pathName == '/' || pathName.indexOf(selfApp) == -1) {
        hashHistory.push(getAlias(`/${selfApp}/${childApp}`))
        return
    }

    const segs = pathName.split('/')

    const selfIndex = segs.findIndex(s => s.indexOf(selfApp) != -1)

    if (segs.length - 1 == selfIndex) {
        segs.push(childApp)
    }
    else {
        segs.splice(selfIndex + 1, segs.length - selfIndex, childApp)
        //segs[selfIndex + 1] = childApp
    }

    if (pathName == segs.join('/'))
        return

    hashHistory.push(getAlias(segs.join('/')))
}


export default {
    config,
    listen,
    unlisten,
    getChildApp,
    pushChildApp,
    location: hashHistory ? hashHistory.location : null
}