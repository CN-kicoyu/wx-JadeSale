let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data:{
    isActived: false,
    userDetail: {},
    userInfo:{},
  },
  onLoad:function(options){
    let that = this;
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
      })
    })
  },
  onShow:function(){
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
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/user-profile?token=' + token;
      app.request.requestGetApi(url, '', this, this.userDetailSuccess)
    }
  },
  userDetailSuccess: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          'userDetail': res.data,
        })
        if (!res.data.avatar || !res.data.nickname){
          this.loadWx();
        }
      }
    }
  },
  loadWx:function(){
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/create?token=' + token;
     
      app.getUserInfo(function (userInfo) {
        let params = {
          avatar: userInfo.avatarUrl,
          nickname: userInfo.nickName
        };
        app.request.requestPostApi(url, params, that, that.userWxSuccess)
      })
    }
  },
  userWxSuccess: function (res, selfObj){
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        
      }
    }
  },
  gotoOrder:function(){
    wx.navigateTo({
      url: "../order/order"
    })
  },
  gotoEvaluate:function(){
    wx.navigateTo({
      url: "../evaluate/evaluate"
    })
  },
  gotoWallet:function(){
    wx.navigateTo({
      url: "../wallet/wallet"
    })
  },
  gotoMyset: function () {
    wx.navigateTo({
      url: "../mySet/mySet"
    })
  },
  gotoApplyAdmin: function () {
    wx.navigateTo({
      url: "../applyAdmin/applyAdmin"
    })
  },
  gotoAnnounce:function(){
    wx.navigateTo({
      url: "../announce/announce"
    })
  },
  gotoChangeGoods:function(){
    wx.navigateTo({
      url: "../changeGoods/changeGoods"
    })
  },
  gotoMortgage:function(){
    wx.navigateTo({
      url: "../mortgage/mortgage"
    })
  },
  gotoBecome:function(){
    wx.navigateTo({
      url: "../become/become"
    })
  },
  gotoParter:function(){
    wx.navigateTo({
      url: "../parter/parter"
    })
  },
  gotoApplay:function(){
    wx.navigateTo({
      url: "../applay/applay"
    })
  },
})