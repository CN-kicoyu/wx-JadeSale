// auctionDetail.js
Page({
  data:{
    tabNav: [
      {
        title: "拍品展示",
        actived: true
      },
      {
        title: "拍品规格",
        actived: false
      },
      {
        title: "竞拍须知",
        actived: false
      }
    ],
    scrollLeft: 0,
    allowMove: true
  },
  onLoad:function(options){
    var $this = this
    wx.getSystemInfo({
      success: function (res) {
        $this.setData({
          phoneWidth: res.windowWidth
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  imgScale: function () {
    wx.previewImage({
      current: '"http://oo3thr1aa.bkt.clouddn.com/detail-5-01.jpg"',
      urls: [
        "http://oo3thr1aa.bkt.clouddn.com/detail-5-01.jpg",
        "http://oo3thr1aa.bkt.clouddn.com/detail-5-02.jpg",
        "http://oo3thr1aa.bkt.clouddn.com/detail-5-03.jpg",
        "http://oo3thr1aa.bkt.clouddn.com/detail-5-04.jpg"
      ]
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
  onMask: function(event) {
    this.setData({
      maskbox: true,
      type: event.currentTarget.dataset.type
    })
  },
  closeBox: function () {
    this.setData({
      maskbox: false
    })
  },
  onBidRink: function () {
    wx.navigateTo({
      url: "../bidRink/bidRink"
    })
  }
})