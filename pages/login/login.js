Page({
  data: {
    activeTab: 'login',
    username: '',
    password: '',
    registerUsername: '',
    registerPassword: '',
    confirmPassword: '',
    nickname: '',
    isAgreed: false,
    isRegisterAgreed: false,
    confirmBtn: { content: '知道了', variant: 'base' },
    dialogKey: '',
    showText: false,
    showMultiText: false,
    showTextAndTitle: false,
    showMultiTextAndTitle: false,
  },

  showDialog(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [key]: true, dialogKey: key });
  },

  closeDialog() {
    const { dialogKey } = this.data;
    this.setData({ [dialogKey]: false });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  onUsernameChange(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordChange(e) {
    this.setData({ password: e.detail.value });
  },

  onAgreeChange(e) {
    this.setData({ isAgreed: e.detail.value.length > 0 });
  },

  showAgreement() {
    wx.showModal({
      title: '用户服务协议',
      content: ``,
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  onLogin() {
    const { username, password, isAgreed } = this.data;

    if (!username || !password) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (!isAgreed) {
      wx.showToast({
        title: '请先同意服务协议',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    wx.cloud.callFunction({
      name: 'login',
      data: { username, password }
    })
      .then(res => {
        wx.hideLoading();
        if (res.result.success) {
          wx.setStorageSync('userInfo', res.result.data);
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.navigateTo({ url: '/pages/service/index' });
              }, 1500);
            }
          });
        } else {
          wx.showToast({
            title: res.result.message || '登录失败',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '登录失败，请稍后重试',
          icon: 'none'
        });
        console.error('[云函数] [login] 调用失败：', err);
      });
  }
});
