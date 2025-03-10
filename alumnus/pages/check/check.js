Page({
  data: {
    alumniInfo: null,
    searchInfo: null,
    pendingCount: 0
  },

  onLoad() {
    this.fetchPendingMatches();
  },

  // 获取待匹配的信息对
  fetchPendingMatches() {
    wx.cloud.callFunction({
      name: 'check',
      data: { 
        action: 'getPendingMatches',
        reviewerId: wx.getStorageSync('userId')
      },
      success: res => {
        if (res.result.code === 200) {
          this.setData({
            alumniInfo: res.result.data.alumniInfo,
            searchInfo: res.result.data.searchInfo,
            pendingCount: res.result.data.count
          });
        }
      },
      fail: err => console.error('获取待匹配数据失败', err)
    });
  },

  // 确认信息匹配
  approveMatch() {
    this.submitMatch(1); // 1 表示信息匹配
  },

  // 确认信息不匹配
  rejectMatch() {
    this.submitMatch(0); // 0 表示信息不匹配
  },

  // 提交匹配结果
  submitMatch(status) {
    if (!this.data.alumniInfo || !this.data.searchInfo) {
      wx.showToast({ title: '没有待匹配数据', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认提交',
      content: status === 1 ? '确认这两条信息匹配吗？' : '确认这两条信息不匹配吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'check',
            data: {
              action: 'submitMatch',
              alumniId: this.data.alumniInfo.id,
              searchId: this.data.searchInfo.id,
              reviewerId: wx.getStorageSync('userId'),
              status: status
            },
            success: res => {
              wx.showToast({ title: res.result.message, icon: 'success' });
              this.fetchPendingMatches(); // 获取下一组待匹配数据
            },
            fail: err => console.error('提交匹配结果失败', err)
          });
        }
      }
    });
  }
});
