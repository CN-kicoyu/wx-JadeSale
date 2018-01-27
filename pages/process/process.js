let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isAddressShow: true,
    payId: '',
    isWrong: true,
    initData: {},
    order_id: '',
    orderSn: '',
    isPayShow: false,

    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
  },
  onShow: function () {
    this.loadPageInfo()
    this.getCode();
    this.loadChangeShow()
  },
  loadPageInfo: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/transfers/return?token=' + token;
      app.request.requestGetApi(url, '', that, that.successInfoFun);
    }
  },
  successInfoFun: function (res, selfObj) {
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
        //console.log(res.data.order_id); 
        let id = res.data.order_id;
        let sn = res.data.order_sn;
        this.setData({
          'order_id': id,
          'orderSn': sn
        })
        this.loadPage(id);
      }
    }
  },
  loadPage: function (id) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/transfers/register-view?token=' + token + '&id=' + id;
      app.request.requestGetApi(url, '', that, that.successFun);
    }
  },
  successFun: function (res, selfObj) {
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
        this.setData({
          'initData': res.data
        })
      }
    }
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
  loadChangeShow: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/orders/pay-view?token=' + token;
      app.request.requestGetApi(url, '', that, that.loadSuccessFun);
    }
  },
  loadSuccessFun: function (res, selfObj) {
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
          'orderConfirm.payment': initData,
        })
      }
    }
  },
  changeShow: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
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
        console.log(res)
        var initData = res.data.payment
        for (var i = 0; i < initData.length; i++) {
          initData[i].isCheck = false
        }
        that.setData({
          'orderConfirm.userAddress': res.data.userAddress,
          'orderConfirm.total.price': this.data.initData.activity.package_price,
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
      let orderId = this.data.order_id;
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
      console.log(params);
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
            url: '../personal/personal',
          })
        } else if (that.data.payId == 2) {
          let orderId = that.data.order_id;
          let orderSn = that.data.orderSn;
          wx.navigateTo({
            url: "../upload/upload?sn=" + orderSn,
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
                url: "../personal/personal"
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
})