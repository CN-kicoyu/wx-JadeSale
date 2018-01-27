// pages/market/market.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onMarketPerson: function () {
    wx.navigateTo({
      url: "../marketPersonal/marketPersonal"
    })
  },
  onProductDetail: function () {
    wx.navigateTo({
      url: "../productDetail/productDetail"
    })
  },
  onMarketDetail: function () {
    wx.navigateTo({
      url: "../marketDetail/marketDetail"
    })
  }
})