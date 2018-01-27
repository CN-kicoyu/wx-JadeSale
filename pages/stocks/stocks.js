// pages/stocks/stocks.js
Page({
  data:{
    isGuess: 1
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  gotoRecord: function () {
    wx.navigateTo({
      url: "../record/record"
    })
  },
  onGuess: function (event) {
    let that = this;
    var $index = event.currentTarget.dataset.num
    that.setData({
      isGuess: $index
    })
  },
  gotoRecharge: function () {
    wx.navigateTo({
      url: "../recharge/recharge"
    })
  }
})