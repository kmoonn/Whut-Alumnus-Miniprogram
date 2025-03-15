Page({
  data: {
    sourceInfo: null,
    pendingInfo: null,
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
        reviewerId: wx.getStorageSync('userInfo').id
      },
      success: res => {
        if (res.result.code === 200) {
          const { sourceAlumnus, pendingAlumnus, pendingCount } = res.result.data;
          this.setData({
            sourceInfo: sourceAlumnus,  // 源校友库信息
            pendingInfo: pendingAlumnus, // 待审核校友信息
            pendingCount: pendingCount  // 待审核数量（已匹配source_id的记录数）
          });
        } else {
          wx.showToast({
            title: res.result.message || '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('获取待匹配数据失败', err);
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
    });
  },

  // 确认信息匹配
  approveMatch() {
    this.submitMatch('approved'); // 表示信息匹配
  },

  // 确认信息不匹配
  rejectMatch() {
    this.submitMatch('rejected'); // 0 表示信息不匹配
  },

  // 提交匹配结果
  submitMatch(status) {
    if (!this.data.sourceInfo || !this.data.pendingInfo) {
      wx.showToast({ title: '没有待匹配数据', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认提交',
      content: status === 'approved' ? '确认这两条信息匹配吗？' : '确认这两条信息不匹配吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'check',
            data: {
              action: 'submitMatch',
              pendingId: this.data.pendingInfo.id,
              reviewerId: wx.getStorageSync('userInfo').id,
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
