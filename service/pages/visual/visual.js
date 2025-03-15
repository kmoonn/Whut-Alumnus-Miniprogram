import * as echarts from '../../ec-canvas/echarts';

let mapChart = null;
let categoryChart = null;

// 地图初始化函数
function initMapChart(canvas, width, height, dpr) {
  mapChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(mapChart);
  return mapChart;
}

// 饼图初始化函数
function initCategoryChart(canvas, width, height, dpr) {
  categoryChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(categoryChart);
  return categoryChart;
}

Page({
  data: {
    mapEc: {
      onInit: initMapChart
    },
    categoryEc: {
      onInit: initCategoryChart
    }
  },

  onLoad: function() {
    this.loadVisualData();
  },

  loadVisualData: function() {
    wx.showLoading({
      title: '加载中'
    });

    wx.cloud.callFunction({
      name: 'getVisualData',
    }).then(res => {
      console.log('云函数返回:', res);
      
      if (res.result && res.result.success) {
        this.setChartData(res.result.data);
      } else {
        console.error('云函数执行失败:', res.result);
        wx.showToast({
          title: res.result?.error || '数据加载失败',
          icon: 'none',
          duration: 3000
        });
      }
    }).catch(err => {
      console.error('请求错误:', err);
      wx.showToast({
        title: '网络请求失败',
        icon: 'none',
        duration: 3000
      });
    }).finally(() => {
      wx.hideLoading();
    });
  },

  setChartData: function(data) {
    // 设置地图数据
    const mapOption = {
      visualMap: {
        min: 0,
        max: 100,
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d']
        }
      },
      series: [{
        type: 'map',
        mapType: 'china',
        label: {
          show: true
        },
        data: data.locationData.map(item => ({
          name: item.province,
          value: item.count
        }))
      }]
    };

    // 设置饼图数据
    const collegeOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: '60%',
        data: data.fieldData.map(item => ({
          name: item.field,
          value: item.count
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };

    mapChart.setOption(mapOption);
    collegeChart.setOption(collegeOption);
  }
});