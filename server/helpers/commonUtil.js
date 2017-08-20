/**
 * Created by Hades on 14/10/10.
 */

var utils = {

  /**
   * 从请求里面获取 参数的json格式
   *
   * @param {*} obj
   * @return {Boolean}
   */
  getJson: function (req, params) {
    var body = req.query
    if (body && Object.keys(body).length === 0) {
      body = req.body
    }
    var json = {}
    params.forEach(function (key) {
      if (body && body[key] || body && body[key] === 0) {
        json[key] = body[key]
      }
    })
    return json
  },

  /**
   * 从json中获取部分字段
   *
   * @param {*} obj
   * @return {Boolean}
   */
  filterJson: function (json, params) {
    var result = {}
    params.forEach(function (key) {
      if (json && json[key] || json && json[key] === 0) {
        result[key] = json[key]
      }
    })
    return result
  },

  getJsonLength: function(obj){
    var size = 0
    var key
    for (key in obj) {
      if (obj.hasOwnProperty(key)){
      size++;
      }
    }
    return size
  },

  /**
   * 是否是字符串
   *
   * @param {*} obj
   * @return {Boolean}
   */
  isString: function (str) {
    return typeof (str) === 'string'
  },

  /**
   * 是否是布尔值
   *
   * @param {*} obj
   * @return {Boolean}
   */
  isBoolean: function (bool) {
    return typeof (bool) === 'boolean'
  },

  /**
   * 是否是数字
   *
   * @param {*} obj
   * @return {Boolean}
   */
  isNumber: function (num) {
    return typeof (num) === 'number' && !isNaN(num)
  },

  /**
   * 是否函数
   *
   * @param {*} obj
   * @return {Boolean}
   */
  isFunc: function (fn) {
    return fn instanceof Function
  },

  /**
   * 是否Generator函数
   *
   * @param {*} function
   * @return {Boolean}
   */
  isGenerator: function (func) {
    return typeof (func === 'function') && (func.constructor.name === 'GeneratorFunction')
  },

  /**
   * 是否数组
   *
   * @param {*} obj
   * @return {Boolean}
   */
  isArray: function (obj) {
    return Array.isArray(obj)
  },

  /**
   * 是否对象
   * for plain JavaScript objects.
   *
   * @param {*} obj
   * @return {Boolean}
   */
  isObject: function (o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  },

  /**
   * 设置不可枚举的类属性
   *
   * @param {Object} obj
   * @param {String} key
   * @param {*} val
   */
  defineProperty: function (obj, key, val) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: false,
      writable: true,
      configurable: true
    })
  },

  timeIfNull70: function (t) {
    if (!t) {
      var r = new Date(0)
      return r
    } else {
      var r = new Date(t)
      r.setHours(r.getHours() + 8)
      return r
    }
  },
  getScanTime:function(){
    var r = new Date()
    r.setHours(r.getHours() + 8)
    return r
  },
  timeIfNull00: function (t) {
    if (!t) {
      var r = new Date()
      r.setHours(8)
      r.setMinutes(0)
      r.setSeconds(0)
      r.setMilliseconds(0)
      return r
    } else {
      var r = new Date(t)
      r.setHours(r.getHours() + 8)
      return r
    }
  },

  timeIfNullNow: function (t) {
    var r
    if (!t) {
      r = new Date()
    } else {
      r = new Date(t)
    }
    r.setHours(r.getHours() + 8)
    return r
  },

  getDelayDate: function (t) {
      var r = new Date(t)
      r.setDate(r.getDate()+ 10)
      r.setHours(r.getHours() + 8)
      return r
  },
  /*1.用正则表达式实现html转码*/
  htmlEncodeByRegExp: function (str) {
    var s = ''
    if (str.length == 0) return ''
    s = str.replace(/&/g, '&amp;')
    s = s.replace(/</g, '&lt;')
    s = s.replace(/>/g, '&gt;')
    s = s.replace(/ /g, '　')
    s = s.replace(/\'/g, '&#39;')
    s = s.replace(/\"/g, '&quot;')
    return s
  },
  /*2.用正则表达式实现html解码*/
  htmlDecodeByRegExp: function (str) {
    var s = ''
    if (str.length == 0) return ''
    s = str.replace(/&amp;/g, '&')
    s = s.replace(/&lt;/g, '<')
    s = s.replace(/&gt;/g, '>')
    s = s.replace(/　/g, ' ')
    s = s.replace(/&#39;/g, "'")
    s = s.replace(/&quot;/g, '"')
    return s
  },
  format(date, fmt) {
    if (!date) {
      date = new Date()
    }
    var o = {
      'M+': date.getMonth() + 1, // 月份 
      'd+': date.getDate(), // 日 
      'h+': date.getHours(), // 小时 
      'm+': date.getMinutes(), // 分 
      's+': date.getSeconds(), // 秒 
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度 
      'S': date.getMilliseconds() // 毫秒 
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return fmt
  },
  getDateSequence(t){
    var fmt = 'yyyyMMdd' 
    var date =new Date()
    console.log('date',date)
    if (t === 'start') {
      date = new Date()
    } else if( t === 'end'){
      date.setDate(date.getDate()+30)
    }else {
      date = new Date(t)
    }
    var o = {
      'M+': date.getMonth() + 1, // 月份 
      'd+': date.getDate(), // 日 
      'h+': date.getHours(), // 小时 
      'm+': date.getMinutes(), // 分 
      's+': date.getSeconds(), // 秒 
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度 
      'S': date.getMilliseconds() // 毫秒 
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    return parseInt(fmt)
  },
  compareTime(controlHour,controlMinute){
   var date = new Date()
   var date1 =new Date()
   date1.setHours(parseInt(controlHour))
   date1.setMinutes(parseInt(controlMinute))
     if(date1>date){
      return false
     }else{
      return true
     }
  },
  conversionStartTime(time){
    var val = Date.parse(time)
    time = new Date(val)
    time.setHours(time.getHours() - 8)
    return time
  },
  conversionEndTime(time){
    var val = Date.parse(time)
    time = new Date(val)
    time.setHours(time.getHours() + 16)
    return time
  }

}

module.exports = utils
