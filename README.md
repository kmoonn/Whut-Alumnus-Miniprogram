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

## 技术栈
- 微信小程序原生开发框架
- 腾讯云开发
- MySQL
- 腾讯地图 API

## 项目结构

WHUT-ALMNUS-MINIPROGRAM
├─alumnus 校友模块
│  └─pages
│      ├─apply
│      ├─check
│      ├─famous
│      └─famous_detail
├─cloudfunctions 云函数
│  ├─apply
│  ├─check
│  ├─getActivity
│  ├─getActivityDetail
│  ├─getAlumnus
│  ├─getAlumnusDetail
│  ├─getCompany
│  ├─getCompanyDetail
│  ├─getNews
│  ├─getVisualData
│  ├─login
│  ├─register
│  └─search
├─components 组件
│  ├─iView
│  └─navigation-bar
├─images 静态资源
├─pages 全局模块
│  ├─index
│  ├─login
│  ├─my
│  ├─service
│  └─utils
├─service 服务模块
│  ├─ec-canvas
│  ├─pages
│  │  ├─activity
│  │  ├─activityDetail
│  │  ├─company
│  │  ├─companyDetail
│  │  ├─nearby
│  │  ├─search
│  │  └─visual
│  └─utils
└─sql 数据库文件

## 版权说明

© 2025 武汉理工大学。保留所有权利。