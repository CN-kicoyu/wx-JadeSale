var displayData = require("../../mock/auction-display")
Page({
  data: {},
  onShow: function (options) {
    var displayTmp = displayData.indexDisplay
    this.setData({
      displayTmp: displayTmp[0]
    })
  },
  onRemind: function (event) {
    this.setData({
      maskbox: true,
      type: event.currentTarget.dataset.type
    })
  },
  closeBox: function () {
    this.setData({
      maskbox: false
    })
  },
  sureClick: function (event) {
    if (event.currentTarget.dataset.type === 'remind') {
      this.setData({
        isRemind: true
      })
    }
  },
  onAuctionDetail: function () {
    wx.navigateTo({
      url: "../auctionDetail/auctionDetail"
    })
  },
  onCancel: function () {
    wx.showModal({
      title: '温馨提示',
      content: '/(ㄒoㄒ)/~~，确定要取消提醒设置吗？',
      success: function (res) {
        if (res.confirm) {
          this.setData({
            isRemind: false
          })
        } else if (res.cancel) {
          return
        }
      }
    })
  }
})