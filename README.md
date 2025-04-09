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

# 更新日志

## 2025.3.28 汇报返修意见

~~**三级** : 管理员、校领导、下层各单位教职工~~

~~admin、leader、teacher~~

- [ ] 校友申报

~~类别字段增加“其他”，当选择“其他”时增加“重大荣誉事迹等”输入~~

~~增加必填项“工作单位”，便于按照工作单位维度的地图显示~~

~~增加进入页面弹窗提示信息【校友申报相关标准（政商学界标准、或重大荣誉事迹等）】~~ 

**TODO: 标准具体内容需后续讨论确定**

- [ ] 校友审核

~~信息来源设置为点击跳转网页，新建review_source页面~~

~~增加进入页面弹窗提示信息【校友审核相关要求等】~~ 

**TODO: 标准具体内容需后续讨论确定**

修改获取待审核校友列表云函数，设置为分页查询，每次请求limit 10。

- [ ] 知名校友

~~下拉框增加“其他”选项~~

~~若类别为其他，详情页需要显示相关重大荣誉事迹~~

增加权限控制，用户只能看到自己学院的知名校友（暂定）————> 存在困难，无法界定以往校友所在学院

- [ ] 附近校友 ——> 校友地图

~~提前查询工作单位进行地址解析，写入数据库经纬度字段，替代实时查询。~~

~~增加**工作单位维度**的校友定位信息【校友地图】，在地图上标记工作单位，点击后显示该单位校友数量情况。~~

- [ ] 数据库设计

~~新建apply_note表，记录用户校友申报记录。~~

~~修改apply云函数逻辑，支持“其他”类别申报，同时写入用户申报记录到apply_note表~~

~~修改user表role字段，更改权限。~~

~~修改famous_alumnus表，增加lat，lng经纬度字段。~~

~~知名校友增加一个deeds字段（存储重大荣誉或事迹）~~

~~修改pending_alumnus表，增加deeds字段~~

~~知名校友类别需要设置为多选，对应的云函数做出修改。~~

- [ ] UI

~~使用TDesign组件库，修改“提示信息”弹窗等UI显示~~

~~知名校友部分，使用标签栏替代侧边栏~~

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
