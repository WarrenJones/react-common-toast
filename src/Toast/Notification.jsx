// Notification是Notice父组件，容器
// 是动态插入和删除DOM节点的核心
// 同时也向上暴露给Toast重写改变自己的方法
import React from "react";
import ReactDOM from "react-dom";
import Notice from "./Notice";
import "./toast.css";

// 统计notice总数 防止重复
let noticeNumber = 0;
// 生成唯一的id
const getUuid = () => {
  return "notification-" + new Date().getTime() + "-" + noticeNumber++;
};
export default class Notification extends React.Component {
  // Notification增加一个重写方法
  // 该方法方便Notification组件动态添加到页面中和重写
  static reWrite = properties => {
    const { ...props } = properties || {};

    let div = document.createElement("div");
    document.body.appendChild(div);

    const notification = ReactDOM.render(<Notification {...props} />, div);

    return {
      notice(noticeProps) {
        notification.add(noticeProps);
      },
      removeNotice(key) {
        notification.remove(key);
      },
      destroy() {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
      },
      component: notification
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      notices: [], // 存储当前有的notices
      hasMask: true // 是否显示蒙版
    };
  }
  add(notice) {
    // 添加notice
    // 创造一个不重复的key
    const { notices } = this.state;
    const key = notice.key ? notice.key : (notice.key = getUuid());
    const mask = notice.mask ? notice.mask : false;
    const temp = notices.filter(item => item.key === key).length;

    if (!temp) {
      // 不存在重复的 添加
      notices.push(notice);
      this.setState({
        notices: notices,
        hasMask: mask
      });
    }
  }
  remove(key) {
    // 根据key删除对应
    this.setState(previousState => {
      return {
        notices: previousState.notices.filter(notice => notice.key !== key)
      };
    });
  }
  getNoticeDOM() {
    const _this = this;
    const { notices } = this.state;
    let result = [];

    notices.map(notice => {
      // 每个Notice onClose的时候 删除掉notices中对应key的notice
      const closeCallback = () => {
        _this.remove(notice.key);
        // 如果有用户传入的onClose 执行
        if (notice.onClose) notice.onClose();
      };

      result.push(
        <Notice key={notice.key} {...notice} onClose={closeCallback} />
      );
    });

    return result;
  }
  getMaskDOM() {
    const { notices, hasMask } = this.state;
    // notices为空的时候 不显示蒙版
    // 始终只有一个蒙版
    if (notices.length > 0 && hasMask == true)
      return <div className="tips-mask" />;
  }
  render() {
    const noticesDOM = this.getNoticeDOM();
    //暂时没有配置蒙版
    const maskDOM = this.getMaskDOM();
    return (
      <div>
        {/*{maskDOM}*/}
        {noticesDOM}
      </div>
    );
  }
}
