Page({
  data: {
    userInfo: {}
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({ userInfo });
  },
  editProfile() {
    wx.navigateTo({ url: '/pages/editProfile/editProfile' });
  },
  viewAlumni() {
    wx.navigateTo({ url: '/pages/alumni/alumni' });
  },
  viewFavorites() {
    wx.navigateTo({ url: '/pages/favorites/favorites' });
  }
});
