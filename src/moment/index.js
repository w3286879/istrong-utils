import moment from 'moment'

// 将时间传入转换成moment对象输出
function stringToMoment(v) {
    if (!v)
        return v
    return moment(new Date(v))
}

// 格式化输出时间
function momentToString(v, format) {
    if (!v)
        return v
    return moment(v).format(format)
}

// 获得本周的日期格式
function getThisWeekRange(format = 'YYYY-MM-DD') {
    return [
        moment().startOf('week').format(format),
        moment().endOf('week').format(format)
    ]
}

// 获得上周的日期格式
function getLastWeekRange(format = 'YYYY-MM-DD') {
    return [
        moment().subtract(1, 'week').startOf('week').format(format),
        moment().subtract(1, 'week').endOf('week').format(format)
    ]
}

// 获得本月的日期格式
function getThisMonthRange(format = 'YYYY-MM-DD') {
    return [
        moment().startOf('month').format(format),
        moment().endOf('month').format(format),
    ]
}

// 获得上月的日期格式
function getLastMonthRange(format = 'YYYY-MM-DD'){
    return [
        moment().subtract(1, 'month').startOf('month').format(format),
        moment().subtract(1, 'month').endOf('month').format(format),
    ]
}

// 获得本年的日期格式
function getThisYearRange(format = 'YYYY-MM-DD'){
    return [
        moment().startOf('year').format(format),
        moment().endOf('year').format(format),
    ]
}

// 获得去年的日期格式
function getLastYearRange(format = 'YYYY-MM-DD'){
    return [
        moment().subtract(1, 'year').startOf('year').format(format),
        moment().subtract(1, 'year').endOf('year').format(format),
    ]
}

export default {
    stringToMoment,
    momentToString,
    getThisWeekRange,
    getLastWeekRange,
    getThisMonthRange,
    getLastMonthRange,
    getThisYearRange,
    getLastYearRange
}