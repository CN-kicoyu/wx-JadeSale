let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data: {
    userDetail: {},
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.id,
      'userDetail': {},
    })
    this.loadPage()
  },
  loadPage: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/user-profile?token=' + token;
      app.request.requestGetApi(url, '', this, this.userDetailSuccess)
    }
  },
  userDetailSuccess: function (res, selfObj) {
    console.log(res)
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          'userDetail': res.data,
        })
      }
    }
  },
  gotoStocks: function () {
    wx.navigateTo({
      url: "../stocks/stocks"
    })
  },
  gotoAgainst: function () {
    wx.navigateTo({
      url: "../against/against"
    })
  },
  gotoAuction: function () {
    wx.navigateTo({
      url: "../auction/auction"
    })
  },
  gotoMarket: function () {
    wx.navigateTo({
      url: "../market/market"
    })
  },
  gotoTravel: function () {
    wx.navigateTo({
      url: "../travel/travel"
    })
  }
})