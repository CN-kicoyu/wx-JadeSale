let checkNetWork = require("../CheckNetWork.js");
let util = require("../../utils/util.js");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isChange: false,
    isloading: false,
    resign: {},
    addressId: '',

    provinceArray:[],
    provinceCode: [],
    provinceIndex:[],
    cityArray: [],
    cityCode: [],
    cityIndex:[],
    districtArray: [],
    districtCode: [],
    districtIndex:[],
    addressList: {
      address_id: '',
      consignee:'',
      mobile:'',
      zipcode: '',
      province: 2,
      city: 37,
      district:403,
      address:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var $this = this;
    $this.setData({
      resign: {},
      addressId:'',

      provinceArray: [],
      provinceCode: [],
      provinceIndex: '',
      cityArray: [],
      cityCode: [],
      cityIndex: '',
      districtArray: [],
      districtCode: [],
      districtIndex: '',

      province: '',
      city: '',
      district: '',

      addressList: {
        address_id:'',
        consignee: '',
        mobile: '',
        zipcode: '',
        province: 2,
        city: 37,
        district: 403,
        address: ''
      }
    });
    
    if (options.id != undefined){
      $this.setData({
        addressId: options.id
      });
      wx.setNavigationBarTitle({
        title: '编辑收货地址'
      })
      this.addressInfo();
      
    }else{
      wx.setNavigationBarTitle({
        title: '新增收货地址'
      })
      $this.resignList(1, 1);
      $this.resignList(2, $this.data.addressList.province);
      $this.resignList(3, $this.data.addressList.city);
    }
  },
  addressInfo: function () {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      var id = that.data.addressId;
      var token = wx.getStorageSync('token');
      let url = app.apiUrl + '/users/addr?token=' + token + '&id=' + id;
      app.request.requestGetApi(url, '', this, this.addressInfoSuccess)
    }
  },
  addressInfoSuccess: function (res, selfObj){
    if (res.data.error) {
      wx.showToast({
        title: res.data.error,
      })
    }
    this.setData({
      addressList: {
        address_id: res.data.address_id,
        consignee: res.data.consignee,
        mobile: res.data.mobile,
        zipcode: res.data.zipcode,
        province: res.data.province,
        city: res.data.city,
        district: res.data.district,
        address: res.data.address
      }
    })
    this.resignList(1, 1);
    this.resignList(2, res.data.province);
    this.resignList(3, res.data.city);
  },
  resignList: function (resign,id) {
    let that = this;
    if (checkNetWork.checkNetWorkStatu() == false) {
      wx.showToast({
        title: '网络错误，请稍后再试！',
        duration: 2000,
      })
    } else {
      let url = app.apiUrl + '/users/resign?id=' + id;
      if (resign == 1){
        app.request.requestGetApi(url, '', this, this.resignProvinceSuccess)
      }
      if (resign == 2) {
        app.request.requestGetApi(url, '', this, this.resignCitySuccess)
      }
      if (resign == 3) {
        app.request.requestGetApi(url, '', this, this.resignDistrictSuccess)
      }
    }
  },
  resignProvinceSuccess: function (res, selfObj) {
    var item = res.data;
    var name = [];
    var code = [];
    for(var i=0;i<item.length;i++){
      code.push(item[i].region_id);
      name.push(item[i].region_name);
    }
    var key = 0;
    for (var i = 0; i < code.length; i++) {
      if (code[i] == this.data.addressList.province){
          key = i;
        }
    }
    this.setData({
      provinceArray: name,
      provinceCode: code,
      provinceIndex: key,
      province: name[key],
    })
  },
  resignCitySuccess: function (res, selfObj) {
    var item = res.data;
    var name = [];
    var  code = [];
    for (var i = 0; i < item.length; i++) {
      code.push(item[i].region_id);
      name.push(item[i].region_name);
    }
    var key = 0;
    for (var i = 0; i < code.length; i++) {
      if (code[i] == this.data.addressList.city) {
        key = i;
      }else{
        this.resignList(3, code[0]);
      }
    }
    this.setData({
      cityArray: name,
      cityCode: code,
      cityIndex: key,
      city: name[key],
    })
    
  },
  resignDistrictSuccess: function (res, selfObj) {
    var item = res.data;
    var name = [];
    var code = [];
    for (var i = 0; i < item.length; i++) {
      code.push(item[i].region_id);
      name.push(item[i].region_name);
    }
    var key = 0;
    for (var i = 0; i < code.length; i++) {
      if (code[i] == this.data.addressList.district) {
        key = i;
      }
    }
    this.setData({
      districtArray: name,
      districtCode: code,
      districtIndex: key,
      district: name[key],
    })
  },
  isDelate: function () {
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  isChange: function() {
    this.setData({
      isChange: true
    })
  },
  bindProvinceChange: function (e) {
    this.resignList(2, this.data.provinceCode[e.detail.value]);
    this.setData({
      'provinceIndex': e.detail.value,
      'province': this.data.provinceArray[e.detail.value],
      'addressList.province': this.data.provinceCode[e.detail.value],
    })
  },
  bindCityChange: function (e) {
    this.resignList(3, this.data.cityCode[e.detail.value]);
    this.setData({
      'cityIndex': e.detail.value,
      'city': this.data.cityArray[e.detail.value],
      'addressList.city': this.data.cityCode[e.detail.value],
    })
  },
  bindDistrictChange: function (e) {
    this.setData({
      'districtIndex': e.detail.value,
      'district': this.data.districtArray[e.detail.value],
      'addressList.district': this.data.districtCode[e.detail.value],
    })
  },

  consigneeInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'addressList.consignee': inputValue
    });
  },
  mobileInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'addressList.mobile': inputValue
    });
  },
  zipcodeInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'addressList.zipcode': inputValue
    });
  },
  provinceInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'addressList.province': inputValue
    });
  },
  cityInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'addressList.city': inputValue
    });
  },
  districtInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'addressList.district': inputValue
    });
  },
  addressInput: function (e) {  //
    let inputValue = e.detail.value;
    this.setData({
      'addressList.address': inputValue
    });
  },
  bindButtonTap:function(){
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
      let url = app.apiUrl + '/users/create-addr?token=' + token;
      if (that.data.addressId != '') {
        url = app.apiUrl + '/users/update-addr?token=' + token;
      }
      let params = that.data.addressList;
      app.request.requestPostApi(url, params, this, this.successFun)
    }
  },
  successFun: function (res, selfObj){
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
          title: "保存成功",
        })
        wx.navigateBack({
          url: '../address/address'
        })
      }
    }
  }
})