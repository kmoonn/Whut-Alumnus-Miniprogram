Page({
  data: {
    companyDetail: {} // 用于存储企业详细信息
  },
  onLoad(options) {
    console.log('接收到的参数:', options);
    const id = options.id;
    if (id) {
      this.fetchCompanyDetail(id);
    } else {
      console.error('未获取到有效的 id');
    }
  },
  fetchCompanyDetail(id) {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'getCompanyDetail',
      data: {
        id: id
      },
      success: res => {
        console.log('查询结果:', res);
        if (res.result.code === 200) {
          this.setData({
            companyDetail: res.result.result
          });
        } else {
          console.error('查询失败:', res.result.message);
        }
      },
      fail: err => {
        console.error('获取校友详情失败', err);
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