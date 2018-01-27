let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    windowWidth: app.systemInfo.windowWidth,
    windowHeight:app.systemInfo.windowHeight,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.setData({
      addressList: []
    });
    this.loadList();
  },
  // 获取地址
  loadList: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/address?token=' + token;
      app.request.requestGetApi(url, '', this, this.addressSuccess)
    }
  },
  // 获取地址信息成功回调
  addressSuccess: function (res, selfObj) {
    if(res.data.error){
      wx.showToast({
        title: res.data.error,
      })
    }else{
      selfObj.setData({
        'addressList': res.data,
      })
    }
  },
  onPullDownRefresh: function () {
    this.loadList();
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: "正在加载"
    })
    setTimeout(() => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000)
  },
  checkPay: function (event) {
    let that = this;
    var $index = event.currentTarget.dataset.index
    var initData = that.data.addressList
    for (var i = 0; i < initData.length; i++) {
      initData[i].default = false
    }
    initData[$index].default = !initData[$index].default
    this.setData({
      'addressList': initData,
    });

    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/default-addr?token=' + token + '&id=' + initData[$index].address_id;
      app.request.requestGetApi(url, '', this, this.addressDefaultSuccess)
    }
  },
  addressDefaultSuccess: function (res, selfObj){
    if (res.data.error) {
      wx.showToast({
        title: res.data.error,
      })
    }
    if (res.data.message) {
      wx.showToast({
        title: res.data.message,
      })
    };
  },
  checkDel: function (event){
    let that = this;
    var $index = event.currentTarget.dataset.index
    var initData = that.data.addressList
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/delete-addr?token=' + token + '&id=' + initData[$index].address_id;
      app.request.requestGetApi(url, '', this, this.addressDelSuccess)
    }
  },
  addressDelSuccess: function (res, selfObj){
    if (res.data.error) {
      wx.showToast({
        title: res.data.error,
      })
    }
    if (res.data.message) {
      wx.showToast({
        title: res.data.message,
      })
      this.loadList();
    };
  },
  checkEdit: function (event){
    let that = this;
    var $index = event.currentTarget.dataset.index
    var initData = that.data.addressList
    wx.navigateTo({
      url: '../addressEdit/addressEdit?id=' + initData[$index].address_id
    })
  },
  gotoAddressAdd: function() {
    wx.navigateTo({
      url: "../addressEdit/addressEdit"
    })
  }
})