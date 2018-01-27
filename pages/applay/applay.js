let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    tabNavbar: [{
      title: "转账",
      actived: true
    },
    {
      title: "充值",
      actived: false
    }, 
    {
        title: "退款",
        actived: false
    },],
    IsShow:1,
    currentPage: {
      page: 1
    },  //加载的页码
    pageCount: 1,  //总页数
    appInfo: [],

    sumMoney:[],

    paycheckList:{},

    refundList:{},
  },
  onReady: function () {
    let that = this;
    that.setData({
      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'appInfo': []
    })
    that.loadPageIdentity();
    that.loadPage();
  },
  changeTab: function (event) {
    let that = this;
    var currentIndex = event.currentTarget.dataset.change
    var oldData = this.data.tabNavbar;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == currentIndex ? true : false;
    }
    if (currentIndex == 0) {
      that.setData({
        'currentPage.page': 1,
        'pageCount': 1,  //总页数
        'appInfo': [],
        'IsShow':1,
      })
      that.loadPageIdentity();
      that.loadPage();
    } else if (currentIndex == 1) {
      that.setData({
        'currentPage.page': 1,
        'pageCount': 1,  //总页数
        'paycheckList': [],
        'IsShow': 2,
      })
     that.loadPayPage();
    } else if (currentIndex == 2) {
      that.setData({
        'currentPage.page': 1,
        'pageCount': 1,  //总页数
        'refundList': [],
        'IsShow': 3,
      })
      that.loadRefundPage();
    }
    this.setData({
      tabNavbar: oldData
    })
  },
  loadPageIdentity: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/transfers/identity?token=' + token;
      app.request.requestGetApi(url, '', this, this.successIdentityFun);
    }
  },
  // 成功回调
  successIdentityFun: function (res, selfObj) {
    if (res.code == 200) {
      let data = res.data;
      this.setData({
        sumMoney: data,
      });
    }
  },
  // 加载列表
  loadPayPage: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/paychecks/index?token=' + token;
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successPayFun);
    }
  },
  // 成功回调
  successPayFun: function (res, selfObj) {
    if (res.code == 200) {
      let data = res.data;
      let newList = res.data.items;
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'paycheckList': newList
      });
      let pages = selfObj.data.currentPage.page + 1;
      selfObj.setData({
        'currentPage.page': pages,
      })
    }
  },
  // 加载列表
  loadPage: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/transfers/index?token='+token;
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successFun);
    }
  },
  // 成功回调
  successFun: function (res, selfObj) {
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
        let url = app.apiUrl + '/transfers/index?token=' + token;
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
  // 加载列表
  loadRefundPage: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/refund-orders/index?token=' + token;
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successRefundFun);
    }
  },
  // 成功回调
  successRefundFun: function (res, selfObj) {
    console.log(res)
    if (res.code == 200) {
      let data = res.data;
      let newList = res.data.items;
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'refundList': newList
      });
      let pages = selfObj.data.currentPage.page + 1;
      selfObj.setData({
        'currentPage.page': pages,
      })
    }
  },
})