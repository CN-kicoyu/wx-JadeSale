let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    isActived: false,
    userDetail: {},
    userInfo: {},
  },
  onLoad: function (options) {
    let that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    this.loadPage();
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
  gotoAddress:function(){
    wx.navigateTo({
      url: "../address/address"
    })
  },
  gotoInformation:function(){
    wx.navigateTo({
      url: "../information/information"
    })
  },
  gotoBank:function(){
    wx.navigateTo({
      url: "../bank/bank"
    })
  },
  gotoAccount:function(){
    wx.navigateTo({
      url: "../account/account"
    })
  },
})