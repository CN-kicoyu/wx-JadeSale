let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,
    userIdentity: {
      realname: '',
      idcard: '',
      email: '',
    },
  },
 realNameInput: function (e) {   //真实姓名输入
    let that = this;
    let inputValue = e.detail.value;
    that.setData({
      'userIdentity.realname': inputValue,
      btnDisabled: false
    })
  },
  idcardInput: function (e) {  //身份证输入
    let that = this;
    let inputValue = e.detail.value;
    that.setData({
      'userIdentity.idcard': inputValue,
      btnDisabled: false
    })
 },
  eamilInput: function (e) {   //邮箱
   let that = this;
   let inputValue = e.detail.value;
   that.setData({
     'userIdentity.email': inputValue,
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
      let url = app.apiUrl + '/users/information?token=' + token;
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