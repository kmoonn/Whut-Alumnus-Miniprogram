Page({
  data: {
    activityList: [] 
  },
  onLoad() {
    this.fetchActivity();
  },

  navigateToWeb(e) {
    const url = e.currentTarget.dataset.url;
    console.log('Decoded URL:', url);
    wx.navigateTo({
      url: `/service/pages/activityDetail/activityDetail?url=${encodeURIComponent(url)}`
    });
  },


  // 获取活动列表
  fetchActivity() {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'getActivity',
      data: {
        action: 'getActivity',
      },
      success: res => {
        if (res.result.code === 200) {
          const activityList = res.result.result;
          console.log('获取到的校友列表数据:', activityList);
          this.setData({
            activityList: activityList
          });
        }
      },
      fail: err => {
        console.error('获取活动详情失败', err);
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
});
