"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.services = exports.redisUrl = exports.mongoUrl = void 0;
var isProd = process.env['PROD'] === 'true';
var mongoUrl = "mongodb://".concat(isProd ? process.env['MONGODB_URL'] : 'localhost', ":27017/pbl");
exports.mongoUrl = mongoUrl;
var redisUrl = isProd ? process.env['REDIS_URL'] : 'localhost';
exports.redisUrl = redisUrl;
var services = new Proxy({}, {
  get: function get(target, p, receiver) {
    if (isProd) return "".concat(p, "-service:4000");
    return {
      'user-project': 'localhost:4001'
    }[p];
  }
});
exports.services = services;
//# sourceMappingURL=config.js.map