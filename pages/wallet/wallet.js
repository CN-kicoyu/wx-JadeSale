let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    code:'',
    money: '',
    coinName: '',
    coinId:'',
    walletList:{},

    currentPage: {
      page: 1
    },  //加载的页码
    pageCount: 1,  //总页数
    appInfo: [],
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    this.loadPage();
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
  loadPage: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/wallets/list?token=' + token;
      app.request.requestGetApi(url, '', this, this.successFun);
    }
  },
  // 成功回调
  successFun: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        let oldData = res.data;
        for (var i = 0; i < oldData.length; i++) {
          if (i == 0) {
            oldData[i].actived = true;
          } else {
            oldData[i].actived = false;
          }
        }

        selfObj.setData({
          walletList: oldData,
          coinName: oldData[0].type_name,
          money: oldData[0].balance,
          coinId: oldData[0].type,
        });

        this.loadPageInfo(oldData[0].type);
      }
    }
  },
  changeTab: function (event) {
    this.setData({
      packgoodslist: {}
    })
    var currentIndex = event.currentTarget.dataset.change
    var oldData = this.data.walletList;
    for (var i = 0; i < oldData.length; i++) {
      oldData[i].actived = i == currentIndex ? true : false;
    }
    this.setData({
      walletList: oldData,
      coinName: oldData[currentIndex].type_name,
      money: oldData[currentIndex].balance,
      coinId: oldData[currentIndex].type,
    })
    this.loadPageInfo(oldData[currentIndex].type);
  },
  // 加载详细记录
  loadPageInfo: function (id) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/wallets/view?token=' + token+'&id='+id;
      let params = that.data.currentPage;
      app.request.requestGetApi(url, params, this, this.successDetailFun);
    }
  },
  // 成功回调
  successDetailFun: function (res, selfObj) {
    if (res.code == 200) {
      let data = res.data;
      let newList = res.data.items;
      selfObj.setData({
        'currentPage.page': data._meta.currentPage,
        'pageCount': data._meta.pageCount,
        'appInfo': newList
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
        let url = app.apiUrl + '/goods/index';
        let params = that.data.currentPage;
        app.request.requestGetApi(url, params, this, this.successBottomFun);
      } else {
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
  gotoExchange:function(){
    wx.navigateTo({
      url: "../convert/convert"
    })
  },
  gotoChangeGoods: function () {
    wx.navigateTo({
      url: "../changeGoods/changeGoods"
    })
  },
  gotoRecharge:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../recharge/recharge?id=" + id
    })
  }
})