Page({
  data: {
    category: [],
    name: '',
    region: '',
    company: '',
    position: '',
    graduation_year: '',
    major: '',
    deeds: '',
    isAgreed: false
  },

  onShow: function (){
    this.showAgreement();
  },

  // 处理类别选择
  onCategoryChange(e) {
    this.setData({
      category: e.detail.value
    });
    if (!e.detail.value.includes('其他')) {
      this.setData({
        deeds: ''
      });
    }
  },

  // 处理输入变化
  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 处理地区选择
  onRegionChange(e) {
    this.setData({
      region: e.detail.value.join(' ')
    });
  },

  // 处理毕业年份选择
  onDateChange(e) {
    this.setData({
      graduation_year: e.detail.value
    });
  },

  // 处理协议勾选
  onAgreeChange(e) {
    this.setData({
      isAgreed: e.detail.value.length > 0
    });
  },

  // 显示协议
  showAgreement() {
    wx.showModal({
      title: '校友申报要求须知',
      content: '校友申报要求须知：1.必填项：类别、姓名、工作单位',
      showCancel: false,
      confirmText: '我已阅读'
    });
  },

  // 提交表单
  submitForm() {
    if (!this.data.name) {
      wx.showToast({ title: '请填写姓名！', icon: 'none' });
      return;
    }
    if (!this.data.company) {
      wx.showToast({ title: '请填写工作单位！', icon: 'none' });
      return;
    }
    if (this.data.category.length === 0) {
      wx.showToast({ title: '请选择类别！', icon: 'none' });
      return;
    }
    if (this.data.category.includes('其他') && !this.data.deeds) {
      wx.showToast({ title: '请填写重大荣誉或事迹！', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中...' });

    wx.cloud.callFunction({
      name: 'apply',
      data: {
        category: this.data.category,
        name: this.data.name,
        region: this.data.region,
        company: this.data.company,
        position: this.data.position,
        graduation_year: this.data.graduation_year,
        major: this.data.major,
        deeds: this.data.deeds,
        userId: wx.getStorageSync('userInfo').id
      },
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '提交成功', icon: 'success' });
        setTimeout(() => { wx.navigateBack(); }, 1500);
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '提交失败，请重试', icon: 'none' });
        console.error('提交失败', err);
      }
    });
  }
});