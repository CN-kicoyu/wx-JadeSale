let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    currentPage: {
      page: 1
    },  //加载的页码
    pageCount: 1,  //总页数
    appInfo: [],

    loading: false,
    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
  },
  onShow: function () {
    let that = this;
    that.setData({
      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'appInfo': []
    })
    that.loadPage();
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
      let url = app.apiUrl + '/stocks/index?token='+token;
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successFun);
    }
  },
  // 成功回调
  successFun: function (res, selfObj) {
    console.log(res)
    if (res.code == 200) {
      let data = res.data;
      let newList = res.data.items;
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'appInfo': newList
      });
      let pages = selfObj.data.currentPage.page + 1;
      selfObj.setData({
        'currentPage.page': pages,
      })
    }
  },
  //上拉加载
  onReachBottom: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      if (that.data.currentPage.page <= that.data.pageCount) {
        var token = wx.getStorageSync('token');
        let url = app.apiUrl + '/stocks/index?token=' + token;
        let params = that.data.currentPage;
        app.request.requestGetApi(url, params, this, this.successBottomFun);
      } else {
        wx.showToast({
          title: "已全部加载"
        })
      }
    }
  },
  successBottomFun: function (res, selfObj) {
    if (res.code == 200) {
      let data = res.data;
      let newList;
      if (selfObj.data.currentPage.page <= data._meta.pageCount) {
        wx.showNavigationBarLoading();
        wx.showLoading({
          title: "正在加载"
        })
        newList = res.data.items;
        newList = this.data.appInfo.concat(newList);
      }
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'appInfo': newList
      });
      setTimeout(() => {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
      }, 2000)

      let pages = selfObj.data.currentPage.page + 1;
      selfObj.setData({
        'currentPage.page': pages,
      })
    }
  },
  bindExchange: function (event) {
    var id = event.currentTarget.dataset.id
    console.log(id)
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/stocks/exchange?token=' + token+'&id='+id;
      app.request.requestGetApi(url, '', this, this.successExchangeFun);
    }
  },
  successExchangeFun: function (res, selfObj){
    console.log(res)
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        wx.showToast({
          title: res.data.message,
        })
        this.loadPage();
      }
    }
  },
  gotoMortgageApply:function(){
    wx.navigateTo({
      url: '../mortgageApply/mortgageApply',
    })
  }
})