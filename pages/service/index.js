Page({
  data: {
  },

  navigateTo(e) {
    const path = e.currentTarget.dataset.path;

    wx.navigateTo({
      url: path
    });
  }
}); 