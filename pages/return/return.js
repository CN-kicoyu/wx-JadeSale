let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    focus: false,
    btnDisabled: true,
    isloading: false,
    appinfo:'',

    bankIndex: '',
    bankName: '',
    bankArray: {},
    bankCode: {},
    retun: {
      order_sn: '',
      bank_id: '',
      content: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'return.order_sn': options.id
    })
    this.loadPage(options.id)
  },
  loadPage: function (sn) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let token = wx.getStorageSync('token');
      let url = app.apiUrl + '/refund-orders/order-view?token=' + token+'&sn='+sn;
      app.request.requestGetApi(url, '', this, this.orderSuccess)
    }
  },
  orderSuccess: function (res, selfObj) {
    console.log(res)
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        var item = res.data.bank;
        var name = [];
        var code = [];
        for (var i = 0; i < item.length; i++) {
          code.push(item[i].id);
          name.push(item[i].bank_card);
        }
        if (item.length<=0){
          wx.showToast({
            title: '请先添加银行卡',
            duration: 2000,
          })
        }
        this.setData({
          'appinfo': res.data,
          bankArray: name,
          bankCode: code,
          bankIndex: 0,
          bankName: name[0],
          'return.bank_id': code[0]
        })
      }
    }
  },
  bindBankChange: function (e) {
    this.setData({
      'bankIndex': e.detail.value,
      'bankName': this.data.bankArray[e.detail.value],
      'return.bank_id': this.data.bankCode[e.detail.value],
    })
  },
  contentInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'return.content': inputValue,
      'btnDisabled': false
    });
  },
  bindButtonTap: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      this.setData({
        isloading: !this.data.isloading
      })
      let token = wx.getStorageSync('token');
      let url = app.apiUrl + '/refund-orders/create?token=' + token;
      let params = that.data.return;
      app.request.requestPostApi(url, params, this, this.successFun)
    }
  },
  successFun: function (res, selfObj) {
    console.log(res)
    let statu = res.code;
    let message = res.msg;
    if (statu == 200) {
      if (res.data.error) {
        this.setData({
          isloading: false
        })
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          isloading: false
        })
        wx.showToast({
          title: "提交成功",
        })
        wx.navigateBack({
          url: '../order/order'
        })
      }
    }
  },
})