Page({
  data: {
    pendingAlumni: [],
    pendingCount: 0
  },

  onLoad() {
    this.fetchPendingAlumni();
  },
  

  // 获取 10 条待审核校友信息
  fetchPendingAlumni() {
    wx.cloud.callFunction({
      name: 'check',
      data: { action: 'getPending', reviewerId: wx.getStorageSync('userId') },
      success: res => {
        if (res.result.code === 200) {
          this.setData({
            pendingAlumni: res.result.data,
            pendingCount: res.result.data.length
          });
        }
      },
      fail: err => console.error('获取待审核数据失败', err)
    });
     
  },

  // 标记为真实校友
  approveAlumni() {
    this.submitReview(1); // 1 表示真实校友
  },

  // 标记为非真实校友
  rejectAlumni() {
    this.submitReview(0); // 0 表示非真实校友
  },

  // 提交审核结果
  submitReview(status) {
    if (this.data.pendingAlumni.length === 0) {
      wx.showToast({ title: '没有待审核数据', icon: 'none' });
      return;
    }
    wx.cloud.callFunction({
      name: 'check',
      data: {
        action: 'submitReview',
        alumniId: this.data.pendingAlumni[0].id,
        reviewerId: wx.getStorageSync('userId'),
        status: status // 1 表示真实校友，0 表示非真实校友
      },
      success: res => {
        wx.showToast({ title: res.result.message, icon: 'success' });
        this.data.pendingAlumni.shift(); // 移除已审核的校友
        this.setData({
          pendingAlumni: this.data.pendingAlumni,
          pendingCount: this.data.pendingAlumni.length
        });
    
        if (this.data.pendingAlumni.length < 5) {
          this.fetchPendingAlumni(); // 补充新的待审核数据
        }
      },
      fail: err => console.error('提交审核失败', err)
    });
    
  }
});
