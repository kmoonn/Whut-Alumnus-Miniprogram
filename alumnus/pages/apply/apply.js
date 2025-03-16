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