// 获取轮播图
export const getBanners = () => {
  return wx.cloud.callFunction({
    name: 'getBanners'
  });
};

// 获取校友动态
export const getNewsList = () => {
  return wx.cloud.callFunction({
    name: 'getNewsList'
  });
};

// 获取活动列表
export const getActivities = () => {
  return wx.cloud.callFunction({
    name: 'getActivities'
  });
};

// 获取校友风采
export const getStories = () => {
  return wx.cloud.callFunction({
    name: 'getStories'
  });
};

// 获取校友企业
export const getCompanies = () => {
  return wx.cloud.callFunction({
    name: 'getCompanies'
  });
};

// 获取可视化数据
export const getVisualData = () => {
  return wx.cloud.callFunction({
    name: 'visual'
  });
}; 