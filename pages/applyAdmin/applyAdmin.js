let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data:{
    data:{},
  },
  onShow: function () {
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
      let url = app.apiUrl + '/packages/index?id=4';
      app.request.requestGetApi(url, '', that, that.successFun);
    }
  },
  successFun: function (res, selfObj) {
    var that = this;
    var statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        selfObj.setData({
          data: res.data
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  gotoPackage: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../packageDetail/packageDetail?id='+id
    })
  }
})