Page({
  data: {
    imageBaseUrl: '',
    tabList: [
      { label: '政界', value: '政界' },
      { label: '商界', value: '商界' },
      { label: '学界', value: '学界' },
      { label: '其他', value: '其他' }
    ],
    currentTab: '政界',
    alumniList: [] // 校友列表
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      imageBaseUrl: app.globalData.imageBaseUrl
    });
    this.fetchFamousAlumni('政界');
  },

  onTabsChange(e) {
    const selectedTab = e.detail.value;
    if (selectedTab === this.data.currentTab) return;
    this.setData({
      currentTab: selectedTab
    });
    this.fetchFamousAlumni(selectedTab);
  },

  // 获取知名校友列表
  fetchFamousAlumni(category) {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'getAlumnus',
      data: {
        action: 'getFamousAlumni',
        category
      },
      success: res => {
        if (res.result.code === 200) {
          const alumniList = res.result.result;
          this.setData({
            alumniList: alumniList
          });
        }
      },
      fail: err => {
        console.error('获取知名校友失败', err);
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
