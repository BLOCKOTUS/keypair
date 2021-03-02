"use strict";

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = exports.share = void 0;

require("regenerator-runtime/runtime.js");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _index = require("../../../helper/api/dist/index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var WALLET_PATH = _path["default"].join(__dirname, '..', '..', '..', '..', 'wallet');
/**
 * Store a `Keypair` and eventually make it readable by other users.
 */


var share = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
    var sharedWith, groupId, myEncryptedKeyPair, type, user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sharedWith = _ref.sharedWith, groupId = _ref.groupId, myEncryptedKeyPair = _ref.myEncryptedKeyPair, type = _ref.type, user = _ref.user;
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                var walletPath, _yield$getContractAnd, contract, gateway, response;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        // create wallet
                        walletPath = _path["default"].join(WALLET_PATH, "".concat(user.username, ".id"));

                        _fs["default"].writeFileSync(walletPath, JSON.stringify(user.wallet)); // get contract, submit transaction and disconnect


                        _context.next = 4;
                        return (0, _index.getContractAndGateway)({
                          user: user,
                          chaincode: 'keypair',
                          contract: 'Keypair'
                        })["catch"](reject);

                      case 4:
                        _yield$getContractAnd = _context.sent;
                        contract = _yield$getContractAnd.contract;
                        gateway = _yield$getContractAnd.gateway;

                        if (!(!contract || !gateway)) {
                          _context.next = 9;
                          break;
                        }

                        return _context.abrupt("return");

                      case 9:
                        _context.next = 11;
                        return contract.submitTransaction('createSharedKeypair', JSON.stringify(sharedWith), groupId, myEncryptedKeyPair, type)["catch"](reject);

                      case 11:
                        response = _context.sent;
                        _context.next = 14;
                        return gateway.disconnect();

                      case 14:
                        if (response) {
                          _context.next = 16;
                          break;
                        }

                        return _context.abrupt("return");

                      case 16:
                        console.log('Transaction has been submitted', response);
                        resolve();
                        return _context.abrupt("return");

                      case 19:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2, _x3) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function share(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Retrieve a `Keypair` from the network.
 */


exports.share = share;

var get = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref4) {
    var keypairId, user;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            keypairId = _ref4.keypairId, user = _ref4.user;
            return _context4.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
                var walletPath, _yield$getContractAnd2, contract, gateway, rawKeypair, keypair;

                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        // create wallet
                        walletPath = _path["default"].join(WALLET_PATH, "".concat(user.username, ".id"));

                        _fs["default"].writeFileSync(walletPath, JSON.stringify(user.wallet)); // get contract, submit transaction and disconnect


                        _context3.next = 4;
                        return (0, _index.getContractAndGateway)({
                          user: user,
                          chaincode: 'keypair',
                          contract: 'Keypair'
                        })["catch"](reject);

                      case 4:
                        _yield$getContractAnd2 = _context3.sent;
                        contract = _yield$getContractAnd2.contract;
                        gateway = _yield$getContractAnd2.gateway;

                        if (!(!contract || !gateway)) {
                          _context3.next = 9;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 9:
                        _context3.next = 11;
                        return contract.submitTransaction('getKeypair', keypairId)["catch"](reject);

                      case 11:
                        rawKeypair = _context3.sent;
                        _context3.next = 14;
                        return gateway.disconnect();

                      case 14:
                        if (rawKeypair) {
                          _context3.next = 16;
                          break;
                        }

                        return _context3.abrupt("return");

                      case 16:
                        keypair = JSON.parse(rawKeypair.toString('utf8'));
                        console.log('Transaction has been submitted');
                        resolve(keypair);
                        return _context3.abrupt("return");

                      case 20:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x5, _x6) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function get(_x4) {
    return _ref5.apply(this, arguments);
  };
}();

exports.get = get;