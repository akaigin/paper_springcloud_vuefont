import timeago from 'timeago.js'
/**
 * 获取子项的类型信息
 * @method getTabInfo
 * @param  {string}   tab       类型
 * @param  {boolean}   good     是否是精品
 * @param  {boolean}   top      是否置顶
 * @param  {boolean}   isClass 是否返回样式名
 * @return {String}             [description]
 */
export function getTabInfo (tab, good, top, isClass) {
  let className = ''
  let type = ''

  if (top) {
    type = '置顶'
    className = 'top'
  } else if (good) {
    type = '精品'
    className = 'good'
  } else {
    switch (tab) {
      case 'top':
        type = '置顶'
        className = 'top'
        break
      case 'good':
        type = '精品'
        className = 'good'
        break
      case 'share':
        type = '分享'
        className = 'share'
        break
      case 'ask':
        type = '问答'
        className = 'ask'
        break
      case 'job':
        type = '招聘'
        className = 'job'
        break
      case 'all':
        type = '全部'
        className = 'all'
        break
      case 'dev':
        type = '测试'
        className = 'all'
        break
      default:
        type = '暂无'
        className = 'none'
    }
  }

  return isClass ? className : type
}

/**
 * 返回传入时间距离现在的人性化时间提示
 * @method timeAgo
 * @param  {String} date 时间字符串
 * @return {String}      时间提示
 */
function timeAgo (date) {
  let timeAgo = timeago()
  return timeAgo.format(date, 'zh_CN')
}

// 需加自己解析出特定格式的时间
function resolveDate (date) {

}

/**
 * 格式化时间
 * @method formatDate
 * @param  {String}   date      时间字符串
 * @param  {Boolean}  humanity  是否返回人性化提示
 * @return {String}             格式化后的展示
 */
export function formatDate (date, humanity) {
  if (humanity) {
    return timeAgo(date)
  } else {
    resolveDate(date)
  }
}

/**
 * 节流函数
 * @method throttle
 * @param  {Function} fn      待执行的函数
 * @param  {Number}   delay   延时
 * @param  {Number}   atleast 最小执行间隔
 * @return {[type]}           [description]
 */
export function throttle (fn, delay, atleast) {
  let timer = null
  let startTime = new Date()

  return function () {
    let context = this
    let args = arguments
    let curTime = new Date()

    clearTimeout(timer)
    if (curTime - startTime >= atleast) {
      fn.apply(context, args)   // apply 指定函数指向的 上下文(this) 和 参数列表
      startTime = curTime
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args)
        startTime = curTime
      }, delay)
    }
  }
}

/**
 * 按一定比率回到顶部
 * @method scrollToTop
 * @param  {DOM}    scrollDom 滚动的元素
 * @param  {Number}    scale     时间间隔
 * @param  {Number}    time      比率
 * @return {Null}              未指定返回值
 */
export function scrollToTop (scrollDom, scale, time) {
  // 每次向顶部滚动 1/5 直至小于10
  let scrolling = setInterval(() => {
    let curScrollTop = scrollDom.scrollTop
    if (curScrollTop < 10) {
      curScrollTop *= scale
    }

    if (curScrollTop < 1) {
      clearInterval(scrolling)
    }

    scrollDom.scrollTop -= curScrollTop / scale
  }, time)
}
