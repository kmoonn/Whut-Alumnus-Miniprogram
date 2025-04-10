Page({
  data: {
    imageBaseUrl: '',
    sourceInfo: null,       // 源校友库信息
    pendingInfo: null,      // 疑似校友信息
    pendingCount: 0,        // 待审核数量
    receivedDepartments: [] // 所选择学院
  },

  onLoad: function(options) {
    const app = getApp();
    this.setData({
      imageBaseUrl: app.globalData.imageBaseUrl
    });
    // 从查询参数中获取选中的学院信息
    const selectedStr = options.selectedDepartments;
    if (selectedStr) {
      const receivedDepartments = decodeURIComponent(selectedStr).split(',');
      this.setData({
        receivedDepartments:receivedDepartments
      });
    }
  },

  onShow() {
      this.fetchPendingMatches();
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
          reviewerId: reviewerId
        }
      });

      if (res.result.code === 200) {
        const { sourceAlumni, pendingAlumni, pendingCount } = res.result.data;
        pendingAlumni.birthday = this.formatDate(pendingAlumni.birthday);
        sourceAlumni.birthday = this.formatDate(sourceAlumni.birthday);

        this.setData({
          sourceInfo: sourceAlumni,
          pendingInfo: pendingAlumni,
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
    const options = ['查询档案', '本人认识', '询问他人', '其他'];

    wx.showActionSheet({
      itemList: options,
      title: '审核依据',
      success: async (res) => {
        let reviewBasis;
        if (res.tapIndex === options.length - 1) {
          const inputRes = await new Promise(resolve => {
            wx.showModal({
              title: '审核依据 - 其他',
              editable: true,
              placeholderText: '请输入具体内容',
              confirmText: '确认',
              cancelText: '取消',
              success: resolve
            });
          });
          if (inputRes.confirm) {
            reviewBasis = inputRes.content;
          } else {
            return;
          }
        } else {
          reviewBasis = options[res.tapIndex];
        }
        if (reviewBasis) {
          const confirmRes = await new Promise(resolve => {
            wx.showModal({
              title: '确认选择',
              content: `你选择的审核依据是：${reviewBasis}`,
              confirmText: '确认',
              cancelText: '取消',
              success: resolve
            });
          });
          if (!confirmRes.confirm) {
            return;
          }
          try {
            const cloudRes = await wx.cloud.callFunction({
              name: 'check',
                data: {
                  action: 'submitMatch',
                  pendingId: pendingInfo.id,
                  reviewerId,
                  status,
                  reviewBasis
                }
            });
            wx.showToast({ title: cloudRes.result.message || '提交成功', icon: 'success' });
            this.fetchPendingMatches();
          } catch (err) {
            console.error('提交匹配结果失败', err);
            this.showError('提交失败');
          }
        }
      },
      fail: (err) => console.error('显示操作菜单失败', err)
    });
    
  },
    

  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none'
    });
  }
});