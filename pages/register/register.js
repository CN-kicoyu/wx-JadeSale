// register.js
let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,

    userRegister: {
      username: '',
      password: '',
      confirm_pwd: '',
      mobile:'',
      invite_code:'',
    },
  },
  onLoad:function(){
    let $this = this;
  },
  nameInput: function (e) {   //用户名输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if (length >= 2 && length <= 12) {
      that.setData({
        'userRegister.username': inputValue,
      })
    } else {
      that.setData({
        'userRegister.username': '',
      })
    }
  },
  mobileInput: function (e) {  //手机号输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if ((/^1[34578]\d{9}$/.test(inputValue))) {
      that.setData({
        'userRegister.mobile': inputValue,
      })
    } else {
      that.setData({
        'userRegister.mobile': '',
      })
    }
  },
  inviteCodeInput:function(e){  //邀请码
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if (length >= 6 && length <= 12) {
      that.setData({
        'userRegister.invite_code': inputValue,
      })
    } else {
      that.setData({
        'userRegister.invite_code': '',
      })
    }
  },
  pwdInput: function (e) {   //密码输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if (length >= 6 && length <= 20) {
      that.setData({
        'userRegister.password': inputValue,
         btnDisabled: false
      })
    } else {
      that.setData({
        'userRegister.password': '',
         btnDisabled: true
      })
    }
  },
  confirmPwdInput: function (e) {   //确认密码输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if (length >= 6 && length <= 20) {
      if (util.isEmpty(that.data.userRegister.password)){
        wx.showToast({
          title: '请先输入密码',
          duration: 2000,
        })
      }
      if (inputValue != that.data.userRegister.password){
        wx.showToast({
          title: '两次密码不一致',
          duration: 2000,
        })
      }
      that.setData({
        'userRegister.confirm_pwd': inputValue,
        btnDisabled: false
      })
    } else {
      that.setData({
        'userRegister.confirm_pwd': '',
        btnDisabled: true
      })
    }
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
        title: '注册中',
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            let url = app.apiUrl + '/users/signup?code=' + res.code;
            let params = that.data.userRegister;
            app.request.requestPostApi(url, params, that, that.successFun);
          }else {
            wx.showToast({
              title: '微信登录失败',
              duration: 2000,
            })
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })
    }
  },
  successFun: function (res, selfObj) {
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
          title: '注册成功！',
          duration: 2000,
        })
        let token = res.data.token;
        let status = res.data.status;
        let weixin = res.data.openid;
        try {
          wx.setStorageSync('token', token);
        } catch (e) {
        }
        //跳到界面
        wx.reLaunch({
          url: '../firstRead/firstRead'
        })
      }
    }
  },
  goSignin: function () {
    wx.navigateTo({
      url: '../signIn/signIn'
    })
  }
})