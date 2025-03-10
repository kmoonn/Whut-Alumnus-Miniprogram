// alumnus/pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    searchHistory: [],
    alumniList: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取搜索历史
    const history = wx.getStorageSync('searchHistory') || []
    this.setData({ searchHistory: history })
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
    this.setData({
      alumniList: [],
      page: 1,
      hasMore: true
    })
    this.fetchSearchResults().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.hasMore) {
      this.fetchSearchResults()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 输入搜索内容
  onInput(e) {
    this.setData({
      searchValue: e.detail.value
    })
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchValue: '',
      alumniList: [],
      page: 1,
      hasMore: true
    })
  },

  // 搜索
  search() {
    const { searchValue } = this.data
    if (!searchValue.trim()) return

    // 保存搜索历史
    let history = this.data.searchHistory
    if (!history.includes(searchValue)) {
      history.unshift(searchValue)
      if (history.length > 10) history.pop()
      this.setData({ searchHistory: history })
      wx.setStorageSync('searchHistory', history)
    }

    // 重置列表
    this.setData({
      alumniList: [],
      page: 1,
      hasMore: true
    })

    // 开始搜索
    this.fetchSearchResults()
  },

  // 点击搜索历史
  onHistoryTap(e) {
    const { keyword } = e.currentTarget.dataset
    this.setData({ searchValue: keyword }, () => {
      this.search()
    })
  },

  // 清空搜索历史
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ searchHistory: [] })
          wx.removeStorageSync('searchHistory')
        }
      }
    })
  },

  // 获取搜索结果
  async fetchSearchResults() {
    const { searchValue, page, pageSize } = this.data
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const { result } = await wx.cloud.callFunction({
        name: 'search',
        data: {
          keyword: searchValue,
          page,
          pageSize
        }
      })

      const { data, hasMore } = result
      
      this.setData({
        alumniList: [...this.data.alumniList, ...data],
        hasMore,
        page: page + 1,
        loading: false
      })
    } catch (error) {
      console.error('搜索失败：', error)
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    }
  },

  // 查看校友详情
  showDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/alumni/detail?id=${id}`
    })
  }
})