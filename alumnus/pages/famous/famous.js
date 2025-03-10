Page({
  data: {
    currentTab: 'politics', // 当前选中的标签
    alumniList: [] // 校友列表
  },

  onLoad() {
    this.fetchFamousAlumni('politics');
  },

  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    this.fetchFamousAlumni(tab);
  },

  // 获取知名校友列表
  fetchFamousAlumni(category) {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
      name: 'famous',
      data: {
        action: 'getFamousAlumni',
        category
      },
      success: res => {
        if (res.result.code === 200) {
          this.setData({
            alumniList: res.result.data
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
    const alumni = this.data.alumniList.find(item => item.id === id);
    if (alumni) {
      wx.showModal({
        title: alumni.name,
        content: `性别：${alumni.gender}\n` +
                `毕业年份：${alumni.graduate_year}届\n` +
                `学院：${alumni.college}\n` +
                `专业：${alumni.major}\n` +
                `工作单位：${alumni.company}\n` +
                `职务：${alumni.position}\n` +
                `所在地：${alumni.region}\n`,
        showCancel: false
      });
    }
  }
});
