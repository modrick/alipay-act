'use strict'
var commonUtil = require('../helpers/commonUtil')
var generateId = require('../helpers/generateId')
var BaseService = require('../service/baseService')
var mongodbDao = require('../storage/mongodbDao').getWorkInstance()
var crypto = require('crypto')
var Promise = require('bluebird')
var _ = require('lodash')
var immediateRate = 50
var alipay_f2f = require('../alipay/alipay_f2f')

class OrderService extends BaseService {

  * payOrder (json, ipStr) {
    var appStr = yield alipay_f2f.getAppStr({
      app_id: '',
      seller_id: '',
      out_trade_no: json.orderId,
      subject: 'alipay-pay',
      total_amount: parseInt(json.cash) / 100
    })
    return {
      code: 100,
      orderId: order.orderId,
      data: appStr
    }
  }

}
module.exports = new OrderService('Order')
