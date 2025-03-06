Page({
  data: {
    name: '',
    gender: '',
    graduateYear: '',
    college: '',
    major: '',
    region: '',
    company: '',
    position: '',
    isAgreed: false
  },

  // 监听输入框变化
  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

    // 处理性别变化
  onGenderChange: function (e) {
      // 获取用户选择的性别
      const selectedGender = e.detail.value;
  
      // 更新数据
      this.setData({
        gender: selectedGender
      });
    },

  // 选择毕业年份
  onDateChange(e) {
    this.setData({
      graduateYear: e.detail.value
    });
  },

  onRegionChange(e) {
    this.setData({ region: e.detail.value.join(' ') }); // 将省市区拼接为字符串
  },

  // 用户同意协议
  onAgreeChange(e) {
    this.setData({
      isAgreed: e.detail.value.length > 0
    });
  },

  // 提交表单
  submitForm() {
    if (!this.data.name) {
      wx.showToast({
        title: '请至少填写姓名！',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    wx.cloud.callFunction({
      name: 'apply',
      data: {
        name: this.data.name,
        gender: this.data.gender,
        graduateYear: this.data.graduateYear,
        college: this.data.college,
        major: this.data.major,
        region: this.data.region,
        company: this.data.company,
        position: this.data.position
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        });
        console.error('提交失败', err);
      }
    });
  }
});
