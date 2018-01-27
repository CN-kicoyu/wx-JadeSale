let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data: {
    isShow: false,
    isAddressShow:true,
    orderConfirm:{
      goods: [],
      payment: [],
      total: {},
      userAddress: {},
    },
    payId:'',
    addressId:'',
    loading: false,
    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,
  },
  onShow: function (options) {
    var $this = this;
    $this.setData({
      orderConfirm:{
        goods: [],
        payment: [],
        total: {},
        userAddress: {},
      },
     payId: '',
     addressId: '',
    })
    $this.loadPage();
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
      var cartId = wx.getStorageSync('cartId');
      console.log(cartId)
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/orders/order-view?token=' + token;
      let params = {
        id: cartId
      };
      app.request.requestPostApi(url, params, this, this.successFun);
    }
  },
  // 成功回调
  successFun: function (res, selfObj) {
    console.log(res)
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
        let paymentList = res.data.payment;
        for (var i = 0; i < paymentList.length; i++) {
          paymentList[i].isCheck = false
        }
        console.log(paymentList)
        selfObj.setData({
          orderConfirm:{
            goods: data.goods,
            payment: paymentList,
            total: data.total,
            userAddress: data.userAddress,
          },
          addressId: data.userAddress.address_id,
        });
      }
    }
  },
  gotoOrder: function() {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var cartId = wx.getStorageSync('cartId');
      var token = wx.getStorageSync('token');
      let addressId = that.data.addressId;
      if (wx.getStorageSync('addressId')){
        addressId = wx.getStorageSync('addressId');
      }
      let url = app.apiUrl + '/orders/create?token=' + token;
      if (that.data.payId == '' || that.data.payId == undefined || that.data.payId == null){
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
      let params = {
        cartId: cartId,
        pay_id:that.data.payId,
        address_id:addressId,
      };
      console.log(params)
      app.request.requestPostApi(url, params, this, this.successOrderFun);
    }
  },
  successOrderFun: function (res, selfObj){
    console.log(res)
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        let data = res.data;
        // let newList = res.data;
        // selfObj.setData({
        //   'orderConfirm': newList
        // });
        wx.showToast({
          title: res.data.message,
        })
        setTimeout(() => {
          wx.navigateTo({
            url: "../order/order"
          })
        }, 1000)
        
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
  backPay: function () {
    wx.switchTab({
      url: '../basket/basket'
    })
  },
  address: function () {
    wx.navigateTo({
      url: "../address/address"
    })
  },
})