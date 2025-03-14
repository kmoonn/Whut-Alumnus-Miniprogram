Page({
  data: {
    showSidebar: false,
    Sidebartrigger: true,
    currentTab: '政治', // 当前选中的标签
    alumniList: [] // 校友列表
  },

  //显示侧边栏 关闭侧边栏触发器
  toggleSidebar: function() {
    this.setData({
      showSidebar: !this.data.showSidebar,
      Sidebartrigger: !this.data.Sidebartrigger
    });
  },

  onLoad() {
    this.fetchFamousAlumni('政界');
  },

  // 切换标签
  switchTab(e) {
    this.setData({ 
      currentTab: e.currentTarget.dataset.tab,
      showSidebar:!this.data.showSidebar,
      Sidebartrigger:!this.data.Sidebartrigger
    }, () => {
      this.fetchFamousAlumni(this.data.currentTab);
    });
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
          console.log('获取到的校友列表数据:', alumniList);
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
    if (id) {
        wx.navigateTo({
            url: `/alumnus/pages/famous_detail/famous_detail?id=${id}`
        });
    } else {
        console.error('未获取到有效的 id');
    }
}
 });
