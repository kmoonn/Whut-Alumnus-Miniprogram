Page({
  data: {
    departmentList: ['计算机学院', '自动化学院', '材料学院', '交通学院', '管理学院'],
    selectedDepartments: []
  },

  onCheckboxChange(e) {
    this.setData({
      selectedDepartments: e.detail.value
    });
  },

  onConfirm() {
    const selected = this.data.selectedDepartments;
    if (selected.length < 2) {
      wx.showToast({
        title: '请至少选择两个学院',
        icon: 'none'
      });
      return;
    }

    // 构建查询参数，将选中的学院信息用逗号连接
    const selectedStr = selected.join(',');
    // 跳转到 check 页面并传递选中的学院信息，同时销毁当前页面
    wx.redirectTo({
      url: `/alumni/pages/check/check?selectedDepartments=${encodeURIComponent(selectedStr)}`
    });
  }
});    