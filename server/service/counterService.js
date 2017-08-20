'use strict'
var BaseService = require('../service/baseService')
var logger = require('../log/logFactory').getLogger()

class CounterService extends BaseService {

  // 新增自增字段
  * addCounter (name) {
    let counter = yield this.findOne({
      _id: name,
      isDeleted: false
    })
    if (counter) {
      logger.error('The counter is exist!!!!', name)
      return {
        code: 101,
        data: 'The counter is exist!!!!'
      }
    }
    let result = yield this.save({
      _id: name,
      seq: 0,
      isDeleted: false
    })

    return {
      code: 100,
      data: result
    }
  }

  // 获取自增字段
  * getNextSequence (name) {
    let ret = yield this.findAndModify(
      {
        _id: name,
        isDeleted: false
      }, {
        $inc: { seq: 1 }
      }
    )
    console.info('', ret)
    return ret.value.seq
  }

}

module.exports = new CounterService('Counter')
