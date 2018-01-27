// pages/goingBid/goingBid.js
var goodsData = require("../../mock/auction-goods")
var displayData = require("../../mock/auction-display")
var historyData = require("../../mock/auction-history")

Page({
  data: {
    tabNavbar: [{
      title: "热拍中"
    },
    {
      title: "专场拍卖"
    },
    {
      title: "竞拍预览"
    },
    {
      title: "历史拍卖"
    }
    ],
    subNavbar: [{
      title: "单品拍卖",
      actived: true
    },
    {
      title: "专场热销",
      actived: false
    }
    ],
    imgUrls: [
      "http://oo3thr1aa.bkt.clouddn.com/index-intro-1.jpg",
      "http://oo3thr1aa.bkt.clouddn.com/index-intro-2.jpg",
      "http://oo3thr1aa.bkt.clouddn.com/index-intro-3.jpg"
    ]
  },
  onShow: function (options) {
    var dataTmp = goodsData.initGoods
    var tmp1 = []
    var tabData = this.data.tabNavbar;
    for (var i = 0; i < tabData.length; i++) {
      tabData[i].actived = i == true;
      //tabData[i].actived = i == options.section ? true : false;
    }
    var displayTmp = displayData.indexDisplay
    var historyTmp = historyData.indexGoods
    this.setData({
      initData: dataTmp,
      displayTmp: displayTmp,
      historyTmp: historyTmp,
      tabNavbar: tabData,     
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
  changeTab: function (event) {
    var currentIndex = event.currentTarget.dataset.change
    var oldData = this.data.tabNavbar;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == currentIndex ? true : false;
    }
    this.setData({
        tabNavbar: oldData
      })
  },
  changesubTab: function (event) {
    var currentIndex = event.currentTarget.dataset.change
    var oldData = this.data.subNavbar;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == currentIndex ? true : false;
    }
    this.setData({
        subNavbar: oldData
      })
  },
  goToDetail: function () {
    wx.navigateTo({
      url: "/pages/productDetail/productDetail"
    })
  },
  onAuctionDetail: function () {
    wx.navigateTo({
      url: "../auctionDetail/auctionDetail"
    })
  },
  onDisplayDetail: function (event) {
    wx.navigateTo({
      url: "../displayDetail/displayDetail?id" + event.currentTarget.dataset.id
    })
  },
})