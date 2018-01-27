let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data: {
    currentPage: {
      page: 1,
      is_comment: '',
    },  //加载的页码
    pageCount: 1,  //总页数
    appInfo: [],

    tabNavbar: [{
        title: "全部",
        actived: true,
        is_comment:''
      },
      {
        title: "待评价",
        actived: false,
        is_comment: 0
      },
      {
        title: "已评价",
        actived: false,
        is_comment: 1
      },
    ]
  },
  onShow: function (options) {
    this.loadPage();
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
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/order-goods/index?token=' + token;
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
        let url = app.apiUrl + '/order-goods/index?token=' + token;
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
  changeTab: function (event) {
    var currentIndex = event.currentTarget.dataset.change
    var oldData = this.data.tabNavbar;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == currentIndex ? true : false;
    }
    this.setData({
        tabNavbar: oldData,
        'currentPage.is_comment': oldData[currentIndex].is_comment
    })
    this.loadPage();
  },
  gotoComment: function (event) {
    let id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../comment/comment?id=' + id
    })
  },
})