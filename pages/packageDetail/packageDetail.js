let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    isShow: false,
    isAddressShow: true,

    code:'',
    isPayShow: false,
    dataType: {},
    tabNavbar: {},
    goodsList:{},
    packgoodslist:{},
    num:0,
    payId:'',
    packTotal:{},
    total:0,

    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,

  },
  onLoad: function (options) {
    this.setData({
      dataType: {},
      tabNavbar: {},
      goodsList: {},
      packgoodslist: {},
      num: 0
    })
    this.loadPage(options.id);
  },
  onShow: function () {
    this.getCode();
    this.loadChangeShow();
  },
  changeTab: function (event) {
    this.setData({
      packgoodslist: {}
    })
    var currentIndex = event.currentTarget.dataset.change
    var oldData = this.data.tabNavbar;
    var goodsList = this.data.goodsList;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == currentIndex ? true : false;
    }
    let packTotal = this.data.packTotal;
    let total = 0;
    for (var i = 0; i < packTotal.length; i++) {
      if (packTotal[i].id == oldData[currentIndex].id) {
        total = parseInt(packTotal[i].total)
      }
    }
    let num = 0;
    let packgoodslist = [];
    let k = 0;
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsList[i].package_id == oldData[currentIndex].id) {
        packgoodslist[k++] = {
          'package_id': goodsList[i].package_id,
          'packagelist_id': goodsList[i].packagelist_id,
          'goods_name': goodsList[i].goods_name,
          'package_number': goodsList[i].package_number,
          'goods_img': goodsList[i].goods_img,
        };
        num += parseInt(goodsList[i].package_number);
      }
    }
    this.setData({
      tabNavbar: oldData,
      goodsList: goodsList,
      packgoodslist: packgoodslist,
      num: num,
      total: total,
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
      let url = app.apiUrl + '/packages/list?id=' + id;
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
        let typeList = res.data.type;
        let packList = res.data.package;
        let goodsList = res.data.goods;
        let packTotal = res.data.total;
        for (var i = 0; i < packList.length; i++) {
          if(i==0){
            packList[i].actived = true;
          }else{
            packList[i].actived = false;
          }
        }

        let total = 0;
        for (var i = 0; i < packTotal.length; i++) {
          if (packTotal[i].id == packList[0].id) {
            total = parseInt(packTotal[i].total)
          }
        }
        let num = 0;
        let packgoodslist = [];
        let k = 0;
        for (var i = 0; i < goodsList.length; i++) {
          if (goodsList[i].package_id == packList[0].id) {
            packgoodslist[k++]={
              'package_id' : goodsList[i].package_id,
              'packagelist_id': goodsList[i].packagelist_id,
              'goods_name' : goodsList[i].goods_name,
              'package_number' : goodsList[i].package_number,
              'goods_img' : goodsList[i].goods_img,
            };
            num += parseInt(goodsList[i].package_number);
          }
        }
        selfObj.setData({
          dataType: typeList,
          tabNavbar: packList,
          goodsList: goodsList,
          packgoodslist: packgoodslist,
          num: num,
          packTotal:packTotal,
          total: total,
        })
      }
    }
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
    let olddata = that.data.tabNavbar;
    let id;
    for (var i = 0; i < olddata.length; i++) {
      if (olddata[i].actived) {
        id = olddata[i].id;
      }
    }
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/packages/create?token='+token+'&id=' + id;
      app.request.requestGetApi(url, '', that, that.successOrderFun);
    }
  },
  successOrderFun: function (res,selfObj){
    var that = this;
    var statu = res.code;
    if (statu == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
          duration: 2000,
          mask: true,
        })
        if (res.data.error = "已购买过套餐"){
          wx.redirectTo({
            'url':'../process/process'
          })
        }
      } else {
        var initData = res.data.payment
        for (var i = 0; i < initData.length; i++) {
          initData[i].isCheck = false
        }
        that.setData({
          'orderConfirm.userAddress': res.data.userAddress,
          'orderConfirm.total': res.data.total,
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
      let orderId = that.data.orderConfirm.total.order_id;
      let payId = '';

      var initData = this.data.orderConfirm.payment
      for (var i = 0; i < initData.length; i++) {
        if (initData[i].isCheck == true){
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
        if (that.data.payId == 1){
          wx.showToast({
            title: '付款成功',
            duration: 2000,
            mask: true,
          });
          wx.reLaunch({
            url: '../personal/personal',
          })
        } else if (that.data.payId == 2) {
          let orderSn = that.data.orderConfirm.total.order_sn;
          wx.reLaunch({
            url: "../upload/upload?sn=" + orderSn,
          })
        } else if (that.data.payId == 4){
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
            }
          })
        }
      }
    }
  },
  onRemind: function (event) {
    this.setData({
      maskbox: true,
      type: event.currentTarget.dataset.type
    })
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