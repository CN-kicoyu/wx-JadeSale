let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,
    amount: '',
    appinfo:'',
    wallet:'',
    coin:'',
  },
  onShow:function(){
    this.loadPage()
  },
  loadPage: function () { //按钮
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/wallets/identity?token=' + token;
      app.request.requestGetApi(url, '', that, that.successLoadFun);
    }
  },
  successLoadFun: function (res, selfObj) {
    console.log(res)
    let statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        let walletList = res.data.wallet;
        let wallet = 0;
        let coin = 0;
        for (var i = 0; i < walletList.length;i++){
          if (walletList[i].type == 3){
            wallet = walletList[i].balance
          }
          if (walletList[i].type == 4) {
            coin = walletList[i].balance
          }
        }
        this.setData({
          appinfo: res.data,
          wallet: wallet,
          coin: coin,
        })
      }
    }
  },
  amountInput: function (e) {   //金额输入
    let that = this;
    let inputValue = e.detail.value;
    that.setData({
      'amount': inputValue,
      btnDisabled: false
    })
  },
  bindButtonTap: function () { //按钮
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
        title: '兑换中',
      })
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/wallets/exchange?token=' + token + '&amount=' + this.data.amount;
      app.request.requestGetApi(url, '', that, that.successFun);
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
          title: '兑换成功！',
          duration: 2000,
        })
        setTimeout(function () {
          wx.hideLoading()
          //跳到界面
          wx.reLaunch({
            url: '../wallet/wallet'
          })
        }, 1000)
      }
    }
  },
})