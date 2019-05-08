"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require("prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Notice是Toast最底层组件
// 每个toast的小框框其实都是一个Notice
// Notice核心就是组件初始化的时候 生成一个定时器
// 根据输入的时间 加载一个动画 然后执行输入的回调
// Notice的显示和隐藏收到父组件Notification的绝对控制


var Notice = function (_React$Component) {
  _inherits(Notice, _React$Component);

  function Notice(props) {
    _classCallCheck(this, Notice);

    var _this2 = _possibleConstructorReturn(this, (Notice.__proto__ || Object.getPrototypeOf(Notice)).call(this, props));

    _this2.state = {
      shouldClose: false // 是否开启关闭动画
    };
    return _this2;
  }

  _createClass(Notice, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      if (this.props.duration > 0) {
        this.closeTimer = setTimeout(function () {
          _this3.close();
        }, this.props.duration - 300); // 减掉消失动画300毫秒
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      // 当有意外关闭的时候 清掉定时器
      this.clearCloseTimer();
    }
  }, {
    key: "clearCloseTimer",
    value: function clearCloseTimer() {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    }
  }, {
    key: "close",
    value: function close() {
      var _this4 = this;

      // 关闭的时候 应该先清掉倒数定时器
      // 然后开启过场动画
      // 等待动画结束 执行回调
      this.clearCloseTimer();
      var _this = this;
      _this.setState({ shouldClose: true });
      this.timer = setTimeout(function () {
        if (_this4.props.onClose) {
          _this4.props.onClose();
        }
        clearTimeout(_this.timer);
      }, 300);
    }
  }, {
    key: "render",
    value: function render() {
      var shouldClose = this.state.shouldClose;

      return _react2.default.createElement(
        "div",
        { className: (0, _classnames2.default)({ leave: shouldClose }) },
        this.props.content
      );
    }
  }]);

  return Notice;
}(_react2.default.Component);

exports.default = Notice;


Notice.propTypes = {
  duration: _propTypes.PropTypes.number, // Notice显示时间
  content: _propTypes.PropTypes.any, // Notice显示的内容
  onClose: _propTypes.PropTypes.func // 显示结束回调
};

Notice.defaultProps = {
  duration: 3000
};