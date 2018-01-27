let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  data:{
    rec_id:'',
    appinfo:{},
    score:[
      {
        actived: false
      },
      {
        actived: false
      },
      {
        actived: false
      },
      {
        actived: false
      }, 
      {
        actived: false
      }
    ],
    comment: {
      rec_id: '',
      content: '',
      comment_rank: 0,
    },
  },
  onLoad:function(options){
    this.setData({
      'comment.rec_id': options.id
    })
    this.loadPage(options.id);
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
      let url = app.apiUrl + '/order-goods/view?token=' + token+'&id='+id;
      app.request.requestGetApi(url, '', this, this.successFun)
    }
  },
  successFun: function (res, selfObj) {
    if (res.code == 200) {
      if (res.data.error) {
        wx.showToast({
          title: res.data.error,
        })
      } else {
        this.setData({
          'appinfo': res.data,
        })
      }
    }
  },
  checkStar: function (event) {
    var currentIndex = event.currentTarget.dataset.index
    let score = this.data.score;
    for (var i = 0; i < score.length; i++) {
      score[i].actived = false;
      if (i <= currentIndex){
        score[i].actived = true;
      }
    }
    this.setData({
      score: score,
      'comment.comment_rank': currentIndex+1,
    })
  },
  contentInput: function (e) {   //输入
    let that = this;
    let inputValue = e.detail.value;
    that.setData({
      'comment.content': inputValue,
    })
  },
  bindButtonTap: function () { //按钮
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
      wx.showLoading({
        title: '评论中',
      })
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/comments/create?token=' + token;
      let params = that.data.comment;
      app.request.requestPostApi(url, params, that, that.successCommentFun);
    }
  },
  successCommentFun: function (res, selfObj) {
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
          isloading: false
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: '评论成功！',
          duration: 2000,
        })
        wx.navigateBack({
          'url':'../evaluate/evaluate'
        })
      }
    }
  },
})