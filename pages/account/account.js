let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,
    userIdentity: {
      trading_code: '',
      trading_name: '',
    },
  },
  nameInput: function (e) {   //用户名输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if (length >= 1 && length <= 12) {
      that.setData({
        'userIdentity.trading_name': inputValue,
        btnDisabled: false
      })
    } else {
      that.setData({
        'userIdentity.trading_name': '',
        btnDisabled: true
      })
    }
  },
  codeInput: function (e) {   //账号输入
    let that = this;
    let inputValue = e.detail.value;
    that.setData({
      'userIdentity.trading_code': inputValue,
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
        title: '绑定中',
      })
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/addidentity?token=' + token;
      let params = that.data.userIdentity;
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
        wx.showToast({
          title: '绑定成功！',
          duration: 2000,
        })
        setTimeout(function () {
          wx.hideLoading()
          //跳到界面
          wx.reLaunch({
            url: '../personal/personal'
          })
        }, 1000)
      }
    }
  },
})