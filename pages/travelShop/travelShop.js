// pages/productDetail/productDetail.js
Page({
  data: {
    tabNav: [
      {
        title: "商品展示",
        actived: true
      },
      {
        title: "商品规格",
        actived: false
      },
      {
        title: "商品评价",
        actived: false
      }
    ],
    scrollLeft: 0,
    allowMove: true
  },
  onLoad: function (options) {
    var $this = this
    wx.getSystemInfo({
      success: function (res) {
        $this.setData({
          phoneWidth: res.windowWidth
        })
      }
    })
  },
  imgScale: function () {
    wx.previewImage({
      current: '"http://oo3thr1aa.bkt.clouddn.com/detail-6-01.jpg"',
      urls: [
        "http://oo3thr1aa.bkt.clouddn.com/detail-6-01.jpg",
        "http://oo3thr1aa.bkt.clouddn.com/detail-6-02.jpg",
        "http://oo3thr1aa.bkt.clouddn.com/detail-6-03.jpg",
        "http://oo3thr1aa.bkt.clouddn.com/detail-6-04.jpg"
      ]
    })
  },
  giveWidth: function (event) {
    this.setData({
      scrollHeight: parseInt(event.detail.height) + parseInt(180),
      scrollWidth: event.detail.width
    })
  },
  changePosition: function (event) {
    var $index = event.currentTarget.dataset.change;
    var oldData = this.data.tabNav;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == $index ? true : false;
    }
    this.setData({
      tabNav: oldData,
      scrollLeft: this.data.phoneWidth * $index
    })
  },
  goToBasket: function () {
    wx.switchTab({
      url: "/pages/basket/basket"
    })
  },
  cancleScroll: function () {
    this.setData({
      allowMove: false
    })
  },
  openScroll: function () {
    this.setData({
      allowMove: true
    })
  },
  onTravelList: function () {
    wx.navigateTo({
      url: "../travelList/travelList"
    })
  }
})