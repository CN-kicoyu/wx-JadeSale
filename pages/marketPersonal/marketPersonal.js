var goodsData = require("../../mock/index-goods")
Page({
  data:{},
  onLoad: function (options) {
    var dataTmp = goodsData.initGoods
    this.setData({
      initData: dataTmp,
      num: 0
    })
  },
  onReachBottom: function () {
    if (this.data.num < 1) {
      var goodArray = this.data.initData
      var newGoods = goodsData.indexGoods;
      goodArray = goodArray.concat(newGoods)
      wx.showLoading({
        title: "正在加载"
      })
      wx.showNavigationBarLoading();
      setTimeout(() => {
        this.setData({
          initData: goodArray,
          num: this.data.num + 1
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }, 2000)
    } else {
      wx.showToast({
        title: "商品已全部加载"
      })
    }
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})