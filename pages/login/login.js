let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  goRegister: function () {
    wx.navigateTo({
      url: "../register/register"
    })
  },
  onShow:function(){
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
      wx.login({
        success: function (res) {
          if (res.code) {
            let url = app.apiUrl + '/weixins/login?code=' + res.code;
            //app.request.requestGetApi(url, '', that, that.wxSuccessFun);
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
    }
  },
  wxSuccessFun: function (res, selfObj) {
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
        // wx.redirectTo({
        //   url: '/pages/login/login'
        // })
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
          wx.redirectTo({
            url: '../firstRead/firstRead'
          })
        } else if (status == 2) {
          wx.showToast({
            title: "登录成功",
            icon: 'success',
            mask: true,
            duration: 2000,
          });
          wx.redirectTo({
            url: '../process/process'
          })
        } else if (status == 10) {
          wx.switchTab({
            url: '../personal/personal'
          })
        } else {
          wx.redirectTo({
            url: '../login/login'
          })
        }
      }
    }
  },
  goSignin: function () {
    wx.navigateTo({
      url: "../signIn/signIn"
    })
  }
})