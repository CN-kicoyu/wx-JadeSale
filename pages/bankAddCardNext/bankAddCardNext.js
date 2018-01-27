// pages/bankAddCardNext/bankAddCardNext.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  isChange: function () {
    this.setData({
      isDisabled: true
    })
  },
  gotoNext: function () {
    wx.navigateTo({
      url: "../bankAddCardNext/bankAddCardNext"
    })
  }
})