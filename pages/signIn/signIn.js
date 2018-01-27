// signIn.js
let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    userLogin: {
      username: '',
      password: ''
    },
    isloading: false,
    code:''
  },
  getCode: function () {
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            'code': res.code
          });
        } else {
          wx.showToast({
            title: '微信登录失败',
            duration: 2000,
            mask: true,
          })
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  onShow: function () {
    try {
      wx.setStorageSync('token', '')
    } catch (e) {
    }
    this.getCode()
  },
  userInput: function (e) {  //用户名输入
    let inputValue = e.detail.value;
    this.setData({
      'userLogin.username': inputValue
    });
  },
  pswInput: function (e) {   //密码输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    if (length >= 6 && length <= 20) {
      that.setData({
        'userLogin.password': inputValue,
        btnDisabled: false
      })
    }
  },
  bindButtonTap: function () { //登陆按钮
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
        mask: true,
      })
    } else {
      that.getCode();
      that.setData({
        isloading: !that.data.isloading
      })
      wx.showLoading({
        title: '登陆中',
      })
      let url = app.apiUrl + '/users/login?code=' + that.data.code;
      let params = that.data.userLogin;
      app.request.requestPostApi(url, params, that, that.successFun);
    }
  },
  // 登陆接口调用成功回调
  successFun: function (res, selfObj) {
    console.log(res)
    let statu = res.code;
    let message = res.msg;
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
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        let token = res.data.token;
        let status = res.data.status;
        try {
          wx.setStorageSync('token', token);
        } catch (e) {
        }
        this.setData({
          isloading: false
        })
        if (status == 0){
          wx.showToast({
            title: "用户已冻结",
            mask: true,
            duration: 2000,
          });
        }else if(status == 1){
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            mask: true,
            duration: 2000,
          });
          wx.reLaunch({
            url: '../applyAdmin/applyAdmin'
          })
        } else if (status == 2) {
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            mask: true,
            duration: 2000,
          });
          wx.reLaunch({
            url: '../process/process'
          })
        } else if (status == 10){
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            mask: true,
            duration: 2000,
          });
          wx.reLaunch({
            url: '../personal/personal'
          })
        }else{
          wx.reLaunch({
            url: '../login/login'
          })
        }
      }
    }
  },
  bindweixin:function(){
    let that = this;
    that.getCode();
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
        mask: true,
      })
    } else {
      wx.showLoading({
        title: '登陆中',
      })
      let url = app.apiUrl + '/weixins/login?code=' + that.data.code;
      app.request.requestGetApi(url, '', that, that.wxSuccessFun);
    }
  },
  wxSuccessFun: function (res, selfObj) {
    console.log(res)
    let statu = res.code;
    let message = res.msg;
    if (statu == 200) {
      if (res.data.error) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        let token = res.data.token;
        let status = res.data.status;
        try {
          wx.setStorageSync('token', token);
        } catch (e) {
        }
        if (status == 0) {
          wx.showToast({
            title: "用户已冻结",
            mask: true,
            duration: 2000,
          });
        } else if (status == 1) {
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            mask: true,
            duration: 2000,
          });
          wx.reLaunch({
            url: '../firstRead/firstRead'
          })
        } else if (status == 2) {
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            mask: true,
            duration: 2000,
          });
          wx.reLaunch({
            url: '../process/process'
          })
        } else if (status == 10) {
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            mask: true,
            duration: 2000,
          });
          wx.reLaunch({
            url: '../personal/personal'
          })
        } else {
          wx.reLaunch({
            url: '../login/login'
          })
        }
      }
    }
  },
  onRegister: function () {
    wx.navigateTo({
      url: "../register/register"
    })
  }
})