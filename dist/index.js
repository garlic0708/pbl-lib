"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceSchema = getServiceSchema;
exports.paginate = paginate;
exports.mergeDependencies = mergeDependencies;
exports.delegateToSchema = delegateToSchema;
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function get() {
    return _config["default"];
  }
});
exports.dependencies = void 0;

var _index = require("apollo-link-http/lib/index");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _index2 = require("graphql-tools/dist/index");

var _index3 = require("apollo-link-context/lib/index");

var _config = _interopRequireWildcard(require("./config"));

var _mergeSchemas = _interopRequireDefault(require("graphql-tools/dist/stitching/mergeSchemas"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var DEFAULT_LIMIT = 10;
/**
 * Get the link to another GraphQL service
 * @param serviceName
 * @returns {Promise<>}
 */

function getServiceSchema(_x) {
  return _getServiceSchema.apply(this, arguments);
}
/**
 * Paginate the results of mongoose query
 * @param query
 * @param limit
 * @param cursor
 * @param desc
 * @returns {Promise<{nextCursor: *, items: *}|{nextCursor: null, items}>}
 */


function _getServiceSchema() {
  _getServiceSchema = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(serviceName) {
    var link, contextLink;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            link = new _index.HttpLink({
              uri: "http://".concat(_config.services[serviceName], "/graphql"),
              fetch: _nodeFetch["default"]
            });
            contextLink = (0, _index3.setContext)(function (request, prevContext) {
              return {
                headers: prevContext.graphqlContext
              };
            }).concat(link);
            _context.t0 = _index2.makeRemoteExecutableSchema;
            _context.next = 5;
            return (0, _index2.introspectSchema)(contextLink);

          case 5:
            _context.t1 = _context.sent;
            _context.t2 = contextLink;
            _context.t3 = {
              schema: _context.t1,
              link: _context.t2
            };
            return _context.abrupt("return", (0, _context.t0)(_context.t3));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getServiceSchema.apply(this, arguments);
}

function paginate(_x2, _x3, _x4) {
  return _paginate.apply(this, arguments);
}

function _paginate() {
  _paginate = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(query, limit, cursor) {
    var desc,
        result,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            desc = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : false;
            limit = limit || DEFAULT_LIMIT; // Fetch one more item

            query = query.limit(limit + 1);
            if (desc) query = query.sort({
              _id: -1
            });

            if (cursor) {
              query = query.where('_id');
              query = desc ? query.lte(cursor) : query.gte(cursor);
            }

            _context2.next = 7;
            return query.exec();

          case 7:
            result = _context2.sent;

            if (!(result.length === limit + 1)) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", {
              items: result.slice(0, -1),
              nextCursor: result.slice(-1)[0]._id
            });

          case 10:
            return _context2.abrupt("return", {
              items: result,
              nextCursor: null
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _paginate.apply(this, arguments);
}

var dependencies = {};
/**
 * Merge with schemas that the current service is dependent on
 * @param typeDefs
 * @param resolvers
 * @param schemasToMerge
 * @returns {Promise<>}
 */

exports.dependencies = dependencies;

function mergeDependencies(_x5, _x6, _x7) {
  return _mergeDependencies.apply(this, arguments);
}
/**
 * Helper for delegating to another schema
 * @param schema
 * @param fieldName
 * @param args
 * @param context
 * @param info
 * @returns {*}
 */


function _mergeDependencies() {
  _mergeDependencies = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(typeDefs, resolvers, schemasToMerge) {
    var schemas;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            schemas = Promise.all(schemasToMerge.map(
            /*#__PURE__*/
            function () {
              var _ref2 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee3(serviceName) {
                var schema;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return getServiceSchema(serviceName);

                      case 2:
                        schema = _context3.sent;
                        dependencies[serviceName] = schema;
                        return _context3.abrupt("return", schema);

                      case 5:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x8) {
                return _ref2.apply(this, arguments);
              };
            }()));
            return _context4.abrupt("return", (0, _mergeSchemas["default"])({
              schemas: [].concat(_toConsumableArray(schemas), [typeDefs]),
              resolvers: resolvers
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _mergeDependencies.apply(this, arguments);
}

function delegateToSchema(_ref) {
  var schema = _ref.schema,
      fieldName = _ref.fieldName,
      args = _ref.args,
      context = _ref.context,
      info = _ref.info;
  return info.mergeInfo.delegateToSchema({
    schema: schema,
    operation: 'query',
    fieldName: fieldName,
    args: args,
    context: context,
    info: info
  });
}
//# sourceMappingURL=index.js.map