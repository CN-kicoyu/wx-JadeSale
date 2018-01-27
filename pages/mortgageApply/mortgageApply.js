let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,
    stockwallet: {
      stock_sn: '',
      amount: '',
    },
  },
  stocksnInput: function (e) {   //单号输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if (length >= 1 && length <= 12) {
      that.setData({
        'stockwallet.stock_sn': inputValue,
        btnDisabled: false
      })
    } else {
      that.setData({
        'stockwallet.stock_sn': '',
        btnDisabled: true
      })
    }
  },
  amountInput: function (e) {   //金额输入
    let that = this;
    let inputValue = e.detail.value;
    that.setData({
      'stockwallet.amount': inputValue,
      btnDisabled: false
    })
  },
  bindButtonTap: function () { //提交按钮
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
        title: '提交中',
      })
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/stocks/create?token=' + token;
      let params = that.data.stockwallet;
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
          title: '申请单提交成功！',
          duration: 2000,
        })
        setTimeout(function () {
          wx.hideLoading()
          //跳到界面
          wx.navigateBack({
            url: '../mortgage/mortgage'
          })
        }, 1000)
      }
    }
  },
})