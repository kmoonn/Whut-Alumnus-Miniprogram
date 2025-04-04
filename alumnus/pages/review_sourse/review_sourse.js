Page({
  data: {
    url: ''  // 存储网页地址
  },

  onLoad(options) {
    try {
      // 1. 解码 URL 参数
      const url = options.url || options.source || '';
      if (!url) throw new Error('URL 参数为空');

      console.log('解码前的URL:', url);
      const decodedUrl = decodeURIComponent(url);
      console.log('解码后的URL:', decodedUrl);

      // 2. 直接设置 URL
      this.setData({ url: decodedUrl });

    } catch (e) {
      console.error('加载失败:', e);
      wx.showToast({ title: '网页地址无效', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  }
});