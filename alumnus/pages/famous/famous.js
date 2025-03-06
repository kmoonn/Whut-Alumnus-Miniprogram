Page({
  data: {
    famousAlumni: [],       // 全部校友数据
    filteredAlumni: [],     // 经过筛选的数据
    searchQuery: '',        // 搜索框中的输入内容
    selectedField: '',      // 选择的查询字段（姓名、性别等）
    searchFields: ['姓名', '性别', '毕业年份', '学院', '专业', '所在地','工作单位'],  // 可供选择的查询字段
  },

  onLoad() {
    this.getFamousAlumni();
  },

  // 获取知名校友数据
  getFamousAlumni() {
    wx.cloud.callFunction({
      name: 'getAlumnus',
      success: res => {
        this.setData({
          famousAlumni: res.result,
          filteredAlumni: res.result // 初始显示全部数据
        });
      },
      fail: err => {
        console.error(err);
      }
    });
  },

  // 用户选择查询字段
  onFieldChange(e) {
    const selectedField = this.data.searchFields[e.detail.value];
    this.setData({
      selectedField
    });
  },

  // 搜索框输入实时更新
  onSearchInput(e) {
    const query = e.detail.value.trim();
    this.setData({ searchQuery: query });
    this.filterAlumni();
  },

  // 根据选择的字段和输入的内容进行过滤
  filterAlumni() {
    const { searchQuery, selectedField, famousAlumni } = this.data;

    if (!selectedField || !searchQuery) {
      this.setData({
        filteredAlumni: famousAlumni
      });
      return;
    }

    const filtered = famousAlumni.filter(alumni => {
      switch (selectedField) {
        case '姓名':
          return alumni.name.includes(searchQuery);
        case '性别':
          return alumni.gender.includes(searchQuery);
        case '毕业年份':
          return alumni.graduate_year.includes(searchQuery);
        case '学院':
          return alumni.college.includes(searchQuery);
        case '专业':
          return alumni.major.includes(searchQuery);
        case '工作单位':
          return alumni.company.includes(searchQuery);
        default:
          return true;
      }
    });

    this.setData({
      filteredAlumni: filtered
    });
  }
});
