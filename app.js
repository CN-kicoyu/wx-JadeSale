//app.js
const request = require('utils/request.js')
let checkNetWork = require("pages/CheckNetWork.js");

App({
  onLaunch: function () {
    const self = this;
    
    wx.getSystemInfo({
      success(res) {
        self.systemInfo = res;
      },
    });
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const SDKVersion = wx.getSystemInfoSync().SDKVersion || '1.0.0'
    const [MAJOR, MINOR, PATCH] = SDKVersion.split('.').map(Number)

    const canIUse = apiName => {
      if (apiName === 'showModal.cancel') {
        return MAJOR >= 1 && MINOR >= 1
      }
      return true
    }

    // if (wx.openBluetoothAdapter) {
    //   wx.openBluetoothAdapter()
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }

    // wx.reLaunch({
    //   url: 'pages/login/login',
    // })
  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    setTimeout(function () {
      wx.hideToast()
    }, 2000)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  onError: function (msg) {
    //console.log(msg)
  },
  /**
   * 定义的接口域名
   */
  systemInfo: null,
  request: request,
  apiUrl: 'https://www.91idear.com',
  globalData: {
    appid: '88888888888888888888888',
    secret: '88888888888888888888888888888',
    userInfo: null
  },
})