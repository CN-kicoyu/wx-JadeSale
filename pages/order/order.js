let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data: {
    isShow: false,
    isAddressShow: true,
    code: '',
    isPayShow: false,
    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,

    tabNavbar: [{
        title: "全部",
        actived: true
      },
      {
        title: "待付款",
        actived: false
      },
      {
        title: "待收货",
        actived: false
      },
      {
        title: "已完成",
        actived: false
      },
      {
        title: "已取消",
        actived: false
      },
    ],
    isBtnShow: true,
    
    currentPage: {
      page: 1
    },  //加载的页码
    pageCount: 1,  //总页数
    orderAllList:[],
    status: 0,
    payNum: '',
    btnDisabled: true,
    orderCommentList:[],

    amount:'',//金额
    orderId:'',//订单
    orderSn:'',
  },
  onShow: function (options) {
    var oldData = this.data.tabNavbar;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = false;
    }
    oldData[0].actived = true;
    this.setData({
      'tabNavbar': oldData,

      'currentPage.page': 1,
      'pageCount': 1,  //总页数
      'payNum': '',
      'orderAllList': [],
      'status': 0,
      isPayShow: false,
    })

    this.loadAllList();
    this.getCode();
  },
  getCode: function () {
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            'code': res.code
          });
        } else {
          wx.showToast({
            title: '微信登录失败',
            duration: 2000,
            mask: true,
          })
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  // 获取全部订单列表
  loadAllList: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/orders/index?token=' + token;
      let params = {
        'status': that.data.status,
      }
      app.request.requestPostApi(url, params, this, this.orderAllSuccess)
    }
  },
  // 获取全部订单列表成功回调
  orderAllSuccess: function (res, selfObj) {
    console.log(res)
    if (res.code == 200) {
      let data = res.data;
      let newList = res.data.items;

      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'payNum': newList.length,
        'orderAllList': newList,
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
        let url = app.apiUrl + '/orders/index?token=' + token + '&page=' + that.data.currentPage.page;
        let params = {
          'status': that.data.status,
        };
        app.request.requestPostApi(url, params, this, this.successBottomFun);
      }else{
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
        let oldData = this.data.orderAllList;
        newList = oldData.concat(newList);
      }
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'orderAllList': newList
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
    if (currentIndex == 0) {
      this.setData({
        'status': 0,
      })
      this.loadAllList();
    } else if (currentIndex == 1){
      this.setData({
        'status': 1,
      })
      this.loadAllList();
    } else if (currentIndex == 2){
      this.setData({
        'status': 2,
      })
      this.loadAllList();
      
    } else if (currentIndex == 3){
      this.setData({
        'status': 3,
      })
      this.loadAllList();
      
    } else if (currentIndex == 4) {
      this.setData({
        'status': 4,
      })
      this.loadAllList();
    }
    this.setData({
        tabNavbar: oldData
    })
  },
  invalid: function (event) {//取消订单
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let order_id = event.currentTarget.dataset.index;
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/orders/cancel?token='+token;
      let params = {
        order_id: order_id
      };
      app.request.requestPostApi(url, params, this, this.successInvalidFun);
    }
  },
  gotoShipping: function (event) {//确定收货
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let order_id = event.currentTarget.dataset.index;
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/orders/receive?token=' + token;
      let params = {
        order_id: order_id
      };
      app.request.requestPostApi(url, params, this, this.successInvalidFun);
    }
  },
  // 成功回调
  successInvalidFun: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        wx.showToast({
          title: res.data.message,
        })
        this.loadAllList();
      }
    }
  },


  changeShow: function (event) {
    let amount = event.currentTarget.dataset.amount;
    let orderId = event.currentTarget.dataset.index;
    let orderSn = event.currentTarget.dataset.sn;
    console.log(event)
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      that.setData({
        amount: amount,
        orderId: orderId,
        orderSn: orderSn
      })
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/orders/pay-view?token=' + token;
      app.request.requestGetApi(url, '', that, that.successOrderFun);
    }
  },
  successOrderFun: function (res, selfObj) {
    var that = this;
    var statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        var initData = res.data.payment
        for (var i = 0; i < initData.length; i++) {
          initData[i].isCheck = false
        }
        that.setData({
          'orderConfirm.userAddress': res.data.userAddress,
          'orderConfirm.total.price': this.data.amount,
          'orderConfirm.total.order_id': this.data.orderId,
          'orderConfirm.payment': initData,
          isPayShow: true
        })
      }
    }
  },
  checkPay: function (event) {
    var $index = event.currentTarget.dataset.index
    var initData = this.data.orderConfirm.payment
    for (var i = 0; i < initData.length; i++) {
      initData[i].isCheck = false
    }
    initData[$index].isCheck = !initData[$index].isCheck
    this.setData({
      'orderConfirm.payment': initData,
      'payId': initData[$index].pay_id
    })
  },
  gotoPay: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      that.getCode();
      var token = wx.getStorageSync('token');
      let addressId = that.data.orderConfirm.userAddress.address_id;
      let orderId = that.data.orderId;
      let payId = '';

      var initData = this.data.orderConfirm.payment
      for (var i = 0; i < initData.length; i++) {
        if (initData[i].isCheck == true) {
          payId = initData[i].pay_id;
        }
      }
      if (payId == '' || payId == undefined || payId == null) {
        wx.showToast({
          title: '请选择支付方式',
          duration: 2000,
        })
        return false;
      }
      if (addressId == '' || addressId == undefined || addressId == null) {
        wx.showToast({
          title: '配送地址不可为空',
          duration: 2000,
        })
        return false;
      }
      let url = app.apiUrl + '/orders/pay?token=' + token + '&code=' + that.data.code;
      let params = {
        order_id: orderId,
        pay_id: payId,
        address_id: addressId,
      };

      wx.showLoading({
        title: '付款中',
      })
      app.request.requestPostApi(url, params, this, this.successPayFun);
    }
  },
  successPayFun: function (res, selfObj) {
    let that = this;
    let statu = res.code;
    let message = res.msg;
    if (statu == 200) {
      if (res.data.error) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        if (that.data.payId == 1) {
          wx.showToast({
            title: '付款成功',
            duration: 2000,
            mask: true,
          });
          wx.reLaunch({
            url: '../order/order',
          })
        } else if (that.data.payId == 2) {
          let orderSn = that.data.orderSn;
          console.log(orderSn)
          wx.navigateTo({
            url: "../upload/upload?sn=" + orderSn+'&type=true',
          })
        } else if (that.data.payId == 4) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              console.log('支付成功');
              wx.reLaunch({
                url: "../order/order"
              })
            },
            'fail': function (res) {
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
            }
          })
        }
      }
    }
  },
  address: function () {
    wx.navigateTo({
      url: "../address/address"
    })
  },
  backPay: function () {
    this.setData({
      isPayShow: false
    })
  },
  orderDetail: function (event) {
    let that = this;
    let order_id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../payDetail/payDetail?id=' + order_id
    })
  },
  gotoReturn: function (event){
    let that = this;
    let order_id = event.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../return/return?id=' + order_id
    })
  }
})