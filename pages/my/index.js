Page({
  data: {
    userInfo: null,
    unreadCount: 0
  },

  onLoad() {
    this.fetchUserInfo();
    this.fetchUnreadCount();
  },

  onShow() {
    this.fetchUnreadCount();
  },

  async fetchUserInfo() {
    try {
      const { result } = await getUserInfo();
      this.setData({ userInfo: result });
    } catch (error) {
      console.error('获取用户信息失败：', error);
      wx.showToast({
        title: '获取用户信息失败',
        icon: 'none'
      });
    }
  },

  async fetchUnreadCount() {
    try {
      const { result } = await getUnreadCount();
      this.setData({ unreadCount: result.count });
    } catch (error) {
      console.error('获取未读消息数失败：', error);
    }
  },

  navigateTo(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },

  contactService() {
    wx.makePhoneCall({
      phoneNumber: '1234567890',
      fail() {
        wx.showToast({
          title: '拨打电话失败',
          icon: 'none'
        });
      }
    });
  }
}); 