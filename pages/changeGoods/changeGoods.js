let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data: {
    tabNavbar: [{
      title: "积分兑换区",
      actived: true
    },
    {
      title: "赠品选购区",
      actived: false
    }],
    IsShow: 1,
    currentPage: {
      page: 1,
      is_integral:0,
    },  //加载的页码
    pageCount: 1,  //总页数
    appInfo: [],
    userInfo:[],
    points:''

  },
  onShow:function(options){
    let that = this;
    that.setData({
      'currentPage.page': 1,
      'currentPage.is_integral': 0,
      'pageCount': 1,  //总页数
      'appInfo': [],
      'userInfo':[],
      'points':''
    })

    that.loadUserInfo()
    that.loadPage();
  },
  // 获取用户信息
  loadUserInfo: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/user-wallet?token=' + token + '&id=' + 3;
      
      app.request.requestGetApi(url, '', this, this.userSuccess)
    }
  },
  // 获取用户信息成功回调
  userSuccess: function (res, selfObj) {
    selfObj.setData({
      'userInfo': res.data,
      'points': parseInt(res.data.wallet.balance)
    })
  },
  // 加载商品列表
  loadPage: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/exchanges/index';
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
        let url = app.apiUrl + '/goods/index';
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
  //下拉刷新
  putToBasket: function () {
    let that = this;
    that.setData({
      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'appInfo': []
    })
    that.loadPage();
  },
  gotoChange: function (event) {
    console.log(event.currentTarget.dataset.goods_id);
    let goods_id = event.currentTarget.dataset.goods_id;
    try {
      wx.setStorageSync('exchange_id', goods_id);
      wx.navigateTo({
        url: "../changeDetail/changeDetail"
      })
    } catch (e) {
    }
  },
  changeTab: function (event) {
    let that = this;
    var currentIndex = event.currentTarget.dataset.change
    var oldData = this.data.tabNavbar;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == currentIndex ? true : false;
    }
    if (currentIndex == 0) {
      this.setData({
        'currentPage.is_integral': 0,
      })
      this.loadPage();
    } else if (currentIndex == 1) {
      this.setData({
        'currentPage.is_integral': 1,
      })
      this.loadPage();
    }
    this.setData({
      tabNavbar: oldData
    })
  },
})