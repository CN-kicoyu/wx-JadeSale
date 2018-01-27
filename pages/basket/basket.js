let checkNetWork = require("../CheckNetWork.js");
let util = require('../../utils/util.js');
let app = getApp();

Page({
  data: {
    cartList: [],
    loading: false,
    isAllCheck: false,
    totalAccount: 0,
    totalNum: 0,
    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
  },
  onShow: function () {
    let that = this;
    that.setData({
      cartList: [],
      loading: false,
      isAllCheck: false,
      totalAccount: 0,
      totalNum: 0,
    })
    that.loadPage();
  },
  //下拉刷新
  onPullDownRefresh: function () {
    let that = this;
    that.setData({
      loading: false,
      isAllCheck: false,
      'cartList': [],
      totalAccount: 0,
      totalNum: 0,
    })
    that.loadPage();
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
      console.log(token)
      let url = app.apiUrl + '/carts/index?token='+token;
      app.request.requestGetApi(url, '', this, this.successFun);
    }
  },
  // 成功回调
  successFun: function (res, selfObj) {
    if (res.code == 200) {
      let newList = res.data;
      for (var i = 0; i < newList.length; i++) {
        newList[i].isCheck = false
      }
      selfObj.setData({
        'cartList': newList
      });
    }
  },
  deleteGood: function (event) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token'); 
      var $index = event.currentTarget.dataset.index;
      let params = {
        rec_id: $index,
      };
      let url = app.apiUrl + '/carts/delete?token=' + token;
      app.request.requestPostApi(url, params, this, this.successDeleteFun);
    }
  },
  successDeleteFun: function (res, selfObj){
    let statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          isAllCheck: false,
          totalAccount: 0,
          totalNum: 0,
        })
        this.loadPage();
      }
    }
  },
  addNum: function (event) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      var $index = event.currentTarget.dataset.index;
      var $num = event.currentTarget.dataset.num;
      let params = {
        rec_id: $index,
        goods_number:$num + 1
      };
      let url = app.apiUrl + '/carts/update?token=' + token;
      app.request.requestPostApi(url, params, this, this.successAddNumFun);
    }
  },
  successAddNumFun: function (res, selfObj){
    let statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          isAllCheck: false,
          totalAccount: 0,
          totalNum: 0,
        })
        this.loadPage();
      }
    }
  },
  reduceNum: function (event) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      var $index = event.currentTarget.dataset.index;
      var $num = event.currentTarget.dataset.num;
      let params = {
        rec_id: $index,
        goods_number: $num - 1
      };
      let url = app.apiUrl + '/carts/update?token=' + token;
      app.request.requestPostApi(url, params, this, this.successReduceNumFun);
    }
  },
  successReduceNumFun: function (res, selfObj) {
    let statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          isAllCheck: false,
          totalAccount: 0,
          totalNum: 0,
        })
        this.loadPage();
      }
    }
  },
  num: function (event) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      var $index = event.currentTarget.dataset.index;
      var $num = event.currentTarget.dataset.num;
      var $value = event.detail.value;
      if ($num != $value){
        let params = {
          rec_id: $index,
          goods_number: $value
        };
        let url = app.apiUrl + '/carts/update?token=' + token;
        app.request.requestPostApi(url, params, this, this.successNumFun);
      }
    }
  },
  successNumFun: function (res, selfObj) {
    let statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          isAllCheck: false,
          totalAccount: 0,
          totalNum: 0,
        })
        this.loadPage();
      }
    }
  },
  chooseAll: function () {
    var initData = this.data.cartList
    var totalAccount = 0
    var totalNum = 0
    if (this.data.isAllCheck) {
      for (var i = 0; i < initData.length; i++) {
        initData[i].isCheck = !this.data.isAllCheck
      }
    } else {
      for (var i = 0; i < initData.length; i++) {
        initData[i].isCheck = !this.data.isAllCheck
        totalAccount += initData[i].shop_price * parseInt(initData[i].goods_number)
        totalNum += initData[i].goods_number
      }
    }
    this.setData({
      'cartList': initData,
      'isAllCheck': !this.data.isAllCheck,
      'totalAccount': totalAccount.toFixed(2),
      'totalNum': totalNum
    })
  },
  checkPay: function (event) {
    var $index = event.currentTarget.dataset.index
    var initData = this.data.cartList
    let totalAccount = this.data.totalAccount
    let totalNum = this.data.totalNum
    var updateCheck = this.data.isAllCheck
    initData[$index].isCheck = !initData[$index].isCheck
    if (initData[$index].isCheck) {
      totalAccount += initData[$index].shop_price * parseInt(initData[$index].goods_number)
      totalNum += initData[$index].goods_number
      updateCheck = true
      for (var i = 0; i < initData.length; i++) {
        if (!initData[i].isCheck) {
          updateCheck = false
          break;
        }
      }
    } else {
      totalAccount -= (initData[$index].shop_price * parseInt(initData[$index].goods_number))
      totalNum -= initData[$index].goods_number
      updateCheck = false
    } 
    this.setData({
      cartList: initData,
      totalAccount: totalAccount,
      totalNum: totalNum,
      isAllCheck: updateCheck,
    })
  },
  gotoChoose: function () {
    wx.navigateTo({
      url: "../product/product"
    })
  },
  gotoPay: function() {
    var initData = this.data.cartList
    var cartId = [];
    for (var i = 0; i < initData.length; i++) {
      if (initData[i].isCheck) {
        cartId.push(initData[i].rec_id);
      }
    }
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/orders/create?token=' + token;
      let params = {
        cartId: cartId
      };
      app.request.requestPostApi(url, params, this, this.successOrderFun);
    }
  },
  successOrderFun: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
        wx.switchTab({
          url: '../basket/basket'
        })
      } else {
        let data = res.data;
        wx.showToast({
          title: '结算成功',
          duration: 1000,
          mask: true,
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../order/order'
          })
        }, 1000)
       
      }
    }
  }
})