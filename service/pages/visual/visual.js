import * as echarts from '../../ec-canvas/echarts';
import { getVisualData } from '../../utils/api';

let mapChart = null;
let collegeChart = null;
let majorChart = null;
let yearChart = null;
let industryChart = null;

function initMapChart(canvas, width, height, dpr) {
  mapChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(mapChart);

  const option = {
    title: {
      text: '校友地理分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    visualMap: {
      min: 0,
      max: 100,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true
    },
    series: [{
      name: '校友分布',
      type: 'map',
      map: 'china',
      roam: true,
      emphasis: {
        label: {
          show: true
        }
      },
      data: []
    }]
  };

  mapChart.setOption(option);
  return mapChart;
}

function initCollegeChart(canvas, width, height, dpr) {
  collegeChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(collegeChart);

  const option = {
    title: {
      text: '学院分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: '学院分布',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  collegeChart.setOption(option);
  return collegeChart;
}

function initMajorChart(canvas, width, height, dpr) {
  majorChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(majorChart);

  const option = {
    title: {
      text: '专业分布TOP10',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [],
      type: 'bar'
    }]
  };

  majorChart.setOption(option);
  return majorChart;
}

function initYearChart(canvas, width, height, dpr) {
  yearChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(yearChart);

  const option = {
    title: {
      text: '毕业年份分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [],
      type: 'line',
      smooth: true
    }]
  };

  yearChart.setOption(option);
  return yearChart;
}

function initIndustryChart(canvas, width, height, dpr) {
  industryChart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(industryChart);

  const option = {
    title: {
      text: '行业分布',
      left: 'center'
    },
    tooltip: {},
    radar: {
      indicator: []
    },
    series: [{
      name: '行业分布',
      type: 'radar',
      data: [{
        value: [],
        name: '校友数量'
      }]
    }]
  };

  industryChart.setOption(option);
  return industryChart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapEc: {
      onInit: initMapChart
    },
    collegeEc: {
      onInit: initCollegeChart
    },
    majorEc: {
      onInit: initMajorChart
    },
    yearEc: {
      onInit: initYearChart
    },
    industryEc: {
      onInit: initIndustryChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.fetchVisualData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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

  async fetchVisualData() {
    try {
      const data = await getVisualData();
      
      // 更新地图数据
      mapChart.setOption({
        series: [{
          data: data.mapData
        }]
      });

      // 更新学院分布数据
      collegeChart.setOption({
        series: [{
          data: data.collegeData
        }]
      });

      // 更新专业分布数据
      majorChart.setOption({
        xAxis: {
          data: data.majorData.map(item => item.name)
        },
        series: [{
          data: data.majorData.map(item => item.value)
        }]
      });

      // 更新毕业年份分布数据
      yearChart.setOption({
        xAxis: {
          data: data.yearData.map(item => item.name)
        },
        series: [{
          data: data.yearData.map(item => item.value)
        }]
      });

      // 更新行业分布数据
      industryChart.setOption({
        radar: {
          indicator: data.industryData.map(item => ({
            name: item.name,
            max: Math.max(...data.industryData.map(d => d.value))
          }))
        },
        series: [{
          data: [{
            value: data.industryData.map(item => item.value)
          }]
        }]
      });
    } catch (error) {
      console.error('获取可视化数据失败：', error);
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
    }
  }
})