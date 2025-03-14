Page({
  data: {
    latitude: 0,
    longitude: 0,
    scale: 14,
    markers: [],
    alumniList: []
  },

  onLoad(options) {
    this.getLocation();
  },

  onReady() {

  },

  onShow() {

  },

  onHide() {

  },

  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 获取当前位置
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        this.fetchNearbyAlumni(res.latitude, res.longitude);
      },
      fail: () => {
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        });
      }
    });
  },

  // 获取附近校友
  fetchNearbyAlumni(latitude, longitude) {
    wx.cloud.callFunction({
      name: 'nearby',
      data: {
        action: 'getNearbyAlumni',
        location: {
          latitude,
          longitude
        },
        radius: 10 // 搜索半径，单位：公里
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
          
          const markers = alumniList.map(alumni => ({
            id: alumni._id,
            latitude: alumni.location.latitude,
            longitude: alumni.location.longitude,
            title: alumni.name,
            iconPath: '/images/marker.png',
            width: 30,
            height: 30
          }));

          this.setData({
            alumniList,
            markers
          });
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