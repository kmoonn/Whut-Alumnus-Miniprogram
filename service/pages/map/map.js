Page({
  data: {
    imageBaseUrl: '',
    latitude: 0,
    longitude: 0,
    markers: [], // 地图上的标记
    units: [], // 存储单位数据
    nearestUnits: [] // 最近的单位
  },

  onLoad: function() {
    const app = getApp();
    this.setData({
      imageBaseUrl: app.globalData.imageBaseUrl
    });
    this.getUserLocation();
  },

  // 获取用户当前位置
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        this.loadUnits(res.latitude, res.longitude);
      },
      fail: () => {
        wx.showToast({ title: '无法获取位置', icon: 'none' });
        this.loadUnits(); // fallback
      }
    });
  },

  loadUnits(userLat = 30.5931, userLng = 114.3054) {
    wx.cloud.callFunction({
      name: 'map',
      data: { action: 'getCompanyList' }, // 获取所有单位
      success: res => {
        if (res.result.success === 200) {
          const units = res.result.result;
          const markers = units.map(unit => ({
            id: unit.id,
            latitude: unit.lat,
            longitude: unit.lng,
            title: unit.company, // 公司名称
            iconPath: '{{imageBaseUrl}}%E5%85%AC%E5%8F%B8.png?sign=06652e48ea9e5c1caf665e1cfea6de93&t=1743831210', // 图标路径
            width: 30,
            height: 30
          }));

          // 排序最近单位
          const unitsWithDistance = units.map(unit => ({
            ...unit,
            distance: this.getDistance(userLat, userLng, unit.lat, unit.lng)
          }));

          const nearestUnits = unitsWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5); // 获取最近的5个单位

          this.setData({
            markers,
            units,
            nearestUnits
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      },
      fail: error => {
        wx.showToast({
          title: '加载单位数据失败',
          icon: 'none'
        });
      }
    });
  },

  getDistance(lat1, lon1, lat2, lon2) {
    const rad = d => d * Math.PI / 180;
    const R = 6371; // 地球半径 km
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // 地图标记点击事件
  onMarkerTap(e) {
    const markerId = e.markerId;
    const company = this.data.units.find(item => item.id === markerId).company;
    wx.navigateTo({
      url: `/service/pages/unit_alumnus/unit_alumnus?company=${company}`
    });
  },

  // 单位列表点击事件
  onUnitTap(e) {
    const id = e.currentTarget.dataset.id;;
    const company = this.data.units.find(item => item.id === id).company;
    console.log(company);
    wx.navigateTo({
      url: `/service/pages/unit_alumnus/unit_alumnus?company=${company}`
    });
  }
});
