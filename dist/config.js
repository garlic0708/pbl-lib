"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var isProd = process.env['PROD'] === 'true';
var mongoUrl = "mongodb://".concat(isProd ? process.env['MONGODB_URL'] : 'localhost', ":27017/pbl");
var redisUrl = isProd ? process.env['REDIS_URL'] : 'localhost';
var services = new Proxy({}, {
  get: function get(target, p, receiver) {
    if (isProd) return "".concat(p, "-service:4000");
    return {
      'user-project': 'localhost:4001',
      'notification': 'localhost:4002',
      'task': 'localhost:4003',
      'resource': 'localhost:4004'
    }[p];
  }
});
var _default = {
  mongoUrl: mongoUrl,
  redisUrl: redisUrl,
  services: services
};
exports["default"] = _default;
//# sourceMappingURL=config.js.map