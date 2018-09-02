"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PluginHandler =
/*#__PURE__*/
function () {
  function PluginHandler() {
    _classCallCheck(this, PluginHandler);

    _defineProperty(this, "plugins", []);
  }

  _createClass(PluginHandler, [{
    key: "addPlugin",
    value: function addPlugin(plugin) {
      this.plugins.push(plugin);
    }
  }, {
    key: "getOnReducerEventFun",
    value: function getOnReducerEventFun() {
      return this.plugins.filter(function (plugin) {
        return plugin.onReducer;
      }).map(function (plugin) {
        return plugin.onReducer;
      });
    }
  }, {
    key: "getOnEffectEventFun",
    value: function getOnEffectEventFun() {
      return this.plugins.filter(function (plugin) {
        return plugin.onEffect;
      }).map(function (plugin) {
        return plugin.onEffect;
      });
    }
  }, {
    key: "getOnStateChangeEventFun",
    value: function getOnStateChangeEventFun() {
      return this.plugins.filter(function (plugin) {
        return plugin.onStateChange;
      }).map(function (plugin) {
        return plugin.onStateChange;
      });
    }
  }, {
    key: "getOnAction",
    value: function getOnAction() {
      return this.plugins.filter(function (plugin) {
        return plugin.onAction;
      }).map(function (plugin) {
        return plugin.onAction;
      });
    }
  }]);

  return PluginHandler;
}();

var _default = PluginHandler;
exports.default = _default;