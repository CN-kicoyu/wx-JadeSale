// pages/exchange/exchange.js
Page({
  data: {},
  onShow: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  gotoShop: function () {
    wx.navigateTo({
      url: "../changeGoods/changeGoods"
    })
  },
  sorryTip: function () {
    wx.showModal({
      title: '温馨提示',
      content: 'sorry/(ㄒoㄒ)/~~，功能暂未开启~',
      showCancel:false
    })
  }
})