export const getObserver = (context, selector) => {
    return new Promise((resolve, reject) => {
        context
            .createIntersectionObserver(context)
            .relativeToViewport()
            .observe(selector, (res) => {
            resolve(res);
        });
    });
};
export const getWindowInfo = () => {
    return wx.getWindowInfo ? wx.getWindowInfo() || wx.getSystemSetting() : wx.getSystemSetting();
};
export const getAppBaseInfo = () => {
    return wx.getAppBaseInfo ? wx.getAppBaseInfo() || wx.getSystemSetting() : wx.getSystemSetting();
};
export const getDeviceInfo = () => {
    return wx.getDeviceInfo ? wx.getDeviceInfo() || wx.getSystemSetting() : wx.getSystemSetting();
};
