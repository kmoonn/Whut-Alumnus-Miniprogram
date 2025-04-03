// 引入腾讯地图 SDK
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

// 配置常量
const CONFIG = {
  MAP_KEY: 'LKOBZ-6VB3T-RDEXO-VEWKW-WIDI2-QKBMO',
  MARKER_ICON: 'https://636c-cloud1-6gsqyvkd3f24bdd8-1311119192.tcb.qcloud.la/images/Marker.png?sign=6ac9350287c043c55f572495b6680b33&t=1742112695',
  MAX_DISTANCE: 10, // 最大距离（公里）
  EARTH_RADIUS: 6371, // 地球半径（公里）
  MAP_SCALE: 14,
  LOCATION_DELAY: 300, // 获取位置延迟（毫秒）
  BATCH_SIZE: 5, // 批量处理校友数据的大小
  RATE_LIMIT: {
    REQUESTS_PER_SECOND: 5, // 每秒最大请求数
    MAX_RETRIES: 3, // 最大重试次数
    RETRY_DELAY: 2000 // 重试延迟（毫秒）
  },
  CACHE_EXPIRATION: 24 * 60 * 60 * 1000 // 缓存过期时间（24小时）
};

// 位置缓存
const locationCache = {
  // 缓存数据
  cache: {},

  // 获取缓存
  get: function (key) {
    const item = this.cache[key];
    if (!item) return null;

    // 检查缓存是否过期
    if (Date.now() - item.timestamp > CONFIG.CACHE_EXPIRATION) {
      delete this.cache[key];
      return null;
    }

    return item.data;
  },

  // 设置缓存
  set: function (key, data) {
    this.cache[key] = {
      data: data,
      timestamp: Date.now()
    };
  }
};

// 请求限流器
const rateLimiter = {
  queue: [],
  running: 0,
  lastRequestTime: 0,

  // 添加请求到队列
  add: function (fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        fn,
        resolve,
        reject,
        retries: 0
      });
      this.process();
    });
  },

  // 处理队列
  process: async function () {
    if (this.running >= CONFIG.RATE_LIMIT.REQUESTS_PER_SECOND || this.queue.length === 0) {
      return;
    }

    // 计算需要等待的时间
    const now = Date.now();
    const timeToWait = Math.max(0, 1000 / CONFIG.RATE_LIMIT.REQUESTS_PER_SECOND - (now - this.lastRequestTime));

    if (timeToWait > 0) {
      await Utils.delay(timeToWait);
    }

    this.running++;
    const task = this.queue.shift();
    this.lastRequestTime = Date.now();

    try {
      const result = await task.fn();
      task.resolve(result);
    } catch (error) {
      // 如果失败且未超过最大重试次数，则重新加入队列
      if (error.message && error.message.includes('请求量已达到上限') &&
        task.retries < CONFIG.RATE_LIMIT.MAX_RETRIES) {
        task.retries++;
        console.log(`重试请求 (${task.retries}/${CONFIG.RATE_LIMIT.MAX_RETRIES})...`);
        await Utils.delay(CONFIG.RATE_LIMIT.RETRY_DELAY);
        this.queue.unshift(task);
      } else {
        task.reject(error);
      }
    } finally {
      this.running--;
      this.process(); // 处理下一个请求
    }
  }
};

// 工具函数
const Utils = {
  // 延迟函数
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // 角度转弧度
  deg2rad: (deg) => deg * (Math.PI / 180),

  // 计算两点之间的距离（单位：公里）
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const dLat = Utils.deg2rad(lat2 - lat1);
    const dLon = Utils.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(Utils.deg2rad(lat1)) * Math.cos(Utils.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return CONFIG.EARTH_RADIUS * c;
  },

  // 根据工作单位获取经纬度
  getLocationByWorkplace: async (workplace) => {
    if (!workplace) {
      throw new Error('工作单位信息缺失');
    }

    // 检查缓存
    const cacheKey = workplace.trim().toLowerCase();
    const cachedLocation = locationCache.get(cacheKey);
    if (cachedLocation) {
      console.log(`使用缓存的位置信息: ${workplace}`);
      return cachedLocation;
    }

    // 使用限流器发送请求
    return rateLimiter.add(async () => {
      try {
        const location = await new Promise((resolve, reject) => {
          wx.request({
            url: `https://apis.map.qq.com/ws/geocoder/v1?key=${CONFIG.MAP_KEY}&address=${encodeURIComponent(workplace)}`,
            method: 'GET',
            success: (response) => {
              if (response.data.status === 0) {
                const location = response.data.result.location;
                resolve(location);
              } else {
                reject(new Error(`腾讯地图API查询失败，错误信息：${response.data.message}`));
              }
            },
            fail: (err) => {
              console.error('请求腾讯地图API失败:', err);
              reject(new Error('请求腾讯地图API失败'));
            }
          });
        });

        // 缓存结果
        if (location) {
          locationCache.set(cacheKey, location);
        }

        return location;
      } catch (err) {
        console.error(`获取位置过程中出现错误 (${workplace}):`, err);
        throw err;
      }
    });
  },

  // 处理校友数据批次
  processBatch: async (batch, userLat, userLng) => {
    return Promise.all(batch.map(async (alumni) => {
      try {
        if (!alumni.company) {
          alumni.location = { lat: 0, lng: 0 };
          alumni.distance = '0.0';
          return alumni;
        }

        const location = await Utils.getLocationByWorkplace(alumni.company);

        if (location) {
          alumni.location = location;
          alumni.distance = Utils.calculateDistance(
            userLat,
            userLng,
            location.lat,
            location.lng
          ).toFixed(1);
        } else {
          alumni.location = { lat: 0, lng: 0 };
          alumni.distance = '0.0';
        }
      } catch (error) {
        console.error(`处理校友 ${alumni.name} 的位置信息失败:`, error);
        alumni.location = { lat: 0, lng: 0 };
        alumni.distance = '0.0';
      }
      return alumni;
    }));
  },

  // 预处理校友数据，过滤掉无效数据
  preprocessAlumniList: (alumniList) => {
    // 过滤掉没有公司信息的校友
    return alumniList.filter(alumni => alumni && alumni.company);
  }
};

Page({
  data: {
    latitude: 0,
    longitude: 0,
    scale: CONFIG.MAP_SCALE,
    markers: [],
    alumniList: [],
    mapKey: CONFIG.MAP_KEY,
    mapCenter: {
      latitude: 0,
      longitude: 0
    },
    polyline: [],
    controls: [],
    isLoading: false,
    loadingText: '加载中...',
    processedCount: 0,
    totalCount: 0
  },

  // 生命周期函数
  onLoad(options) {
    this.initMap();
    this.getLocation();

    // 尝试从本地存储加载缓存
    this.loadCacheFromStorage();
  },

  onUnload() {
    // 保存缓存到本地存储
    this.saveCacheToStorage();
  },

  // 加载缓存
  loadCacheFromStorage() {
    try {
      const cacheData = wx.getStorageSync('locationCache');
      if (cacheData) {
        const parsedCache = JSON.parse(cacheData);
        // 只加载未过期的缓存
        for (const key in parsedCache) {
          if (Date.now() - parsedCache[key].timestamp <= CONFIG.CACHE_EXPIRATION) {
            locationCache.cache[key] = parsedCache[key];
          }
        }
        console.log('已从本地存储加载位置缓存');
      }
    } catch (e) {
      console.error('加载缓存失败:', e);
    }
  },

  // 保存缓存
  saveCacheToStorage() {
    try {
      wx.setStorageSync('locationCache', JSON.stringify(locationCache.cache));
      console.log('已将位置缓存保存到本地存储');
    } catch (e) {
      console.error('保存缓存失败:', e);
    }
  },

  // 初始化地图
  initMap() {
    // 初始化腾讯地图 SDK
    this.qqmapsdk = new QQMapWX({
      key: this.data.mapKey
    });
    this.mapCtx = wx.createMapContext('myMap');
  },

  // 获取当前位置
  getLocation() {
    this.setData({
      isLoading: true,
      loadingText: '获取位置中...'
    });

    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            const { latitude, longitude } = res;

            this.setData({
              latitude,
              longitude,
              mapCenter: {
                latitude,
                longitude
              }
            });

            // 获取附近的校友
            this.fetchNearbyAlumni(latitude, longitude);
          },
          fail: (err) => {
            console.error('获取位置失败:', err);
            this.setData({ isLoading: false });
            wx.showToast({
              title: '获取位置失败',
              icon: 'none'
            });
          }
        });
      },
      fail: (err) => {
        console.error('获取位置授权失败:', err);
        this.setData({ isLoading: false });
        wx.showModal({
          title: '提示',
          content: '需要获取您的位置才能显示附近校友，请授权位置权限',
          showCancel: false
        });
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
      iconPath: CONFIG.MARKER_ICON,
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
      this.mapCtx.getCenterLocation({
        success: (res) => {
          this.fetchNearbyAlumni(res.latitude, res.longitude);
        }
      });
    }
  },

  // 获取附近的校友
  async fetchNearbyAlumni(latitude, longitude) {
    this.setData({
      isLoading: true,
      loadingText: '获取校友数据中...',
      processedCount: 0,
      totalCount: 0
    });

    try {
      const result = await wx.cloud.callFunction({
        name: 'getAlumnus',
        data: {
          category: '%'
        }
      });

      if (result.result.code === 200) {
        let alumniList = result.result.result;

        // 预处理校友数据
        alumniList = Utils.preprocessAlumniList(alumniList);

        this.setData({
          totalCount: alumniList.length,
          loadingText: `正在处理校友数据 (0/${alumniList.length})...`
        });

        // 批量处理校友数据以提高性能
        const processedAlumni = [];
        for (let i = 0; i < alumniList.length; i += CONFIG.BATCH_SIZE) {
          const batch = alumniList.slice(i, i + CONFIG.BATCH_SIZE);
          const processedBatch = await Utils.processBatch(batch, latitude, longitude);
          processedAlumni.push(...processedBatch);

          // 更新进度
          this.setData({
            processedCount: Math.min(i + CONFIG.BATCH_SIZE, alumniList.length),
            loadingText: `正在处理校友数据 (${Math.min(i + CONFIG.BATCH_SIZE, alumniList.length)}/${alumniList.length})...`
          });

          // 每处理一批次就更新一次界面，提高用户体验
          if (i % (CONFIG.BATCH_SIZE * 5) === 0 && i > 0) {
            const currentFiltered = processedAlumni.filter(
              alumni => parseFloat(alumni.distance) <= CONFIG.MAX_DISTANCE
            );

            this.setData({
              alumniList: currentFiltered
            });

            this.updateMarkers(currentFiltered);
          }
        }

        // 过滤出距离在最大距离以内的校友
        const filteredAlumniList = processedAlumni.filter(
          alumni => parseFloat(alumni.distance) <= CONFIG.MAX_DISTANCE
        );

        this.setData({
          alumniList: filteredAlumniList,
          isLoading: false
        });

        this.updateMarkers(filteredAlumniList);

        // 保存缓存
        this.saveCacheToStorage();
      } else {
        throw new Error('获取校友数据失败');
      }
    } catch (err) {
      console.error('获取校友信息失败:', err);
      this.setData({ isLoading: false });
      wx.showToast({
        title: '获取校友信息失败',
        icon: 'none'
      });
    }
  },

  // 点击地图标记
  handleMarkerTap(e) {
    const markerId = e.markerId;
    const alumni = this.data.alumniList.find(item => item.id === markerId);

    if (alumni) {
      this.showAlumniDetail(alumni);
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
    if (!alumni || !alumni.id) {
      wx.showToast({
        title: '校友信息不完整',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/alumnus/pages/famous_detail/famous_detail?id=${alumni.id}`
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