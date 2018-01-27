let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data: {
    imgUrls: [],
    scrollshow: {
      isExhibit: true,
      data: [
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-1.jpg",
          "title": "通天珠宝高冰玉器专场",
          "begainTime": "2017.04.11",
          "overTime": "2017.04.21",
          "status": 1,
          "hasNum": 298,
          "displayID": 2017050001
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-2.jpg",
          "title": "通天珠宝陶瓷烤漆专场",
          "begainTime": "2017.05.11",
          "overTime": "2017.05.21",
          "status": 0,
          "hasNum": 323,
          "displayID": 2017050002
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-1.jpg",
          "title": "通天珠宝高冰玉器专场",
          "begainTime": "2017.04.11",
          "overTime": "2017.04.21",
          "status": 0,
          "hasNum": 298,
          "displayID": 2017050003
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-1.jpg",
          "title": "通天珠宝高冰玉器专场",
          "begainTime": "2017.04.11",
          "overTime": "2017.04.21",
          "status": 1,
          "hasNum": 298,
          "displayID": 2017050004
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-1.jpg",
          "title": "通天珠宝高冰玉器专场",
          "begainTime": "2017.04.11",
          "overTime": "2017.04.21",
          "status": 0,
          "hasNum": 298,
          "displayID": 2017050005
        }
      ]
    },
    scrollgoods: {
      isExhibit: false,
      data: [
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-3.jpg",
          "title": "简约沙发"
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-4.jpg",
          "title": "多彩雕品"
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-5.jpg",
          "title": "静美水彩"
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-3.jpg",
          "title": "通天珠宝"
        },
        {
          "imgURL": "http://oo3thr1aa.bkt.clouddn.com/auction-4.jpg",
          "title": "高冰玉器"
        }
      ]
    },
    isLove: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.loadBanner()
  },
  loadBanner: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/banners/index?type=1';
      app.request.requestGetApi(url, '', this, this.successBannerFun);
    }
  },
  successBannerFun: function (res, selfObj) {
    console.log(res);
    if (res.code == 200) {
      let data = res.data;
      selfObj.setData({
        imgUrls: data
      })
    }
  },
  onLoving: function () {
    this.setData({
      isLove: !isLove
    })
  },
  onGoingBid: function (event) {
    wx.navigateTo({
      url: "../goingBid/goingBid?section" + event.currentTarget.dataset.section
    })
  },
  onDisplayDetail: function (event) {
    wx.navigateTo({
      url: "../displayDetail/displayDetail?id" + event.currentTarget.dataset.id
    })
  },
  onAuctionDetail: function () {
    wx.navigateTo({
      url: "../auctionDetail/auctionDetail"
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