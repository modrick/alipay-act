global.logger = require('./server/log/logFactory').getLogger()
var os = require('os')
var config = require('./config')
config.YGhost = config.provider_host
config.YGport = config.provider_port
  // 在docker中运行
if (process.env.isdocker) {
  // MAC
  if (os.platform() === 'darwin') {
    var en2 = os.networkInterfaces().en2
    if (en2) {
      config.YGhost = en2[1].address
    }
    // Docker
  } else {
    var eth0 = os.networkInterfaces().eth0
    config.YGhost = eth0[0].address
  }
  if (process.env.ygPort) {
    config.YGport = parseInt(process.env.ygPort)
  }
  logger.info('docker \'s ip is:' + config.YGhost)
}
var Yggdrasil = require('Yggdrasil')
var zkConfig = require('./.zookeeper')
console.info('zkconfig:', process.env.serviceName)

  // 可以启动的时候设置服务名
if (process.env.serviceName) {
  zkConfig.service = process.env.serviceName
  console.info('zkconfig:', zkConfig.service)
}
// 微信服务启动

var dataService = require('./server/service/dataService.js')
dataService.getConfigData().then(function (data) {
  global.logger.info('配置参数加载成功...')
}).catch((error) => {
  global.logger.error(error)
})

// 注入rpc服务
var ygg = new Yggdrasil(config, zkConfig, logger)
var rpc = ygg.provider([weixinRpc

])
rpc.listen()

process.on('uncaughtException', (err) => {
  global.logger.error(err)
})

process.on('unhandledRejection', (reason, p) => {
  global.logger.error(p)
})
