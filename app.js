App({
  onLaunch() {
    wx.cloud.init({
      env: "cloud1-6gsqyvkd3f24bdd8",
      traceUser: true
    });
    },
    globalData: {
      imageBaseUrl: 'https://636c-cloud1-6gsqyvkd3f24bdd8-1311119192.tcb.qcloud.la/images/'
    }
});


