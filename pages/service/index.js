Page({
  data: {
  },

  navigateTo(e) {
    const userInfo = wx.getStorageSync('userInfo'); 
    const userRole = userInfo ? userInfo.role : null; 

    if (userRole !== 'admin' && userRole !== 'reviewer') {
      wx.showToast({
        title: '无访问权限',
        icon: 'none'
      });
      return;
    }

    const path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path
    });
  }
}); 