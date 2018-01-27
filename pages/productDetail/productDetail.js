let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();

Page({
  data: {
    tabNav: [
      {
        title: "商品展示",
        actived: true
      },
      {
        title: "商品规格",
        actived: false
      },
      {
        title: "商品评价",
        actived: false
      }
    ],
    scrollLeft: 0,
    allowMove: true,

    loading: false,
    goods_id: '',
    goodsInfo: [],

    loadComment: true,
    currentPage: {
      page: 1
    },  //加载的页码
    pageCount: 1,  //总页数
    commentInfo: [],
  },
  onLoad: function (options) {
    var $this = this
    wx.getSystemInfo({
      success: function (res) {
        $this.setData({
          phoneWidth: res.windowWidth
        })
      }
    })

    var goods_id = wx.getStorageSync('goods_id')
    if (goods_id) {
      $this.setData({
        'goods_id': goods_id,
        loadComment: true
      })
      $this.loadGoodsInfo();
      $this.loadPageComment();
    }
  },
  imgScale: function () {
    var imgUrl = [];
    var img = this.data.goodsInfo.goodsGallery;
    for (var i = 0; i < img.length; i++) {
      imgUrl.push(img[i].img_url);
    }
    wx.previewImage({
      urls: imgUrl
    })
  },
  giveWidth: function (event) {
    this.setData({
      scrollHeight: parseInt(event.detail.height) + parseInt(180),
      scrollWidth: event.detail.width
    })
  },
  changePosition: function (event) {
    var $index = event.currentTarget.dataset.change;
    var oldData = this.data.tabNav;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == $index ? true : false;
    }
    this.setData({
      tabNav: oldData,
      scrollLeft: this.data.phoneWidth * $index
    })
  },
  goToBasket: function () {
    wx.switchTab({
      url: "/pages/basket/basket"
    })
  },
  cancleScroll: function () {
    this.setData({
      allowMove: false
    })
  },
  openScroll: function () {
    this.setData({
      allowMove: true
    })
  },
  onPullDownRefresh: function () {
    var that = this;
    var goods_id = wx.getStorageSync('goods_id')
    if (goods_id) {
      that.setData({
        'goods_id': goods_id
      })
      that.loadGoodsInfo();
    }
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
  // 获取商品详情
  loadGoodsInfo: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/goods/view';
      let params = {
        'id': that.data.goods_id,
      }
      app.request.requestGetApi(url, params, this, this.goodsSuccess)
    }
  },
  // 获取商品信息成功回调
  goodsSuccess: function (res, selfObj) {
    console.log(res)
    WxParse.wxParse('article', 'html', res.data.goodsinfo.goods_desc, this, 5);
    selfObj.setData({
      'goodsInfo': res.data
    })
  },
  //评论
  loadPageComment: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/comments/index?id=' + that.data.goods_id;
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successCommentFun);
    }
  },
  successCommentFun: function (res, selfObj) {
    if (res.code == 200) {
      let data = res.data;
      let newList = res.data.items;
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'commentInfo': newList
      });
      if (data._meta.currentPage >= data._meta.pageCount) {
        selfObj.setData({
          loadComment: false
        })
      }
      let pages = selfObj.data.currentPage.page + 1;
      selfObj.setData({
        'currentPage.page': pages,
      })
    }
  },
  //上拉加载
  loadBottom: function () {
    let that = this;
    if (that.data.currentPage.page <= that.data.pageCount) {
      if (checkNetWork.checkNetWorkStatu() == false) {
        wx.showToast({
          title: '网络错误，请稍后再试！',
          duration: 2000,
        })
      } else {
        let url = app.apiUrl + '/goods/index?id=' + that.data.goods_id;
        let params = that.data.currentPage;
        app.request.requestGetApi(url, params, this, this.successBottomFun);
      }
    } else {
      wx.showToast({
        title: "已全部加载"
      })
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
  //添加购物车
  addBasket: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/carts/create?token=' + token;
      let params = {
        goods_id: that.data.goods_id,
        goods_number: 1,
      }
      app.request.requestPostApi(url, params, this, this.cartSuccess)
    }
  },
  // 添加购物车成功回调
  cartSuccess: function (res, selfObj) {
    if (res.data.message) {
      wx.showToast({
        title: res.data.message,
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: res.data.error,
        icon: 'error',
        duration: 2000
      })
    }
  },
})