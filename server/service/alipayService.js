'use strict'
var request = require('request')
// var xml2js = require('xml2js')
var qr = require('qr-image')
var weixinService = require('../service/weixinService')
var BaseService = require('../service/baseService')
var xml2json = require('xml2json')
var commonUtil = require('../helpers/commonUtil')
var generateId = require('../helpers/generateId')
var shopService = require('../service/shopService')
var orderService = require('../service/orderService')
var userService = require('../service/userService')
var dailyAccountService = require('../service/dailyAccountService')

// var mongodbDao = require('../storage/mongodbDao').getWorkInstance()
var alipay_f2f = require('../alipay/alipay_f2f')
class AlipayService extends BaseService {
  * aliAppStr (json) {
    // 必填参数//
    console.info('aliAppStr:', json)

    let cash = parseInt(json.cash)
    json.orderId = yield * generateId.createOrderId('xg')
    let data = yield alipay_f2f.getAppStr({
      out_trade_no: json.orderId,
      subject: 'xiegou-pay',
      total_amount: cash / 100
    })
    return data
  }

  * alipayGateway (json) {
    var signStatus = alipay_f2f.verifyCallback(json, 0)
    if (signStatus === false) {
      return {
        code: 101
      }
    }

    return {
      code: 100
    }
  }

  * alipayNotify (json) {
    console.info('alipay notify body: ', json)
    var signStatus = alipay_f2f.verifyCallback(json, 1)
    if (signStatus === false) {
      console.error('Failed to verify return info from alipay!!!!!!!')
      return {
        code: 101,
        data: 'Failed to verify'
      }
    }

    return {
      code: 100
    }
  }

}

module.exports = new AlipayService('Pay')
