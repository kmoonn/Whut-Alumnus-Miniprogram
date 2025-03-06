module.exports = {
  MYSQL: {
    host: '124.223.63.202',      // 你的 MySQL 地址
    user: 'wut815',      // MySQL 用户名
    password: 'zdd.410@K39Y@sct.815', // MySQL 密码
    database: 'whutalumnus_miniprogram', // MySQL 数据库
    port: 3306                    // 端口号，默认为 3306
  },
  APP_CONFIG: {
    reviewThreshold: 3, // 例如：需要多少个审核员通过，才能最终通过
    maxReviewBatch: 10  // 例如：每次获取 10 条待审核数据
  }
};
