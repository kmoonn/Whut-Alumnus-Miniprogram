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

    // 回传到上一个页面
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];

    prevPage.setData({
      selectedDepartments: selected
    });

    wx.navigateBack();
  }
});
