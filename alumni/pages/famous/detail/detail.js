Page({
  data: {
    alumniDetail: {} // 用于存储校友详细信息
  },
  onLoad(options) {
    const id = options.id;
    if (id) {
      this.fetchAlumniDetail(id);
    } else {
      console.error('未获取到有效的 id');
    }
  },
  fetchAlumniDetail(id) {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
        name: 'service', // 云函数名称，用于根据 id 查询校友详细信息
        data: {
          action: 'getAlumniDetail',
          id: id
        },
        success: res => {
            if (res.result.code === 200) {
                
                let alumniDetail = res.result.result;
                this.setData({
                    alumniDetail: alumniDetail
                });
                console.log(alumniDetail);
            } else {
                wx.showToast({
                    title: res.result.message,
                    icon: 'none'
                });
            }
        },
        fail: err => {
            console.error('获取校友详情失败', err);
            wx.showToast({
                title: '获取数据失败',
                icon: 'none'
            });
        },
        complete: () => {
            wx.hideLoading();
        }
    });
  } 
});