// 引入腾讯地图 SDK
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;

Page({
  data: {
    latitude: 0,
    longitude: 0,
    scale: 14,
    markers: [],
    alumniList: [],
    mapKey: 'LKOBZ-6VB3T-RDEXO-VEWKW-WIDI2-QKBMO', 
    mapCenter: {
      latitude: 0,
      longitude: 0
    },
    polyline: [],
    controls: []
  },

  onLoad(options) {
    // 初始化腾讯地图 SDK
    qqmapsdk = new QQMapWX({
      key: this.data.mapKey
    });
    this.getLocation();
  },
  
  // 获取当前位置 
  getLocation() {
    wx.authorize({
      scope: 'scope.userLocation',
      success() {
        // 用户授权成功后再调用获取位置函数
        this.getLocation();
      },
      fail() {
        wx.showToast({
          title: '定位授权失败',
          icon: 'none'
        });
      }
    });

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          mapCenter: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
        // 获取位置信息
        this.getLocationInfo(res.latitude, res.longitude);
        this.fetchNearbyAlumni(res.latitude, res.longitude);
      },
      fail: (err) => {
        console.log('获取位置失败', err);
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    });
  },

  // 获取位置信息
  getLocationInfo(latitude, longitude) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: (res) => {
        console.log('位置信息：', res.result);
      },
      fail: (err) => {
        console.error('获取位置信息失败：', err);
      }
    });
  },

  // 更新标记点
  updateMarkers(alumniList) {
    const markers = alumniList.map(alumni => ({
      id: alumni._id,
      latitude: alumni.location.latitude,
      longitude: alumni.location.longitude,
      title: alumni.name,
      iconPath: '/images/marker.png',
      width: 30,
      height: 30,
      callout: {
        content: alumni.name,
        padding: 10,
        borderRadius: 5,
        display: 'BYCLICK'
      }
    }));

    this.setData({ markers });
  },

  // 地图区域改变事件
  regionchange(e) {
    if (e.type === 'end' && e.causedBy === 'drag') {
      // 获取新的地图中心点
      this.mapCtx.getCenterLocation({
        success: (res) => {
          this.fetchNearbyAlumni(res.latitude, res.longitude);
        }
      });
    }
  },

  // 修改 fetchNearbyAlumni 函数
  fetchNearbyAlumni(latitude, longitude) {
    wx.cloud.callFunction({
      name: 'getNearby',
      data: {
        action: 'getNearbyAlumnus',
        location: {
          latitude,
          longitude
        },
        radius: 10
      },
      success: res => {
        if (res.result.code === 200) {
          const alumniList = res.result.data.map(alumni => ({
            ...alumni,
            distance: this.calculateDistance(
              latitude,
              longitude,
              alumni.location.latitude,
              alumni.location.longitude
            ).toFixed(1)
          }));
          
          this.setData({ alumniList });
          this.updateMarkers(alumniList);
        }
      },
      fail: err => {
        console.error('获取附近校友失败', err);
        wx.showToast({
          title: '获取附近校友失败',
          icon: 'none'
        });
      }
    });
  },

  // 计算两点之间的距离（单位：公里）
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（公里）
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  // 角度转弧度
  deg2rad(deg) {
    return deg * (Math.PI/180);
  },

  // 点击地图标记
  handleMarkerTap(e) {
    const markerId = e.markerId;
    const alumni = this.data.alumniList.find(item => item._id === markerId);
    if (alumni) {
      this.showAlumniDetail(alumni);
    }
  },

  // 点击校友列表项
  handleAlumniTap(e) {
    const id = e.currentTarget.dataset.id;
    const alumni = this.data.alumniList.find(item => item._id === id);
    if (alumni) {
      this.showAlumniDetail(alumni);
    }
  },

  // 显示校友详情
  showAlumniDetail(alumni) {
    wx.showModal({
      title: alumni.name,
      content: `${alumni.college} · ${alumni.major} · ${alumni.graduateYear}届\n${alumni.company}\n${alumni.position}\n距离：${alumni.distance}km`,
      showCancel: false
    });
  }
})