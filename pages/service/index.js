Page({
  data: {
    imageBaseUrl: '',
    fullServiceList: [],
    visibleServiceList: []
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      imageBaseUrl: app.globalData.imageBaseUrl
    });
    
    const fullList = [
      {
        name: '重点校友推荐',
        icon: 'apply.png',
        path: '/alumnus/pages/apply/apply',
        key: 'apply'
      },
      {
        name: '疑似校友确认',
        icon: 'check.png',
        path: '/alumnus/pages/check/check',
        key: 'check'
      },
      {
        name: '知名校友',
        icon: 'famous.png',
        path: '/alumnus/pages/famous/famous',
        key: 'famous'
      },
      {
        name: '找校友',
        icon: 'search.png',
        path: '/service/pages/search/search',
        key: 'search'
      },
      {
        name: '校友地图',
        icon: 'map.png',
        path: '/service/pages/map/map',
        key: 'map'
      }
    ];

    const userInfo = wx.getStorageSync('userInfo');
    const userRole = userInfo ? userInfo.role : null;

    let userPermissions = [];

    if (userRole === 'admin' || userRole === 'leader') {
      userPermissions = ['apply', 'check', 'famous', 'search', 'map'];
    } else {
      userPermissions = ['apply', 'check'];
    }

    const visible = fullList.filter(item => userPermissions.includes(item.key));

    this.setData({
      fullServiceList: fullList,
      visibleServiceList: visible
    });
  },

  navigateTo(e) {
    const path = e.currentTarget.dataset.path;
    wx.navigateTo({
      url: path
    });
  }
});
