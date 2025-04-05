Page({
  data: {
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
  }
});
