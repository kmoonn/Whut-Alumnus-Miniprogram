const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 获取校友地理分布数据
async function getMapData() {
  const { data } = await db.collection('alumni')
    .aggregate()
    .group({
      _id: '$province',
      count: _.sum(1)
    })
    .end();
  
  return data.map(item => ({
    name: item._id,
    value: item.count
  }));
}

// 获取学院分布数据
async function getCollegeData() {
  const { data } = await db.collection('alumni')
    .aggregate()
    .group({
      _id: '$college',
      count: _.sum(1)
    })
    .end();
  
  return data.map(item => ({
    name: item._id,
    value: item.count
  }));
}

// 获取专业分布数据
async function getMajorData() {
  const { data } = await db.collection('alumni')
    .aggregate()
    .group({
      _id: '$major',
      count: _.sum(1)
    })
    .sort({
      count: -1
    })
    .limit(10)
    .end();
  
  return data.map(item => ({
    name: item._id,
    value: item.count
  }));
}

// 获取毕业年份分布数据
async function getYearData() {
  const { data } = await db.collection('alumni')
    .aggregate()
    .group({
      _id: '$graduate_year',
      count: _.sum(1)
    })
    .sort({
      _id: 1
    })
    .end();
  
  return data.map(item => ({
    name: item._id + '届',
    value: item.count
  }));
}

// 获取行业分布数据
async function getIndustryData() {
  const { data } = await db.collection('alumni')
    .aggregate()
    .group({
      _id: '$industry',
      count: _.sum(1)
    })
    .end();
  
  return data.map(item => ({
    name: item._id,
    value: item.count
  }));
}

exports.main = async (event, context) => {
  try {
    const [mapData, collegeData, majorData, yearData, industryData] = await Promise.all([
      getMapData(),
      getCollegeData(),
      getMajorData(),
      getYearData(),
      getIndustryData()
    ]);

    return {
      mapData,
      collegeData,
      majorData,
      yearData,
      industryData
    };
  } catch (error) {
    console.error('获取可视化数据失败：', error);
    return {
      error: error.message
    };
  }
}; 