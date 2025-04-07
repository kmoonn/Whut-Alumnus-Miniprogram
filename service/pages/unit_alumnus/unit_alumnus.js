Page({
  data: {
    defaultAvatar: 'https://636c-cloud1-6gsqyvkd3f24bdd8-1311119192.tcb.qcloud.la/images/%E6%A0%A1%E5%8F%8B%E5%A4%B4%E5%83%8F.png',
    company: '',
    alumniList: [] // 校友列表
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      company: options.company // 获取传递过来的公司名称
    });
    this.loadAlumni(options.company); // 根据公司名称加载校友信息
  },

  loadAlumni(company) {
    wx.cloud.callFunction({
      name: 'map',
      data: { action: 'getAlumniByCompany', company: company }, // 获取该公司校友信息
      success: res => {
        if (res.result.success === 200) {
          this.setData({
            alumniList: res.result.result
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: error => {
        wx.showToast({
          title: '加载校友数据失败',
          icon: 'none'
        });
      }
    });
  },

  // 显示校友详情
  showDetail(e) {
    const id = e.currentTarget.dataset.id;
    const userInfo = wx.getStorageSync('userInfo');
    const userRole = userInfo ? userInfo.role : null;

    if (userRole !== 'admin' && userRole !== 'leader') {
      wx.showToast({
        title: '无详细信息查看权限',
        icon: 'none'
      });
      return;
    }

    if (id) {
      wx.showLoading({ title: '加载中', mask: true });
      wx.navigateTo({
        url: `/alumnus/pages/famous_detail/famous_detail?id=${id}`
      });
    } else {
      console.error('未获取到有效的 id');
    }
  }
});
