Page({
  data: {
    newsList: [], // 新闻列表
    activities: [], // 活动列表
    companies: [] // 公司列表
  },

  onLoad() {
    this.fetchData();
  },

  onPullDownRefresh() {
    this.fetchData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async fetchData() {
    try {
      const [newsList, activities, companies] = await Promise.all([
        getNewsList(),
        getActivities(),
        getCompanies()
      ]);

      this.setData({
        newsList,
        activities,
        companies
      });
    } catch (error) {
      console.error('获取首页数据失败：', error);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
  },

  navigateTo(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  }
});

// 模拟获取新闻列表
function getNewsList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newsList = [
        { id: 1, title: '社会合作处赴天津开展调研活动', date: '2025-03-03', imageUrl: 'https://alumni.whut.edu.cn/upload/wxb/static/2025/03/03/bdb8eebc0fe5456483c85e58eb6c722e.png' },
        { id: 2, title: '武汉理工大学校友企业家联谊会成立发展座谈会圆满举行', date: '2025-03-03', imageUrl: 'https://alumni.whut.edu.cn/upload/wxb/static/2025/03/03/3b4080983db148baac257359f3bc4ccf.png' }
      ];
      resolve(newsList);
    }, 1000);
  });
}

// 模拟获取活动列表
function getActivities() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activities = [
        { id: 1, title: '郑州校友会举行第一届亲子运动会', day: '24', month: '12月', location: '', status: '已结束' },
        { id: 2, title: '郑州校友会走访河南外服人力资源有限公司', day: '24', month: '12月', location: '', status: '已结束' }
      ];
      resolve(activities);
    }, 1000);
  });
}

// 模拟获取公司列表
function getCompanies() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const companies = [
        { id: 1, name: '校友科技', industry: '', logo: 'https://636c-cloud1-6gsqyvkd3f24bdd8-1311119192.tcb.qcloud.la/images/default-avatar.jpg' },
        { id: 2, name: '校友金融', industry: '', logo: 'https://636c-cloud1-6gsqyvkd3f24bdd8-1311119192.tcb.qcloud.la/images/default-avatar.jpg' }
      ];
      resolve(companies);
    }, 1000);
  });
}