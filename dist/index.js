"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushNotification = pushNotification;
exports.getServiceSchema = getServiceSchema;
exports.paginate = paginate;
exports.mergeDependencies = mergeDependencies;
exports.delegateToSchema = delegateToSchema;
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function get() {
    return _config2["default"];
  }
});
exports.context = exports.dependencies = void 0;

var _index = require("apollo-link-http/lib/index");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _index2 = require("graphql-tools/dist/index");

var _apolloLink = require("apollo-link");

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _index3 = require("apollo-link-context/lib/index");

var _mergeSchemas = _interopRequireDefault(require("graphql-tools/dist/stitching/mergeSchemas"));

var _apolloClientPreset = require("apollo-client-preset");

var _apolloLinkWs = require("apollo-link-ws");

var _apolloUtilities = require("apollo-utilities");

var _ws = _interopRequireDefault(require("ws"));

var _client = require("subscriptions-transport-ws/dist/client");

var _config2 = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["mutation PushNotification($receiver: ID!, $content: String!) {\n            pushNotification(receiver: $receiver, content: $content) {\n                content\n            }\n        }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var DEFAULT_LIMIT = 10;
/**
 * Call the notification service's pushNotification mutation
 * @param receiver
 * @param content
 * @param context
 * @returns {Promise<void>}
 */

function pushNotification(_x, _x2, _x3) {
  return _pushNotification.apply(this, arguments);
}
/**
 * Get the link to another GraphQL service
 * @param serviceName
 * @param hasWs
 * @returns {Promise<>}
 */


function _pushNotification() {
  _pushNotification = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(receiver, content, context) {
    var operation, link;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            operation = {
              query: (0, _graphqlTag["default"])(_templateObject()),
              variables: {
                receiver: receiver,
                content: content
              },
              context: {
                headers: _objectSpread({}, context)
              }
            };
            link = new _index.HttpLink({
              uri: "http://".concat(_config2["default"].services['notification'], "/graphql"),
              fetch: _nodeFetch["default"]
            });
            return _context.abrupt("return", (0, _apolloLink.makePromise)((0, _apolloLink.execute)(link, operation)));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _pushNotification.apply(this, arguments);
}

function getServiceSchema(_x4) {
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
  regeneratorRuntime.mark(function _callee2(serviceName) {
    var hasWs,
        serviceUrl,
        link,
        contextLink,
        schema,
        subscriptionClient,
        wsLink,
        contextMiddleware,
        wsContextLink,
        _args2 = arguments;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            hasWs = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : false;
            serviceUrl = _config2["default"].services[serviceName];
            link = new _index.HttpLink({
              uri: "http://".concat(serviceUrl, "/graphql"),
              fetch: _nodeFetch["default"]
            });
            // Context is passed on to downstream http services with context
            contextLink = (0, _index3.setContext)(function (request, prevContext) {
              return {
                headers: prevContext.graphqlContext
              };
            }).concat(link);
            _context2.next = 6;
            return (0, _index2.introspectSchema)(contextLink);

          case 6:
            schema = _context2.sent;

            if (hasWs) {
              subscriptionClient = new _client.SubscriptionClient("ws://".concat(serviceUrl, "/graphql"), {
                reconnect: true
              }, _ws["default"]);
              wsLink = new _apolloLinkWs.WebSocketLink(subscriptionClient); // Context is passed on to downstream ws services with payload

              contextMiddleware = new _apolloLink.ApolloLink(function (operation, forward) {
                operation.context = operation.getContext().graphqlContext;
                return forward(operation);
              });
              wsContextLink = (0, _apolloClientPreset.concat)(contextMiddleware, wsLink);
              contextLink = (0, _apolloClientPreset.split)(function (_ref2) {
                var query = _ref2.query;

                var _getMainDefinition = (0, _apolloUtilities.getMainDefinition)(query),
                    kind = _getMainDefinition.kind,
                    operation = _getMainDefinition.operation;

                return kind === 'OperationDefinition' && operation === 'subscription';
              }, wsContextLink, contextLink);
            }

            return _context2.abrupt("return", (0, _index2.makeRemoteExecutableSchema)({
              schema: schema,
              link: contextLink
            }));

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getServiceSchema.apply(this, arguments);
}

function paginate(_x5, _x6, _x7) {
  return _paginate.apply(this, arguments);
}

function _paginate() {
  _paginate = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(query, limit, cursor) {
    var desc,
        result,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            desc = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : false;
            limit = limit || DEFAULT_LIMIT; // Fetch one more item

            query = query.limit(limit + 1);
            if (desc) query = query.sort({
              _id: -1
            });

            if (cursor) {
              query = query.where('_id');
              query = desc ? query.lte(cursor) : query.gte(cursor);
            }

            _context3.next = 7;
            return query.exec();

          case 7:
            result = _context3.sent;

            if (!(result.length === limit + 1)) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return", {
              items: result.slice(0, -1),
              nextCursor: result.slice(-1)[0]._id
            });

          case 10:
            return _context3.abrupt("return", {
              items: result,
              nextCursor: null
            });

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
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

function mergeDependencies(_x8, _x9, _x10) {
  return _mergeDependencies.apply(this, arguments);
}
/**
 * Helper for delegating to another schema
 * @param schema
 * @param schemaName
 * @param operation
 * @param fieldName
 * @param args
 * @param context
 * @param info
 * @returns {*}
 */


function _mergeDependencies() {
  _mergeDependencies = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(typeDefs, resolvers, schemasToMerge) {
    var schemas;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Promise.all(schemasToMerge.map(
            /*#__PURE__*/
            function () {
              var _ref3 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4(serviceName) {
                var schema;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return getServiceSchema(serviceName);

                      case 2:
                        schema = _context4.sent;
                        dependencies[serviceName] = schema;
                        return _context4.abrupt("return", schema);

                      case 5:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x11) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 2:
            schemas = _context5.sent;
            return _context5.abrupt("return", (0, _mergeSchemas["default"])({
              schemas: [].concat(_toConsumableArray(schemas), [typeDefs]),
              resolvers: resolvers
            }));

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _mergeDependencies.apply(this, arguments);
}

function delegateToSchema(_ref) {
  var schema = _ref.schema,
      schemaName = _ref.schemaName,
      operation = _ref.operation,
      fieldName = _ref.fieldName,
      args = _ref.args,
      context = _ref.context,
      info = _ref.info;
  var theSchema = schema || dependencies[schemaName];
  return info.mergeInfo.delegateToSchema({
    schema: theSchema,
    operation: operation || 'query',
    fieldName: fieldName,
    args: args,
    context: context,
    info: info
  });
}

var context = function context(ctx) {
  return ctx.req ? {
    username: ctx.req.headers['username'] || 'testqq'
  } : ctx.payload.context || {
    username: 'testqq'
  };
};

exports.context = context;
//# sourceMappingURL=index.js.map