let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data: {
    isActived: true,
    imgUrls: [],
    subMenuData: [
      {
        img: "/images/icon/index-1.png",
        name: "全部商品"
      },
      {
        img: "/images/icon/index-2.png",
        name: "我的订单"
      },
      {
        img: "/images/icon/index-3.png",
        name: "我的积分"
      },
      {
        img: "/images/icon/index-4.png",
        name: "商城公告"
      },
    ],
    introImg: [
      "http://oo3thr1aa.bkt.clouddn.com/index-intro-1.jpg",
      "http://oo3thr1aa.bkt.clouddn.com/index-intro-2.jpg",
      "http://oo3thr1aa.bkt.clouddn.com/index-intro-3.jpg"
    ],

    currentPage: {
      page: 1
    },  //加载的页码
    pageCount: 1,  //总页数
    goodsInfo: [],

    loading: false,
  },
  onLoad: function () {
    this.setData({
      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'goodsInfo': [],
    })
    this.loadPage();
    this.loadBanner();
  },
  loadBanner:function(){
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/banners/index?type=0';
      app.request.requestGetApi(url, '', this, this.successBannerFun);
    }
  },
  successBannerFun: function (res, selfObj) {
    if (res.code == 200) {
      let data = res.data;
      selfObj.setData({
        imgUrls: data
      })
    }
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
      let url = app.apiUrl + '/goods/best';
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
        'goodsInfo': newList
      });
      let pages = selfObj.data.currentPage.page + 1;
      selfObj.setData({
        'currentPage.page': pages,
      })
    }
  },//下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'goodsInfo': []
    })
    this.loadPage();
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
  //上拉加载
  onReachBottom: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/goods/best';
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successBottomFun);
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
        newList = this.data.goodsInfo.concat(newList);
      } else {
        wx.showToast({
          title: "商品已全部加载"
        })
      }
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'goodsInfo': newList
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
  gotoDatils: function (event) {
    console.log(event.currentTarget.dataset.goods_id);
    let goods_id = event.currentTarget.dataset.goods_id;
    try {
      wx.setStorageSync('goods_id', goods_id);
      wx.navigateTo({
        url: '../productDetail/productDetail'
      })
    } catch (e) {
    }
  },
  subMenuEntry: function (event) {
    var $index = event.currentTarget.dataset.item
    switch ($index) {
      case 0:
        wx.navigateTo({
          url: "../product/product"
        })
        break;
      case 1:
        wx.navigateTo({
          url: "../order/order"
        })
        break;
      case 2:
        wx.navigateTo({
          url: "../exchange/exchange"
        })
        break;
      case 3:
        wx.navigateTo({
          url: "../announce/announce"
        })
        break;
    }
  },
  onActived: function () {
    this.setData({
      isActived: false
    })
  },
  goExchange: function () {
    wx.navigateTo({
      url: "../exchange/exchange"
    })
  }
})
