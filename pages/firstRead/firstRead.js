let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data:{
    dataInfo:{}
  },
  onShow: function () {
    this.loadPage()
  },
  loadPage: function () { //注册按钮
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/articles/index?id=1';
      app.request.requestGetApi(url, '', that, that.successFun);
    }
  },
  successFun: function (res, selfObj) {
    console.log(res.data)
    var that =this;
    var statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        that.setData({
          dataInfo:res.data
        })
        WxParse.wxParse('article_content', 'html', res.data.content, that, 5);
      }
    }
  },
  bindButtonTap:function(){
    wx.navigateTo({
      url: '../applyAdmin/applyAdmin'
    })
  }

})