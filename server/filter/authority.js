/**
 * Created by tangnian on 14/11/19.
 * terminalType 0: PC; 1: mobile
 * sourceType 0: mobile browser; 1:mobile APP
 */
'use strict'
var redisDao = require('../storage/redisDao')
// 映射模型
var checkurls = new Map()
// 哪些url不需要验证
checkurls.set('/user/forgetPassword', true)
checkurls.set('/user/register', true)
checkurls.set('/logout', true)
checkurls.set('/login', true)
checkurls.set('/qiniu/getToken', true)
checkurls.set('/qiniu/getDownToken', true)
var terminal = ['Macintosh', 'Windows', 'iPhone', 'Linux']
var source = 'Html5Plus/1.0'

var filter = {
  setCrossDomain: function (req, res, next) {
    res.append('Access-Control-Allow-Origin', '*')
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.append('Access-Control-Allow-Credentials', 'true')
    res.append('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE')
    res.append('X-Powered-By', '3.2.1')
    res.append('Content-Type', 'application/json;charset=utf-8')
    next()
  },

  // 验证登陆权限
  check: function * (req, res, next) {
    var path = req.path
    // 请求的地址如果不在URLS里面，则表示需要验证权限，不然就直接通过；
    if (!checkurls.get(path)) {
      var sessionId = req.sessionID
      var userInfo = yield redisDao.hgetall(sessionId)

      if (!userInfo) {
        // 未登录权限
        logger.error('用户没有登录')
        return res.json({
          code: 200
        })
      } else {
        // 用户ID注入
        req.userId = userInfo.userId
        req.userName = userInfo.userName
        next()
      }
    } else {
      next()
    }
  },

  // 访问信息来源
  getVisitInfo: function (req, res, next) {
    var agent = req.header('user-agent')
    var lowerAgent = ''
    // 0:PC,1:移动
    var terminalType = 1
    if (agent) {
      for (var i = 0; i < 2; i++) {
        if (agent.indexOf(terminal[i]) > -1) {
          terminalType = 0
          break
        }
      }
      if (agent.indexOf(source) > -1) {
        req.sourceType = 1
      } else {
        req.sourceType = 0
      }
      // 判断是否在微信中打开 START
      lowerAgent = agent.toLowerCase()
      if (/micromessenger/.test(lowerAgent)) {
        req.weiXin = 1
      } else {
        req.weiXin = 0
      }
    // 判断是否在微信中打开 END
    }
    req.terminalType = terminalType
    next()
  }

}

module.exports = filter
