












'use strict'
const aop = require('./aop.js')
var baseUrl = ''

class Alipay_f2f {

  init (config) {
    this._config = {}
    this._config['appid'] = ''
    baseUrl = config.baseUrl
    // 支付宝回调地址
    this._config['notifyUrl'] = config.baseUrl + '/alipay/paymentCallback'
    this._config['returnUrl'] = config.baseUrl + '/sqbpay/alipay/return'

    console.info('notifyUrl:', this._config['notifyUrl'])
    console.info('returnUrl:', this._config['returnUrl'])

        /* 默认为沙盒 详见 https://openhome.alipay.com/platform/appDaily.htm */
    this._config['gatewayUrl'] = 'https://openapi.alipay.com/gateway.do'
    this._config['mapiUrl'] = 'https://mapi.alipay.com/gateway.do'
    // 实际上线时候
    if(config.baseUrl === 'https://www.xgou168.com/web/1.0') {
          this._config['appid'] = '2016081801768485'
          this._config['merchantPrivateKey'] = `-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----`
          this._config['merchantPublicKey'] =
`-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----`
          this._config['alipayPublicKey'] =
`-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----`

    } else { // 测试账号
      this._config['appid'] = '2017032206342146'
      this._config['merchantPrivateKey'] = `-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----`
      this._config['merchantPublicKey'] =
`-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----`
      this._config['alipayPublicKey'] =
`-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----`
    }
  }

  /**
      * 校验通知签名
      * @param  {string} postData  支付宝post过的来数据
      * @return {bool}             是否通过校验
      */
  verifyCallback (postData, type) {
    return aop.notifyVerify(postData, this._config, type)
  }

   /**
    * 检测订单状况
    * @param  {string} tradeNo 订单号
    * @return {Promise}
    */
  checkInvoiceStatus (tradeNo) {
    return new Promise((resolve, reject) => {
      if (tradeNo === '' || tradeNo === null || tradeNo === undefined) {
        return reject({ message: '订单号不能为空.', info: null })
      }
      aop.execute('alipay.trade.query', this._config, {
        out_trade_no: tradeNo
      }).then(resolve).catch(reject)
    })
  }

    /**
     * 创建二维码订单
     * @param {Object} option 支付参数
     *        必填 tradeNo(String)              商户网站订单系统中唯一订单号，64个字符以内，只能包含字母、数字、下划线需保证商户系统端不能重复，建议通过数据库sequence生成.
     *        必填 subject(String)              订单标题，粗略描述用户的支付目的。如“xxx品牌xxx门店当面付扫码消费”
     *        必填 totalAmount(Double)          订单总金额，整形，此处单位为元，精确到小数点后2位，不能超过1亿元
     *        可填 body(String)                 订单描述，可以对交易或商品进行一个详细地描述，比如填写"购买商品2件共15.00元"
     *        可填 timeExpress(Int)             支付超时，线下扫码交易定义为5分钟
     * @return {Promise}
     */
  createQRPay (option) {
    return new Promise((resolve, reject) => {
      var tradeNo = option['tradeNo'] || ''
      var subject = option['subject'] || ''
      var body = option['body'] || ''
      var totalAmount = option['totalAmount'] || ''
      var timeExpress = option['timeExpress'] || 5
      if (tradeNo === '') {
        return reject({
          message: 'tradeNo 参数不能为空.', info: null
        })
      }
      if (subject === '') {
        return reject({
          message: 'subject 参数不能为空.', info: null
        })
      }
      if (totalAmount === '') {
        return reject({
          message: 'totalAmount 参数为空.', info: null
        })
      }
      totalAmount = parseFloat(totalAmount)
      if (isNaN(totalAmount)) {
        return reject({
          message: 'totalAmount 参数非法.', info: null
        })
      }
      if (timeExpress === '') {
        return reject({
          message: 'timeExpress 参数为空.', info: null
        })
      }
      timeExpress = parseInt(timeExpress)
      if (isNaN(timeExpress)) {
        return reject({
          message: 'timeExpress 参数非法.', info: null
        })
      }
      timeExpress = timeExpress + 'm'
      var alipayArrayData = {}
      alipayArrayData['subject'] = subject
      alipayArrayData['out_trade_no'] = tradeNo
      alipayArrayData['total_amount'] = totalAmount
      alipayArrayData['timeout_express'] = timeExpress
      aop.execute('alipay.trade.precreate', this._config, alipayArrayData).then(resolve).catch(reject)
    })
  }

  aliScanPay (option) {
    return new Promise((resolve, reject) => {
      var out_trade_no = option['out_trade_no'] || ''
      var subject = option['subject'] || ''
      var auth_code = option['auth_code'] || ''
      var store_id = option['store_id'] || ''
      var seller_id = option['seller_id'] || ''
      var body = option['body'] || ''
      var total_amount = option['total_amount'] || ''
      var timeout_express = option['timeout_express'] || 50

      timeout_express = timeout_express + 'm'
      var alipayArray = {}
      alipayArray['subject'] = subject
      alipayArray['out_trade_no'] = out_trade_no
      alipayArray['auth_code'] = auth_code
      alipayArray['store_id'] = store_id
      alipayArray['seller_id'] = seller_id
      alipayArray['total_amount'] = total_amount
      alipayArray['timeout_express'] = timeout_express
      alipayArray['scene'] = 'bar_code'  // 当面付特有的
      aop.execute('alipay.trade.pay', this._config, alipayArray).then(resolve).catch(reject)
    })
  }
  aliAuthcode (option) {
    return new Promise((resolve, reject) => {
      var grant_type = option['grant_type'] || ''
      var code = option['code'] || ''
      var alipayArray = {}
      alipayArray['grant_type'] = grant_type
      alipayArray['code'] = code
      aop.execute('alipay.open.auth.token.app', this._config, alipayArray).then(resolve).catch(reject)
    })
  }
  aliScanQuery (option) {
    return new Promise((resolve, reject) => {
      var out_trade_no = option['out_trade_no']
      var trade_no = option['trade_no']

      var alipayArray = {}
      if (out_trade_no) {
        alipayArray['out_trade_no'] = out_trade_no
      }
      if (trade_no) {
        alipayArray['trade_no'] = trade_no
      }
      aop.execute('alipay.trade.query', this._config, alipayArray).then(resolve).catch(reject)
    })
  }
  aliScanCancel (option) {
    return new Promise((resolve, reject) => {
      var out_trade_no = option['out_trade_no']
      var trade_no = option['trade_no']

      var alipayArray = {}
      if (out_trade_no) {
        alipayArray['out_trade_no'] = out_trade_no
      }
      if (trade_no) {
        alipayArray['trade_no'] = trade_no
      }
      aop.execute('alipay.trade.cancel', this._config, alipayArray).then(resolve).catch(reject)
    })
  }
  aliWebPay (option) {
    return new Promise((resolve, reject) => {
      var out_trade_no = option['out_trade_no'] || ''
      var subject = option['subject'] || ''
      var seller_id = option['seller_id'] || ''
      var body = option['body'] || ''
      var total_amount = option['total_amount'] || ''
      // var timeout_express = option['timeout_express'] || 50

      // timeout_express = timeout_express + 'm'
      var alipayArray = {}
      alipayArray['subject'] = subject
      alipayArray['out_trade_no'] = out_trade_no
      alipayArray['seller_id'] = seller_id
      alipayArray['total_amount'] = total_amount
      alipayArray['product_code'] = 'QUICK_WAP_PAY'
      // alipayArray['timeout_express'] = timeout_express
      aop.execute2('alipay.trade.wap.pay', this._config, alipayArray).then(resolve).catch(reject)
    })
  }

  aliPrecreate (option) {
    return new Promise((resolve, reject) => {
      var out_trade_no = option['out_trade_no'] || ''
      var subject = option['subject'] || ''
      var store_id = option['store_id'] || ''
      var seller_id = option['seller_id'] || ''
      var total_amount = option['total_amount'] || ''
      var timeout_express = option['timeout_express'] || 50

      timeout_express = timeout_express + 'm'
      var alipayArray = {}
      alipayArray['subject'] = subject
      alipayArray['out_trade_no'] = out_trade_no
      alipayArray['store_id'] = 'XG'
      // alipayArray['seller_id'] = seller_id
      alipayArray['total_amount'] = total_amount
      alipayArray['timeout_express'] = timeout_express
      aop.execute('alipay.trade.precreate', this._config, alipayArray).then(resolve).catch(reject)
    })
  }

  getAppStr (option) {
    return new Promise((resolve, reject) => {
      var out_trade_no = option['out_trade_no'] || ''
      var subject = option['subject'] || ''
      var store_id = option['store_id'] || ''
      var seller_id = option['seller_id'] || ''
      var total_amount = option['total_amount'] || ''
      var timeout_express = option['timeout_express'] || 500

      timeout_express = timeout_express + 'm'
      var alipayArray = {}
      // 支付主题设置为订单号
      alipayArray['subject'] = out_trade_no
      // alipayArray['body'] = 'xgtest'
      alipayArray['out_trade_no'] = out_trade_no
      // alipayArray['store_id'] = 'XG'
      // alipayArray['seller_id'] = seller_id
      alipayArray['total_amount'] = total_amount
      alipayArray['timeout_express'] = timeout_express
      alipayArray['product_code'] = 'QUICK_MSECURITY_PAY'
      aop.execute3('alipay.trade.app.pay', this._config, alipayArray).then(resolve).catch(reject)
    })
  }
  aliRefund (option) {
    return new Promise((resolve, reject) => {
      var out_trade_no = option['out_trade_no'] || ''
      var trade_no = option['trade_no'] || ''
      var out_request_no = option['out_request_no'] || ''
      var refund_amount = option['refund_amount'] || ''

      timeout_express = timeout_express + 'm'
      var alipayArray = {}
      alipayArray['trade_no'] = trade_no
      alipayArray['out_trade_no'] = out_trade_no
      alipayArray['out_request_no'] = out_request_no
      alipayArray['refund_amount'] = refund_amount
      aop.execute('alipay.trade.refund', this._config, alipayArray).then(resolve).catch(reject)
    })
  }
}

var alipay = new Alipay_f2f()
module.exports = alipay
