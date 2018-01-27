let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    isShow: false,
    isAddressShow: false,
    code: '',
    type: '',
    money:'',
    username:'',

    activeIndex:'',
    isloading: false,
    isPayShow: false,
    orderId : '',
    orderSn : '',

    exchange:'',
  },
  onLoad: function (options) {
    let that = this;
    that.loadPage(options.id);
    that.setData({
      type: options.id,
    })
  },
  onShow: function (options) {
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
  loadPage: function (id) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/user-wallet?token=' + token+'&id='+id;
      app.request.requestGetApi(url, '', this, this.successWalletFun);
    }
  },
  // 成功回调
  successWalletFun: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        let oldData = res.data;
        selfObj.setData({
          exchange: oldData.exchange,
          money: oldData.wallet.balance,
          username: oldData.user.username,
        });
      }
    }
  },
  onChoose: function (event) {
    this.setData({
      activeIndex: event.currentTarget.dataset.index,
      isDisabled: true
    })
  },
  isChange: function (e) {
    this.setData({
      activeIndex: e.detail.value
    })
    let length = e.detail.value.length;
    if (!e.detail.value) {
      this.setData({
        isDisabled: false
      })
    }else{
      this.setData({
        isDisabled: true
      })
    }
  },
  gotoNext: function () { //按钮
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      console.log('网络错误');
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      this.setData({
        isloading: !this.data.isloading
      })
      wx.showLoading({
        title: '充值申请中',
      })
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/paychecks/create?token=' + token;
      let params ={
        amount: that.data.activeIndex,
        type:that.data.type,
      };
      app.request.requestPostApi(url, params, that, that.successFun);
    }
  },
  successFun: function (res, selfObj) {
    let that = this;
    let statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        this.setData({
          isloading: false
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
      } else {
        this.setData({
          isloading: false,
          orderId: res.data.id,
          orderSn: res.data.order_sn
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        if (checkNetWork.checkNetWorkStatu() == false) {
          wx.showToast({
            title: '网络错误，请稍后再试！',
            duration: 2000,
          })
        } else {
          var token = wx.getStorageSync('token');
          let url = app.apiUrl + '/orders/pay-list?token=' + token;
          app.request.requestGetApi(url, '', that, that.successOrderFun);
        }
      }
    }
  },
  successOrderFun: function (res, selfObj) {
    console.log(res);
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
        var initData = res.data
        for (var i = 0; i < initData.length; i++) {
          initData[i].isCheck = false
        }
        that.setData({
          'orderConfirm.total.price': that.data.activeIndex,
          'orderConfirm.payment': initData,
          isPayShow: true,
          isShowAddress:false,
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
      let orderId = this.data.orderId;
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
      let url = app.apiUrl + '/paychecks/pay?token=' + token + '&code=' + that.data.code;
      let params = {
        order_id: orderId,
        pay_id: payId,
      };

      wx.showLoading({
        title: '付款中',
      })
      console.log(params);
      app.request.requestPostApi(url, params, this, this.successPayFun);
    }
  },
  successPayFun: function (res, selfObj) {
    console.log(res)
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
        if (that.data.payId == 2) {
          let orderSn = that.data.orderSn;
          wx.redirectTo({
            url: "../upload/upload?sn=" + orderSn+"&type=true",
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
                url: "../wallet/wallet"
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
  backPay: function () {
    this.setData({
      isPayShow: false
    })
  },
})