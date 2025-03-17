Page({
  data: {
  },

  navigateTo(e) {
    const userInfo = wx.getStorageSync('userInfo'); 
    const userRole = userInfo ? userInfo.role : null; 
    const path = e.currentTarget.dataset.path;

    if (userRole !== 'admin' && userRole !== 'reviewer' && path == "/alumnus/pages/check/check") {
      wx.showToast({
        title: '无访问权限',
        icon: 'none'
      });
      return;
    }

    
    wx.navigateTo({
      url: path
    });
  }
}); 