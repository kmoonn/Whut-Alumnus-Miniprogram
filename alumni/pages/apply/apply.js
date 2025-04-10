Page({
  data: {
    imageBaseUrl: '',
    category: [],
    name: '',
    region: '',
    company: '',
    position: '',
    graduation_year: '',
    major: '',
    phone: '',
    deeds: '',
    isAgreed: false,

    confirmBtn: { content: '我已知晓', variant: 'base' },
    dialogKey: '',
    showMultiTextAndTitle: false
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      imageBaseUrl: app.globalData.imageBaseUrl
    });
  },

  onShow: function () {
    this.setData({ showMultiTextAndTitle: true, dialogKey: 'showMultiTextAndTitle' });
  },


  onCategoryChange(e) {
    this.setData({
      category: e.detail.value
    });
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  onRegionChange(e) {
    this.setData({
      region: e.detail.value.join(' ')
    });
  },

  onDateChange(e) {
    this.setData({
      graduation_year: e.detail.value
    });
  },

  onAgreeChange(e) {
    this.setData({
      isAgreed: e.detail.value.length > 0
    });
  },

  showDialog(e) {
    const { key } = e.currentTarget.dataset;
    this.setData({ [key]: true, dialogKey: key });
  },
  closeDialog() {
    const { dialogKey } = this.data;
    this.setData({ [dialogKey]: false });
  },

  validateForm() {
    if (this.data.category.length === 0 || !this.data.name || !this.data.company || !this.data.region || !this.data.position) {
      wx.showToast({ title: '缺少必填项未填写！', icon: 'none' });
      return false;
    }
    if (this.data.category.includes('其他') && !this.data.deeds) {
      wx.showToast({ title: '请填写相关重大荣誉或事迹！', icon: 'none' });
      return false;
    }
    if (!this.validatePhone(this.data.phone)) {
      wx.showToast({ title: '请输入有效的电话号码！', icon: 'none' });
      return false;
    }
    return true;
  },

  validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/; // 简单的手机号码验证
    return phoneRegex.test(phone);
  },

  submitForm() {
    if (!this.validateForm()) {
      return;
    }

    wx.showLoading({ title: '提交中...' });

    wx.cloud.callFunction({
      name: 'alumni',
      data: {
        action: 'apply',
        category: this.data.category,
        name: this.data.name,
        region: this.data.region,
        company: this.data.company,
        position: this.data.position,
        graduation_year: this.data.graduation_year,
        major: this.data.major,
        phone: this.data.phone,
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
        console.error('提交失败:', err);
      }
    });
  }
});