let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,

    userAgent: {
      content: '',
    },
  },
  concentInput: function (e) {   //申请理由输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    that.setData({
      'userAgent.content': inputValue,
      btnDisabled: false
    })
  },
  bindButtonTap: function () { //注册按钮
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      this.setData({
        isloading: !this.data.isloading
      })
      wx.showLoading({
        title: '提交申请中',
      })
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/agents/create?token=' + token;
      let params = that.data.userAgent;
      app.request.requestPostApi(url, params, that, that.successFun);
    }
  },
  successFun: function (res, selfObj) {
    console.log(res)
    let statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        this.setData({
          isloading: false
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        this.setData({
          isloading: false
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: '已提交申请！',
          duration: 2000,
        })
        //跳到界面
        wx.reLaunch({
          url: '../personal/personal'
        })
      }
    }
  },
})