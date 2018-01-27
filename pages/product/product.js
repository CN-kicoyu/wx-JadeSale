let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    currentPage:{
      page: 1,
      cat_id:'',
    },  //加载的页码
    pageCount: 1,  //总页数
    appInfo: [],

    loading: false,
    categoryList:{},
    category:'',
    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
  },
  onReady: function () {
    let that = this;
    that.setData({
      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'appInfo': []
    })
    that.loadPageCate();
    that.loadPage();
  },
  // 加载分类
  loadPageCate: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/categories/index';
      app.request.requestGetApi(url, '', this, this.successCateFun);
    }
  },
  // 成功回调
  successCateFun: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        let data = res.data;
        let all = { cat_id: '', cat_name: '全部', parent_id: '', active:true};
        for(var i=0;i<data.length;i++){
          data[i].active = false;
        }
        data.unshift(all);
        this.setData({
          'categoryList': data
        });
      }
    }
  },
  changeCategory: function (event) {
    var currentIndex = event.currentTarget.dataset.index;
    var currentId = event.currentTarget.dataset.id;
    var oldData = this.data.categoryList;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].active = i == currentIndex ? true : false;
    }
    this.setData({
      categoryList: oldData,
      'currentPage.cat_id': currentId,
    })
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
      let url = app.apiUrl + '/goods/index';
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
  onReachBottom: function(){
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
      }else{
        wx.showToast({
          title: "已全部加载"
        })
      }
    }
  },
  successBottomFun: function (res, selfObj){
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
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: "正在加载"
    })

    let that = this;
    that.setData({
      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'appInfo': []
    })
    that.loadPage();
    
    setTimeout(() => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 1000)
  },
  goodsInfo: function (event) {
    let goods_id = event.currentTarget.dataset.goods_id;
    try {
      wx.setStorageSync('goods_id', goods_id);
      wx.navigateTo({
        url: '../productDetail/productDetail'
      })
    } catch (e) {
    }
  },

  goToBasket: function () {
    wx.switchTab({
      url: "/pages/basket/basket"
    })
  },
})