Page({
  data: {
    username: '',
    password: '',
    isAgree: false
  },

  // 处理学工号输入变化
  onUsernameChange: function(event) {
    this.setData({
      username: event.detail.value
    });
  },

  // 处理密码输入变化
  onPasswordChange: function(event) {
    this.setData({
      password: event.detail.value
    });
  },

  // 处理协议勾选
  onAgreeChange: function(event) {
    this.setData({
      isAgree: event.detail.value.length > 0
    });
  },

  // 登录按钮点击事件
  onLogin: function() {
    const { username, password, isAgree } = this.data;

    // 验证学工号和密码是否为空
    if (!username || !password) {
      wx.showToast({
        title: '请输入学工号和密码',
        icon: 'none'
      });
      return;
    }

    // 验证是否同意协议
    if (!isAgree) {
      wx.showToast({
        title: '请同意服务协议',
        icon: 'none'
      });
      return;
    }

    // 调用云函数进行登录验证
    wx.cloud.callFunction({
      name: 'login',
      data: {
        username: username,
        password: password
      },
      success: res => {
        console.log('云函数调用成功', res);
        if (res.result.success) {
          wx.showToast({
            title: res.result.message,
            icon: 'success'
          });

          const userId = '1';
          wx.setStorageSync('userId', userId); // 将用户ID存储在本地
          console.log(wx.getStorageSync('userId'))

          // 登录成功后跳转到其他页面
          wx.switchTab({
            url: '/pages/index/index',
            success: function() {
              console.log("跳转成功");
            },
            fail: function(err) {
              console.log("跳转失败",err);
            }
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.log('云函数调用失败', err);
        wx.showToast({
          title: '登录失败，请稍后再试',
          icon: 'none'
        });
      }
    });
  }
});
