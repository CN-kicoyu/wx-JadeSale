let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    appinfo:{},
  },
  onShow:function(){
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
      let url = app.apiUrl + '/user-banks/index?token=' + token;
      app.request.requestGetApi(url, '', this, this.userBankSuccess)
    }
  },
  userBankSuccess: function (res, selfObj) {
    console.log(res)
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          'appinfo': res.data,
        })
      }
    }
  },
  gotoAddBank:function(){
    wx.navigateTo({
      url: '../bankAddCard/bankAddCard',
    })
  }
})