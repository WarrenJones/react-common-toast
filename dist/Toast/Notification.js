"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Notice = require("./Notice");

var _Notice2 = _interopRequireDefault(_Notice);

require("./toast.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Notification是Notice父组件，容器
// 是动态插入和删除DOM节点的核心
// 同时也向上暴露给Toast重写改变自己的方法


// 统计notice总数 防止重复
var noticeNumber = 0;
// 生成唯一的id
var getUuid = function getUuid() {
  return "notification-" + new Date().getTime() + "-" + noticeNumber++;
};

var Notification = function (_React$Component) {
  _inherits(Notification, _React$Component);

  function Notification(props) {
    _classCallCheck(this, Notification);

    var _this2 = _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).call(this, props));

    _this2.state = {
      notices: [], // 存储当前有的notices
      hasMask: true // 是否显示蒙版
    };
    return _this2;
  }

  _createClass(Notification, [{
    key: "add",
    value: function add(notice) {
      // 添加notice
      // 创造一个不重复的key
      var notices = this.state.notices;

      var key = notice.key ? notice.key : notice.key = getUuid();
      var mask = notice.mask ? notice.mask : false;
      var temp = notices.filter(function (item) {
        return item.key === key;
      }).length;

      if (!temp) {
        // 不存在重复的 添加
        notices.push(notice);
        this.setState({
          notices: notices,
          hasMask: mask
        });
      }
    }
  }, {
    key: "remove",
    value: function remove(key) {
      // 根据key删除对应
      this.setState(function (previousState) {
        return {
          notices: previousState.notices.filter(function (notice) {
            return notice.key !== key;
          })
        };
      });
    }
  }, {
    key: "getNoticeDOM",
    value: function getNoticeDOM() {
      var _this = this;
      var notices = this.state.notices;

      var result = [];

      notices.map(function (notice) {
        // 每个Notice onClose的时候 删除掉notices中对应key的notice
        var closeCallback = function closeCallback() {
          _this.remove(notice.key);
          // 如果有用户传入的onClose 执行
          if (notice.onClose) notice.onClose();
        };

        result.push(_react2.default.createElement(_Notice2.default, _extends({ key: notice.key }, notice, { onClose: closeCallback })));
      });

      return result;
    }
  }, {
    key: "getMaskDOM",
    value: function getMaskDOM() {
      var _state = this.state,
          notices = _state.notices,
          hasMask = _state.hasMask;
      // notices为空的时候 不显示蒙版
      // 始终只有一个蒙版

      if (notices.length > 0 && hasMask == true) return _react2.default.createElement("div", { className: "tips-mask" });
    }
  }, {
    key: "render",
    value: function render() {
      var noticesDOM = this.getNoticeDOM();
      //暂时没有配置蒙版
      var maskDOM = this.getMaskDOM();
      return _react2.default.createElement(
        "div",
        null,
        noticesDOM
      );
    }
  }]);

  return Notification;
}(_react2.default.Component);

// Notification增加一个重写方法
// 该方法方便Notification组件动态添加到页面中和重写


exports.default = Notification;
Notification.reWrite = function (properties) {
  var _ref = properties || {},
      props = _objectWithoutProperties(_ref, []);

  var div = document.createElement("div");
  document.body.appendChild(div);

  var notification = _reactDom2.default.render(_react2.default.createElement(Notification, props), div);

  return {
    notice: function notice(noticeProps) {
      notification.add(noticeProps);
    },
    removeNotice: function removeNotice(key) {
      notification.remove(key);
    },
    destroy: function destroy() {
      _reactDom2.default.unmountComponentAtNode(div);
      document.body.removeChild(div);
    },

    component: notification
  };
};