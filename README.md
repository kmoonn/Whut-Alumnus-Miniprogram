# Whut-Alumni-Association-Miniprogram

# 武汉理工大学校友会微信小程序

武汉理工大学校友会微信小程序是一个服务于武汉理工大学校友处领导、全校各级部门教职工的服务平台，旨在挖掘知名校友、加强知名校友与母校之间的联系，促进知名校友之间的交流与合作。

## 主要功能

### 1. 重点校友推荐
- 可以申报身边已知校友信息
- 提供便捷的信息填写界面

### 2. 审核校友信息
- 可以查看待审核的校友信息
- 提供详细的审核记录

### 3. 知名校友
- 展示学校知名校友信息
- 按照政商学等多维度分类

### 4. 校友地图
- 查找指定范围内校友工作单位
- 搜索关键字模糊查询校友信息

### 5. 校友活动、校友企业

## 技术栈
- 微信小程序原生开发框架
- 腾讯云开发
- MySQL
- 腾讯地图 API

## 项目结构

```text
WHUT-Alumni-Association-MINIPROGRAM
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

请移步 [dev](https://github.com/kmoonn/Whut-Almnus-Miniprogram/blob/dev/README.md) 分支 

## 2025.4.9 汇报返修意见

1. 重点校友推荐
- [ ] 推荐标准已确定，设置页面提示信息，若内容较长可能需要优化UI
- [ ] 表单修改: 设置必填项，包括姓名、所在地、工作单位、职务；增加联系方式、学院字段
- [ ] 后端逻辑修改：新建数据库表，校友推荐记录写入新表（不在写入统一的待审核校友表），后续人工审核

2. 校友信息审核
- [ ] 用户可选“是校友”、“非校友”、“无法确定”；增加用户输入审核依据（查询档案、本人认识、询问他人、其他）
- [ ] 审核前需要用户选择想审核的学院，至少选择两项
- [ ] 根据待审核校友信息中的专业字段，分类到对应的学院，无专业信息随机分配

3. 校友地图
- [ ] 修改为省市区下潜式地图

4. 其他任务
- [ ] 重构数据库结构
- [ ] 清洗待审核校友数据，优先审核匹配项较少的校友信息
- [ ] 小程序界面介绍、操作说明PPT`DDL:4.14` 

## 版权说明

© 2025 武汉理工大学。保留所有权利。
