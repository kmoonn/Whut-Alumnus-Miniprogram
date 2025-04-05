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

  methods: {
    showDialog(e) {
      const { key } = e.currentTarget.dataset;
      this.setData({ [key]: true, dialogKey: key });
    },

    closeDialog() {
      const { dialogKey } = this.data;
      this.setData({ [dialogKey]: false });
    },
  },

  showDialog(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [key]: true, dialogKey: key });
  },

  closeDialog() {
    const { dialogKey } = this.data;
    this.setData({ [dialogKey]: false });
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 登录表单输入处理
  onUsernameChange(e) {
    this.setData({
      username: e.detail.value
    });
  },

  onPasswordChange(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 注册表单输入处理
  onRegisterUsernameChange(e) {
    this.setData({
      registerUsername: e.detail.value
    });
  },

  onRegisterPasswordChange(e) {
    this.setData({
      registerPassword: e.detail.value
    });
  },

  onConfirmPasswordChange(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  onNameChange(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  // 协议勾选处理
  onAgreeChange(e) {
    this.setData({
      isAgreed: e.detail.value.length > 0
    });
  },

  onRegisterAgreeChange(e) {
    this.setData({
      isRegisterAgreed: e.detail.value.length > 0
    });
  },

  // 显示服务协议
  showAgreement() {
    wx.showModal({
      title: '用户服务协议',
      content: ``,
      showCancel: false,
      confirmText: '我知道了'
    });
  },


  // 登录处理
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

    wx.showLoading({
      title: '登录中...'
    });

    // 调用登录云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {
        username: username,
        password: password
      }
    })
      .then(res => {
        wx.hideLoading();
        if (res.result.success) {
          // 登录成功，保存用户信息
          wx.setStorageSync('userInfo', res.result.data);
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/service/index'
                });
              }, 1500);
            }
          });
        } else {
          // 登录失败
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
  },
});
