Page({
  data: {
    alumnusDetail: {} // 用于存储校友详细信息
  },
  onLoad(options) {
    const id = options.id;
    if (id) {
      this.fetchAlumnusDetail(id);
    } else {
      console.error('未获取到有效的 id');
    }
  },
  fetchAlumnusDetail(id) {
    wx.showLoading({ title: '加载中' });
    wx.cloud.callFunction({
        name: 'getAlumnusDetail', // 云函数名称，用于根据 id 查询校友详细信息
        data: {
            id: id
        },
        success: res => {
            if (res.result.code === 200) {
                
                let alumnusDetail = res.result.result;
                // 确保 category 是字符串类型
                this.setData({
                    alumnusDetail: alumnusDetail
                });
                console.log(alumnusDetail);
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