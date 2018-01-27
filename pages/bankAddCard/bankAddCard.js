let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,
    appinfo: {},
    bankIndex:'',
    bankName:'',
    bankArray:{},
    bankCode:{},
    bank:{
      bank_id:'',
      bank_card:'',
      bank_of_deposit:'',
      bank_user:'',
    }
  },
  onShow: function () {
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
      let url = app.apiUrl + '/user-banks/view';
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
        var item = res.data;
        var name = [];
        var code = [];
        for (var i = 0; i < item.length; i++) {
          code.push(item[i].id);
          name.push(item[i].bank_name);
        }
        this.setData({
          'appinfo': item,
          bankArray: name,
          bankCode: code,
          bankIndex: 0,
          bankName: name[0],
          'bank.bank_id': code[0]
        })
      }
    }
  },
  bindBankChange: function (e) {
    this.setData({
      'bankIndex': e.detail.value,
      'bankName': this.data.bankArray[e.detail.value],
      'bank.bank_id': this.data.bankCode[e.detail.value],
    })
  },
  depositInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'bank.bank_of_deposit': inputValue,
      'btnDisabled':false
    });
  },
  userInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'bank.bank_user': inputValue,
      'btnDisabled': false
    });
  },
  cardInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'bank.bank_card': inputValue,
      'btnDisabled': false
    });
  },
  bindButtonTap: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      this.setData({
        isloading: !this.data.isloading
      })
      let token = wx.getStorageSync('token');
      let url = app.apiUrl + '/user-banks/create?token=' + token;
      let params = that.data.bank;
      app.request.requestPostApi(url, params, this, this.successFun)
    }
  },
  successFun: function (res, selfObj) {
    let statu = res.code;
    let message = res.msg;
    if (statu == 200) {
      if (res.data.error) {
        this.setData({
          isloading: false
        })
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          isloading: false
        })
        wx.showToast({
          title: "保存成功",
        })
        wx.navigateBack({
          url: '../bank/bank'
        })
      }
    }
  }
})