Page({
  data: {
    id :'',
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
    wx.switchTab({ url: '/pages/index/index' }) //dev
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
        username: this.data.username,
        password: this.data.password
      },
      success: res => {
        if (res.result.success) {
          wx.setStorageSync('userId', res.result.data.id);
          wx.setStorageSync('username', res.result.data.username);
          wx.setStorageSync('userRole', res.result.data.role);
          
          wx.showToast({ title: '登录成功', icon: 'success' });
          wx.switchTab({ url: '/pages/index/index' })
          // 根据角色跳转
          // if (res.result.data.role === 'admin') {
          //   wx.redirectTo({ url: '/pages/admin/index' });
          // } else {
          //   wx.redirectTo({ url: '/pages/home/index' });
          // }
        } else {
          wx.showToast({ title: res.result.message, icon: 'none' });
        }
      },
      fail: err => {
        console.error('登录失败:', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });    
  }
});
