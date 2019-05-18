import React from "react";
import classNames from "classnames";
import Notification from "./Notification";
// Toast组件比较特殊
// 因为<Toast />不会被直接渲染在DOM中
// 而是动态插入页面中
// Toast组件核心就是通过Notification暴露的重写方法 动态改变Notification
let newNotification;

// 获得一个Notification
const getNewNotification = () => {
  // 单例 保持页面始终只有一个Notification
  if (!newNotification) {
    newNotification = Notification.reWrite();
  }

  return newNotification;
};
// notice方法实际上就是集合参数 完成对Notification的改变
const notice = (content, type, duration = 3000, onClose, mask = true) => {
  if (!content) return;

//   content = content.toString();

  let notificationInstance = getNewNotification();

  notificationInstance.notice({
    duration,
    mask: mask,
    content: (
      <div className={classNames(["tips-notice-box"])}>
        <div
          className={classNames([
            "tips-notice-content",
            { info: type === "info" },
            { success: type === "success" },
            { warning: type === "warning" },
            { error: type === "error" }
          ])}
        >
          {content}
        </div>
      </div>
    ),
    onClose: () => {
      if (onClose) onClose();
    }
  });
};

export default {
  show(content, duration, icon, mask, onClose) {
    return notice(content, undefined, icon, duration, onClose, mask);
  },
  info(content, duration, icon, mask, onClose) {
    return notice(content, "info", icon, duration, onClose, mask);
  },
  success(content, duration, icon, mask, onClose) {
    return notice(content, "success", icon, duration, onClose, mask);
  },
  warning(content, duration, icon, mask, onClose) {
    return notice(content, "warning", icon, duration, onClose, mask);
  },
  error(content, duration, icon, mask, onClose) {
    return notice(content, "error", icon, duration, onClose, mask);
  },
  hide() {
    if (newNotification) {
      newNotification.destroy();
      newNotification = null;
    }
  }
};
