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
    isRegisterAgreed: false
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
      content: `1.服务说明：本小程序为武汉理工大学校友提供信息服务、活动参与、资源共享等功能。

2.用户资格：
·用户必须是武汉理工大学在校生或毕业校友
·注册需提供真实信息
·不得冒用他人身份

3.用户义务：
·遵守法律法规
·维护学校声誉
·保护账号安全

4.隐私保护：
·依法保护个人信息
·未经同意不向第三方披露
·用户可查询更正个人信息

5.信息发布：
·信息需真实合法
·不得发布违规内容
·维护良好社区氛围

6.免责说明：我们将确保服务稳定性，但不对因不可抗力导致的中断负责。

7.协议修改：我们保留修改权利，修改后将在小程序内公布。`,
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
              wx.switchTab({
                url: '/pages/index/index'
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

  // 注册处理
  onRegister() {
    const { registerUsername, registerPassword, confirmPassword, nickname, isRegisterAgreed } = this.data;

    if (!registerUsername || !registerPassword || !confirmPassword || !nickname) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (registerPassword !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }

    if (!isRegisterAgreed) {
      wx.showToast({
        title: '请先同意服务协议',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '注册中...'
    });

    // 调用注册云函数
    wx.cloud.callFunction({
      name: 'register',
      data: {
        username: registerUsername,
        password: registerPassword,
        nickname: nickname
      }
    })
    .then(res => {
      wx.hideLoading();
      if (res.result.success) {
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => {
              // 注册成功后切换到登录标签并填充用户名
              this.setData({
                activeTab: 'login',
                username: registerUsername,
                password: ''
              });
            }, 1500);
          }
        });
      } else {
        wx.showToast({
          title: res.result.message || '注册失败',
          icon: 'none'
        });
      }
    })
    .catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '注册失败，请稍后重试',
        icon: 'none'
      });
      console.error('[云函数] [register] 调用失败：', err);
    });
  }
});
