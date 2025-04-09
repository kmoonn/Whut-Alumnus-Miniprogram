Page({
  data: {
    sourceInfo: null,       // 源校友库信息
    pendingInfo: null,      // 待审核校友信息
    pendingCount: 0,         // 待审核数量
    selectedDepartments: []
  },

  // 页面生命周期：onLoad 拉取数据，onShow 展示须知
  onLoad() {
    this.fetchPendingMatches();
  },

  onShow() {
    console.log(this.data.selectedDepartments);
    if (!this.data.selectedDepartments || this.data.selectedDepartments.length < 2) {
      this.showAgreement(() => {
        this.selectDepartment();  // 用户阅读须知后再选学院
      });
    } else {
      this.fetchPendingMatches();  // 已经选过学院则直接拉数据
    }
  },

  selectDepartment() {
    wx.navigateTo({
      url: '/alumnus/pages/check/selectDepartment/selectDepartment'
    });
  },

  // 弹出审核须知
  showAgreement(callback) {
    wx.showModal({
      title: '校友审核要求须知',
      content: '这里是校友审核要求的内容哦。',
      showCancel: false,
      confirmText: '我已阅读',
      success: () => {
        if (typeof callback === 'function') {
          callback();
        }
      }
    });
  },

  // 获取一组待匹配的校友信息
  fetchPendingMatches() {
    const reviewerId = wx.getStorageSync('userInfo').id;

    wx.cloud.callFunction({
      name: 'check',
      data: {
        action: 'getPendingMatches',
        reviewerId
      },
      success: res => {
        if (res.result.code === 200) {
          let { sourceAlumnus, pendingAlumnus, pendingCount } = res.result.data;

          // 格式化出生日期（源与待审核）
          const formatDate = date => {
            let d = new Date(date);
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
          };

          pendingAlumnus.birthday = formatDate(pendingAlumnus.birthday);
          sourceAlumnus.birthday = formatDate(sourceAlumnus.birthday);

          this.setData({
            sourceInfo: sourceAlumnus,
            pendingInfo: pendingAlumnus,
            pendingCount
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

  // 审核通过
  approveMatch() {
    this.submitMatch('approved');
  },

  // 审核不通过
  rejectMatch() {
    this.submitMatch('rejected');
  },

  // 提交审核结果
  submitMatch(status) {
    const { sourceInfo, pendingInfo } = this.data;
    const reviewerId = wx.getStorageSync('userInfo').id;

    if (!sourceInfo || !pendingInfo) {
      wx.showToast({ title: '没有待匹配数据', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认提交',
      content: status === 'approved'
        ? '确认这两条信息匹配吗？'
        : '确认这两条信息不匹配吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'check',
            data: {
              action: 'submitMatch',
              pendingId: pendingInfo.id,
              reviewerId,
              status
            },
            success: res => {
              wx.showToast({ title: res.result.message || '提交成功', icon: 'success' });
              this.fetchPendingMatches(); // 加载下一组
            },
            fail: err => {
              console.error('提交匹配结果失败', err);
              wx.showToast({ title: '提交失败', icon: 'none' });
            }
          });
        }
      }
    });
  }
});
