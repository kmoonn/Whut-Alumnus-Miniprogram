import * as echarts from '../../ec-canvas/echarts';
import geoJson from './mapData.js';

const app = getApp();

function initMapChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  echarts.registerMap('china', geoJson);

  const option = {
    geo: {
      map: 'china',
      roam: true,  // 允许缩放和平移
      label: {
        show: true,
        fontSize: 8,  // 调小字体以适应小程序
        color: '#000'
      }
    },
    series: [{
      type: 'map',
      mapType: 'china',
      label: {
        show: true,
        fontSize: 8
      },
      itemStyle: {
        normal: {
          borderColor: '#389BB7',
          areaColor: '#F3F3F3',  // 更改默认颜色使地图更清晰
          borderWidth: 1
        },
        emphasis: {
          areaColor: '#389BB7',
          borderWidth: 0
        }
      },
      animation: false,
      data: [
        { name: '北京', value: 100 },
        { name: '上海', value: 80 },
        { name: '广东', value: 90 }
      ]
    }]
  };

  chart.setOption(option);

  return chart;
}

function initCategoryChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['20%', '40%'],
      data: [{
        value: 55,
        name: '政界'
      }, {
        value: 20,
        name: '商界'
      }, {
        value: 20,
        name: '学界'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    mapEc: {
      onInit: initMapChart
    },
    categoryEc: {
      onInit: initCategoryChart
    },
  },

  onReady() {
  }
});