let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();
Page({
  data: {
    agentList:{},
    money:''
  },
  onShow: function (options) {
    let that = this;
    this.loadPage();
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
      let url = app.apiUrl + '/users/list?token=' + token;
      app.request.requestGetApi(url, '', this, this.userAgentlSuccess)
    }
  },
  userAgentlSuccess: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        let oldData = res.data;
        for (var i = 0; i < oldData.length; i++) {
          oldData[i].editItems = false;
        }
        this.setData({
          'agentList': oldData,
        })
      }
    }
  },
  moneyInput: function (e) {   //金额输入
    let that = this;
    let inputValue = e.detail.value;
    let length = e.detail.value.length;
    that.setData({
      'money': inputValue,
    })
  },
  onEdit: function (event) {
    var $index = event.currentTarget.dataset.index;
    let items = this.data.agentList.agent;
    if (!items[$index].editItems){
      for (var i = 0; i < items.length; i++) {
        items[i].editItems = false;
      }
    }
    items[$index].editItems = !this.data.agentList.agent[$index].editItems
    this.setData({
     'agentList.agent': items
    })
    if (!items[$index].editItems){
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/update-agent?token=' + token;
      let params = {
        id: items[$index].id,
        agent_money: this.data.money,
      };
      app.request.requestPostApi(url, params, this, this.userUpdateAgentlSuccess)
    }
  },
  userUpdateAgentlSuccess: function (res, selfObj){
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        wx.showToast({
          title: res.data,
          duration: 2000,
        })
        wx.navigateTo({
          url: '../parter/parter',
        })
      }
    }
  }
})