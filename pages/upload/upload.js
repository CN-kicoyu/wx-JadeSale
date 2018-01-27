let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    payType:false,

    initData:{},
    bank_id:'',
    order_id: '',
    orderSn: '',
  },
  onLoad:function(options){
    this.loadPage(options.sn);
    this.setData({
      orderSn: options.sn,
    })
    if (options.type) {
      this.setData({
        payType: options.type
      })
    }
  },
  loadPage: function (sn) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/transfers/view?token=' + token + '&sn=' + sn;
      app.request.requestGetApi(url, '', that, that.successFun);
    }
  },
  successFun: function (res, selfObj) {
    console.log(res)
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
          'initData': res.data,
          'order_id': res.data.order.order_id,
          'bank_id': res.data.bank.bank_id,
        })
      }
    }
  },
  onShowPic: function () {
    wx.previewImage({
      current: 'http://image.ttzbxcx.com/upload/sample.jpg', // 当前显示图片的http链接
      urls: ['http://image.ttzbxcx.com/upload/sample.jpg'] // 需要预览的图片http链接列表
    })
  },
  onPic: function () {
    var $this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        $this.setData({
          picUrl: tempFilePaths
        })
      }
    })
  },
  bindButtonTap: function () {
    let that = this;
    var token = wx.getStorageSync('token');
    let orderId = this.data.order_id;
    let orderSn = this.data.orderSn;
    console.log(orderSn)
    let bank_id = this.data.bank_id;
    if (this.data.picUrl == null || this.data.picUrl == undefined || this.data.picUrl == ''){
      wx.showToast({
        title: '凭证不可为空',
        duration: 2000,
        mask: true,
      });
      return false;
    }

    wx.uploadFile({
      url: app.apiUrl+'/transfers/upload?token=' + token,
      filePath: this.data.picUrl[0],
      name: 'file',
      formData: {
        'order_sn': orderSn,
        'bank_id': bank_id,
      },
      success: function (res) {
        if (res.statusCode == 200) {
          if (res.data.error) {
            wx.showToast({
              title: res.data.data.error,
            })
          } else {
            var data = res.data.data
            wx.showToast({
              title: '上传凭证成功',
              duration: 2000,
              mask: true,
            });
            if (that.data.payType){
              wx.redirectTo({
                url: '../applay/applay',
              }) 
            }else{
              wx.reLaunch({
                url: '../process/process?id=' + orderId,
              })
            }
          }
        }
      },
      fail: function () {
        console.log('fail')
      }
    })
  }
})