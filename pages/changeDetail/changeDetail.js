let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({
  data: {
    isShow: true,
    isAddressShow: true,
    isPayShow: false,
    goods_id: '',
    goodsInfo: [],

    orderConfirm: {
      userAddress: {},
      exchange_integral: '',
    },
    addressId: '',
  },
  onLoad: function (options) {
    var $this = this;
    wx.getSystemInfo({
      success: function (res) {
        $this.setData({
          dataHeight: res.windowHeight
        })
      }
    })
  },
  onShow: function () {
    var that = this;
    var goods_id = wx.getStorageSync('exchange_id')
    if (goods_id) {
      that.setData({
        'goods_id': goods_id,
        orderConfirm: {
          userAddress: {},
          exchange_integral:''
        },
        addressId: '',
      })
      that.loadGoodsInfo();
    }
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
      let url = app.apiUrl + '/exchanges/view';
      let params = {
        'id': that.data.goods_id,
      }
      app.request.requestGetApi(url, params, this, this.goodsSuccess)
    }
  },
  // 获取商品信息成功回调
  goodsSuccess: function (res, selfObj) {
    selfObj.setData({
      'goodsInfo': res.data,
      'orderConfirm.exchange_integral':  res.data.exchange.exchange_integral ,
    })
    console.log(res.data.goodsinfo.goods_desc)
    WxParse.wxParse('article_content', 'html', res.data.goodsinfo.goods_desc, this, 5);
  },
  // 加载结算信息
  changeShow: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/exchanges/order-view?token=' + token + '&id=' + that.data.goods_id;
      app.request.requestGetApi(url, '', this, this.successFun);
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
        this.setData({
          isPayShow: false
        });
      } else {
        this.setData({
          isPayShow: true
        });
        let data = res.data;
        selfObj.setData({
          'orderConfirm.userAddress': data.userAddress,
          'orderConfirm.payment': data.payment,
          'orderConfirm.exchange_integral': this.data.orderConfirm.exchange_integral,
          'addressId': data.userAddress.address_id,
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
      let addressId = that.data.addressId;
      if (wx.getStorageSync('addressId')) {
        addressId = wx.getStorageSync('addressId');
      }
      if (addressId == '' || addressId == undefined || addressId == null) {
        wx.showToast({
          title: '配送地址不可为空',
          duration: 2000,
        })
        return false;
      }
      let params = {
        goods_id: that.data.goods_id,
        address_id: addressId,
      };
      console.log(params)
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/exchanges/create?token=' + token;
      app.request.requestPostApi(url, params, this, this.successOrderFun);
    }
  },
  successOrderFun: function (res, selfObj) {
    console.log(res)
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        let data = res.data;
        wx.showToast({
          title: res.data.message,
        })
        wx.navigateBack({
          url: "../changeDetail/changeDetail"
        })
      }
    }
  },
  address:function(){
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