Page({
  data: {
    companyList: [] // 企业列表
  },

  onLoad() {
    this.fetchCompany();
  },

  // 获取企业列表
  fetchCompany() {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'getCompany',
      data: {
        action: 'getCompany',
      },
      success: res => {
        if (res.result.code === 200) {
          const companyList = res.result.result;
          this.setData({
            companyList: companyList
          });
        }
      },
      fail: err => {
        console.error('获取校友企业失败', err);
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  showDetail(e) {
    const id = e.currentTarget.dataset.id;
    console.log('id:', id); // 检查是否正确获取到 id
    if (!id) {
      console.error('id 为空或无效');
      return;
    }
    wx.navigateTo({
      url: `/service/pages/companyDetail/companyDetail?id=${id}`,
      success: function (res) {
        console.log('跳转成功:', res);
      },
      fail: function (err) {
        console.error('页面跳转失败:', err);
      }
    });
  }
});


