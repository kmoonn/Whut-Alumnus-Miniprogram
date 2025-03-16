// 引入腾讯地图 SDK
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;

// 定义一个异步函数来根据工作单位获取经纬度
const getLocationByWorkplace = async (workplace) => {
  if (!workplace) {
    throw new Error('Workplace is required');
  }

  // 设置请求间隔时间为1秒
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    await delay(5000); // 等待1秒
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://apis.map.qq.com/ws/geocoder/v1?key=B4MBZ-4AAKG-YVYQY-QOKDS-TXVHV-Y5FPA&address=${encodeURIComponent(workplace)}`,
        method: 'GET',
        success: (response) => {
          if (response.data.status === 0) {
            const location = response.data.result.location;
            resolve(location); // 返回经纬度
          } else {
            reject(`腾讯地图API查询失败，错误信息：${response.data.message}`);
          }
        },
        fail: (err) => {
          console.error(err);
          reject('请求腾讯地图API失败');
        }
      });
    });
  } catch (err) {
    throw new Error('请求过程中出现错误');
  }
};

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
    this.mapCtx = wx.createMapContext('myMap'); // 初始化地图上下文
    this.getLocation();
  },
  
  // 获取当前位置
  getLocation() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        // 用户授权成功后再调用获取位置函数
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
      fail: () => {
        wx.showToast({
          title: '定位授权失败',
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
      id: alumni.id,
      latitude: alumni.location.lat,
      longitude: alumni.location.lng,
      title: alumni.name,
      iconPath: 'https://636c-cloud1-6gsqyvkd3f24bdd8-1311119192.tcb.qcloud.la/images/Marker.png?sign=6ac9350287c043c55f572495b6680b33&t=1742112695',
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

  // 获取附近的校友
  fetchNearbyAlumni(latitude,longitude) {
    wx.cloud.callFunction({
      name: 'getAlumnus',
      data: {
        category: '%'
      },
      success: async (res) => {
        if (res.result.code === 200) {
          const alumniList = res.result.result;
          const updatedAlumniList = await Promise.all(
            alumniList.map(async (alumni) => {
              try {
                const location = await getLocationByWorkplace(alumni.company);
                if (location) {
                  alumni.location = location;
                  alumni.distance = this.calculateDistance(
                    latitude,
                    longitude,
                    location.lat,
                    location.lng
                  ).toFixed(1);
                } else {
                  alumni.location = { latitude: 0, longitude: 0 };
                  alumni.distance = '0.0';
                }
              } catch (error) {
                console.error('Error fetching location for alumni:', error);
                alumni.location = { latitude: 0, longitude: 0 };
                alumni.distance = '0.0';
              }
              return alumni;
            })
          );

          // 过滤出距离在 10 公里以内的校友
          const maxDistance = 10; // 10 公里
          const filteredAlumniList = updatedAlumniList.filter(alumni => parseFloat(alumni.distance) <= maxDistance);

          this.setData({ alumniList: filteredAlumniList });
          this.updateMarkers(filteredAlumniList);
        }
      },
      fail: err => {
        console.error('获取校友信息失败', err);
        wx.showToast({
          title: '获取校友信息失败',
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
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // 角度转弧度
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  // 点击地图标记
handleMarkerTap(e) {
  const markerId = e.markerId; // 获取被点击的标记的 ID
  const alumni = this.data.alumniList.find(item => item.id === markerId); // 找到对应的校友

  console.log(alumni);

  if (alumni) {
    this.showAlumniDetail(alumni); // 如果找到对应校友，显示其详细信息
  } else {
    console.error('未找到对应的校友信息');
    wx.showToast({
      title: '无法获取校友详情',
      icon: 'none'
    });
  }
},

  // 点击校友列表项
  handleAlumniTap(e) {
    const id = e.currentTarget.dataset.id;
    const alumni = this.data.alumniList.find(item => item.id === id);
    if (alumni) {
      this.showAlumniDetail(alumni);
    }
  },

  // 显示校友详情
showAlumniDetail(alumni) {
  wx.navigateTo({
    url: `/alumnus/pages/famous_detail/famous_detail?id=${alumni.id}` // 跳转到校友详情页面，并传递校友的 ID
  });
},

  // 查看校友详情
  showDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: `/alumnus/pages/famous_detail/famous_detail?id=${id}`
      });
    } else {
      console.error('未获取到有效的 id');
      wx.showToast({
        title: '无法获取校友详情',
        icon: 'none'
      });
    }
  }
});
