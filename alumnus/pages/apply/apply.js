Page({
  data: {
    name: '',
    category: [], // 改为数组存储多选的类别
    region: '',
    company: '',
    position: '',
    graduation_year: '',
    major: '',
    isAgreed: false
  },

  // 监听输入框变化
  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 处理类别多选变化
  onCategoryChange(e) {
    this.setData({
      category: e.detail.value
    });
  },

  // 选择毕业年份
  onDateChange(e) {
    this.setData({
      graduation_year: e.detail.value
    });
  },

  // 选择地区
  onRegionChange(e) {
    this.setData({ 
      region: e.detail.value.join(' ') 
    });
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
        title: '请填写姓名！',
        icon: 'none'
      });
      return;
    }

    if (this.data.category.length === 0) {
      wx.showToast({
        title: '请选择类别！',
        icon: 'none'
      });
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
        major: this.data.major
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