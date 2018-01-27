// pages/stockMore/stockMore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goBack: function () {
    wx.navigateTo({
      url: "../stocks/stocks"
    })
  },
  reduceNum: function () {
    this.setData({
      isNum: this.data.isNum - 1
    })
  },
  addNum: function () {
    this.setData({
      isNum: this.data.isNum + 1
    })
  }
})