# Whut-Almnus-Miniprogram

# 武汉理工大学校友微信小程序

武汉理工大学校友微信小程序是一个面向武汉理工大学校友的服务平台，旨在加强校友与母校之间的联系，促进校友之间的交流与合作。

## 主要功能

### 1. 申报校友信息
- 可以申报身边已知校友信息
- 提供便捷的信息填写界面

### 2. 审核疑似校友
- 可以查看待审核的校友信息
- 提供详细的审核记录

### 3. 知名校友查看
- 展示学校杰出校友信息
- 按照政商学等多维度筛选

### 4. 校友信息查找
- 获取当前位置，查找指定范围内校友信息
- 搜索关键字模糊查询校友信息

### 5. 校友活动、校友企业

## 技术栈
- 微信小程序原生开发框架
- 腾讯云开发
- MySQL
- 腾讯地图 API

## 项目结构

```text
WHUT-ALMNUS-MINIPROGRAM
├─ alumnus 校友模块
│  └─ pages
│     ├─ apply
│     ├─ check
│     ├─ famous
│     └─ famous_detail
├─ cloudfunctions 云函数
│  ├─ apply
│  ├─ check
│  ├─ getActivity
│  ├─ getActivityDetail
│  ├─ getAlumnus
│  ├─ getAlumnusDetail
│  ├─ getCompany
│  ├─ getCompanyDetail
│  ├─ getNews
│  ├─ getVisualData
│  ├─ login
│  ├─ register
│  └─ search
├─ components 组件
│  ├─ iView
│  └─ navigation-bar
├─ images 静态资源
├─ pages 全局模块
│  ├─ index
│  ├─ login
│  ├─ my
│  ├─ service
│  └─ utils
├─ service 服务模块
│  ├─ ec-canvas
│  ├─ pages
│  │  ├─ activity
│  │  ├─ activityDetail
│  │  ├─ company
│  │  ├─ companyDetail
│  │  ├─ nearby
│  │  ├─ search
│  │  └─ visual
│  └─ utils
└─ sql 数据库文件
```

# 更新日志

## 2025.3.28 汇报返修意见

### 权限修改

**三级** : 管理员、校领导、下层各单位教职工

### 功能模块

- [ ] 校友申报

类别字段增加“其他”，当选择“其他”时增加“重大荣誉事迹等”输入

增加必填项“工作单位”，便于按照工作单位维度的地图显示

增加进入页面弹窗提示信息【校友申报相关标准（政商学界标准、或重大荣誉事迹等）】

- [ ] 校友审核

信息来源设置为点击跳转网页

增加进入页面弹窗提示信息【校友审核相关要求等】

- [ ] 知名校友

下拉框增加“其他”选项

若类别为其他，详情页需要显示相关重大荣誉事迹

增加权限控制，用户只能看到自己学院的知名校友（暂定）————> 存在困难，无法界定以往校友所在学院

- [ ] 附近校友

提前查询工作单位进行地址解析，写入数据库经纬度字段，替代实时查询。

增加**工作单位维度**的校友定位信息，在地图上标记工作单位，点击后显示该单位校友数量情况。


## 版权说明

© 2025 武汉理工大学。保留所有权利。
