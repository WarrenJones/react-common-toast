"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _Notification = require("./Notification");

var _Notification2 = _interopRequireDefault(_Notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Toast组件比较特殊
// 因为<Toast />不会被直接渲染在DOM中
// 而是动态插入页面中
// Toast组件核心就是通过Notification暴露的重写方法 动态改变Notification
var newNotification = void 0;

// 获得一个Notification
var getNewNotification = function getNewNotification() {
  // 单例 保持页面始终只有一个Notification
  if (!newNotification) {
    newNotification = _Notification2.default.reWrite();
  }

  return newNotification;
};
// notice方法实际上就是集合参数 完成对Notification的改变
var notice = function notice(content, type) {
  var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3000;
  var _onClose = arguments[3];
  var mask = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  if (!content) return;

  //   content = content.toString();

  var notificationInstance = getNewNotification();

  notificationInstance.notice({
    duration: duration,
    mask: mask,
    content: _react2.default.createElement(
      "div",
      { className: (0, _classnames2.default)(["tips-notice-box"]) },
      _react2.default.createElement(
        "div",
        {
          className: (0, _classnames2.default)(["tips-notice-content", { info: type === "info" }, { success: type === "success" }, { warning: type === "warning" }, { error: type === "error" }])
        },
        content
      )
    ),
    onClose: function onClose() {
      if (_onClose) _onClose();
    }
  });
};

exports.default = {
  show: function show(content, duration, icon, mask, onClose) {
    return notice(content, undefined, icon, duration, onClose, mask);
  },
  info: function info(content, duration, icon, mask, onClose) {
    return notice(content, "info", icon, duration, onClose, mask);
  },
  success: function success(content, duration, icon, mask, onClose) {
    return notice(content, "success", icon, duration, onClose, mask);
  },
  warning: function warning(content, duration, icon, mask, onClose) {
    return notice(content, "warning", icon, duration, onClose, mask);
  },
  error: function error(content, duration, icon, mask, onClose) {
    return notice(content, "error", icon, duration, onClose, mask);
  },
  hide: function hide() {
    if (newNotification) {
      newNotification.destroy();
      newNotification = null;
    }
  }
};