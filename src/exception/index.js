const exceptions = []

// 异常错误列表报错
function error(err){
    console.error(err)
    // unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
    exceptions.unshift(err)
}

// 清空错误列表
function clear(){
    exceptions.splice(0, exceptions.length)
}

// 获取所有报错数据
function getExceptions(){
    return exceptions
}


export default {
   error,
   clear,
   getExceptions
}