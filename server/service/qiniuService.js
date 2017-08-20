'use strict'
var qiniu = require('qiniu')
qiniu.conf.ACCESS_KEY = ''
qiniu.conf.SECRET_KEY = ''
var uptoken = new qiniu.rs.PutPolicy('sign')

class QiniuService {

  // 获取上传token
  getUpToken (res) {
    var token = uptoken.token()
    res.header('Cache-Control', 'max-age=0, private, must-revalidate')
    res.header('Pragma', 'no-cache')
    res.header('Expires', 0)
    if (token) {
      return {
        uptoken: token
      }
    }
  }

  // 获取下载token
  getDownToken (req, res) {
    var key = req.body.key
    var domain = req.body.domain
    // trim 'http://'
    if (domain.indexOf('http://') !== -1) {
      domain = domain.substr(7)
    }
    // trim 'https://'
    if (domain.indexOf('https://') !== -1) {
      domain = domain.substr(8)
    }
    // trim '/' if the domain's last char is '/'
    if (domain.lastIndexOf('/') === domain.length - 1) {
      domain = domain.substr(0, domain.length - 1)
    }
    var baseUrl = qiniu.rs.makeBaseUrl(domain, key)
    var deadline = 3600 + Math.floor(Date.now() / 1000)
    baseUrl += '?e=' + deadline
    var signature = qiniu.util.hmacSha1(baseUrl, qiniu.conf.SECRET_KEY)
    var encodedSign = qiniu.util.base64ToUrlSafe(signature)
    var downloadToken = qiniu.conf.ACCESS_KEY + ':' + encodedSign

    if (downloadToken) {
      res.json({
        downtoken: downloadToken,
        url: baseUrl + '&token=' + downloadToken
      })
    }
  }
}

module.exports = new QiniuService()
