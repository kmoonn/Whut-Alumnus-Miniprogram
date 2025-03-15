Page({
  data: {
    userInfo: null,
    showContactModal: false
  },
  
  contactService() {
    this.setData({
      showContactModal: true
    });
  },
  
  hideModal() {
    this.setData({
      showContactModal: false
    });
  },

  onLoad() {
    this.fetchUserInfo();
  },

  onShow() {
  },

  async fetchUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.setData({ userInfo });
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('获取用户信息失败：', error);
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
    }
  },

  navigateTo(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  }

}); 