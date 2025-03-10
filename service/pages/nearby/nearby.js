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
        latitude,
        longitude,
        radius: 10 // 搜索半径，单位：公里
      },
      success: res => {
        if (res.result.code === 200) {
          const alumniList = res.result.data;
          const markers = alumniList.map((alumni, index) => ({
            id: alumni.id,
            latitude: alumni.latitude,
            longitude: alumni.longitude,
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

  // 点击地图标记
  handleMarkerTap(e) {
    const markerId = e.markerId;
    const alumni = this.data.alumniList.find(item => item.id === markerId);
    if (alumni) {
      this.showAlumniDetail(alumni);
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
    wx.showModal({
      title: alumni.name,
      content: `${alumni.college} · ${alumni.major} · ${alumni.graduate_year}届\n距离：${alumni.distance}km`,
      showCancel: false
    });
  }
})