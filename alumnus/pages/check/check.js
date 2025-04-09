Page({
  data: {
    imageBaseUrl: '',
    sourceInfo: null,       // 源校友库信息
    pendingInfo: null,      // 疑似校友信息
    pendingCount: 0,        // 待审核数量
    selectedDepartments: [] // 所选择学院
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      imageBaseUrl: app.globalData.imageBaseUrl
    });
  },

  onShow() {
    if (this.data.selectedDepartments.length < 2) {
      this.showAgreement(this.selectDepartment);
    } else {
      this.fetchPendingMatches();
    }
  },

  selectDepartment() {
    wx.navigateTo({
      url: '/alumnus/pages/check/selectDepartment/selectDepartment'
    });
  },

  showAgreement(callback) {
    wx.showModal({
      title: '疑似校友确认要求',
      content: '这里是校友审核要求的内容。',
      showCancel: false,
      confirmText: '我已知晓',
      success: () => {
        if (typeof callback === 'function') {
          callback();
        }
      }
    });
  },

  async fetchPendingMatches() {
    const reviewerId = wx.getStorageSync('userInfo').id;
    try {
      const res = await wx.cloud.callFunction({
        name: 'check',
        data: {
          action: 'getPendingMatches',
          reviewerId
        }
      });

      if (res.result.code === 200) {
        const { sourceAlumnus, pendingAlumnus, pendingCount } = res.result.data;
        pendingAlumnus.birthday = this.formatDate(pendingAlumnus.birthday);
        sourceAlumnus.birthday = this.formatDate(sourceAlumnus.birthday);

        this.setData({
          sourceInfo: sourceAlumnus,
          pendingInfo: pendingAlumnus,
          pendingCount
        });
      } else {
        this.showError(res.result.message || '获取数据失败');
      }
    } catch (err) {
      console.error('获取待匹配数据失败', err);
      this.showError('获取数据失败');
    }
  },

  formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  },

  approveMatch() {
    this.submitMatch('approved');
  },

  rejectMatch() {
    this.submitMatch('rejected');
  },

  async submitMatch(status) {
    const { sourceInfo, pendingInfo } = this.data;
    const reviewerId = wx.getStorageSync('userInfo').id;

    if (!sourceInfo || !pendingInfo) {
      this.showError('没有待匹配数据');
      return;
    }

    wx.showModal({
      title: '确认提交',
      content: status === 'approved'
        ? '确认这两条信息匹配吗？'
        : '确认这两条信息不匹配吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const res = await wx.cloud.callFunction({
              name: 'check',
              data: {
                action: 'submitMatch',
                pendingId: pendingInfo.id,
                reviewerId,
                status
              }
            });
            wx.showToast({ title: res.result.message || '提交成功', icon: 'success' });
            this.fetchPendingMatches();
          } catch (err) {
            console.error('提交匹配结果失败', err);
            this.showError('提交失败');
          }
        }
      }
    });
  },

  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    });
  }
});