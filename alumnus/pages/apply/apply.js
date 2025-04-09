Page({
  data: {
    category: [],
    name: '',
    region: '',
    company: '',
    position: '',
    graduation_year: '',
    major: '',
    phone: '',
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
      title: '重点校友推荐标准',
      content: '1. 中央机关及其直属机构工作人员；2.各地方机关及有关单位副处级及以上人员；3.高校和科研机构副高级职称及以上人员；4.目前运行良好的各类企业高管及以上负责人员；5.获省部级及以上奖励和荣誉称号人员；6. 其他重点校友',
      showCancel: false,
      confirmText: '我已阅读'
    });
  },

  // 提交表单
  submitForm() {
    if (this.data.category.length === 0 || !this.data.name || !this.data.company || !this.data.phone) {
      wx.showToast({ title: '请填写必填项！', icon: 'none' });
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
        console.error('提交失败', err);
      }
    });
  }
});