"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  namespace: '@@duraStatus',
  initialState: {},
  reducers: {
    onChangeStatus: function onChangeStatus(state, _ref) {
      var payload = _ref.payload;
      return _objectSpread({}, state, payload);
    }
  },
  onEffect: function onEffect(effect, name) {
    return (
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(reduxEffect, action) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return reduxEffect.put({
                  type: '@@duraStatus/reducers/onChangeStatus',
                  payload: _defineProperty({}, name, true)
                });

              case 2:
                _context.next = 4;
                return effect(reduxEffect, action);

              case 4:
                _context.next = 6;
                return reduxEffect.put({
                  type: '@@duraStatus/reducers/onChangeStatus',
                  payload: _defineProperty({}, name, false)
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      })
    );
  }
};
exports.default = _default;