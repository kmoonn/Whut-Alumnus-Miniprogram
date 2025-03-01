// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: "cloud1-6gsqyvkd3f24bdd8",
      traceUser: true
    });

    console.log("云开发环境初始化成功");
  }
});


