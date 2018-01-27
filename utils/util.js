function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  const num = n.toString();
  return num[1] ? num : `0${num}`;
}

function formatTimeType(date, type) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  let time = '';
  switch (type) {
    case 1:
      time = `${[year, month, day].map(formatNumber).join('.')}`;
      break;
    case 2:
      time = `${[year, month, day].map(formatNumber).join('.')} ${[hour, minute].map(formatNumber).join(':')}`;
      break;
    default:
      time = `${[year, month, day].map(formatNumber).join('.')} ${[hour, minute, second].map(formatNumber).join(':')}`;
  }
  return time;
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

//是否为空
function isEmpty(str) {
  return str === '' || str === null || str == undefined;
};

/**
 * 功能:正则表达式的匹配
 * 参数：pattern:正则表达式
 *      str:校验的值
 * 返回:true,false
 */
function executeExp(str, pattern) {
  return pattern.test(str);
};
//是否是手机号
function isMobile(mobile) {
  var exp = /^(13|14|15|17|18)[0-9]{9}$/;//"^[1]d{10}$";
  return executeExp(mobile, exp);
};
//是否是邮箱
function isEmail(email) {
  var exp = "^w+[-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*$";
  return executeExp(email, exp);
};
//是否是身份证号码
function isCard(card) {
  var exp = "^d{15}|d{18}$";
  return executeExp(card, exp);
};
//是否是数字
function isNumber(number) {
  var exp = "^[0-9]+(.[0-9]{1,3})?$ ";
  return executeExp(number, exp);
};
//是否是数字字母下划线
function isInputStr(alphabet) {
  var exp = "^\w+$ ";
  return executeExp(alphabet, exp);
};
function isPassword(pwd) {
  var exp = "^[a-zA-Z]w{5,17}$";
  return this.executeExp(pwd, exp);
};

//身份证号码
function isIdcard(code) {
  this.trim(code);
  //城市编码
  let city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
  let tip = "";
  let pass = true;
  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "校验位错误";
        pass = false;
      }
    }
    console.log(tip);
    return pass;
  }
};
function trim(target) {
  return target.replace(/(^\s*)|(\s*$)/g, "");
};

module.exports = {
  formatNumber,
  formatTime,
  formatTimeType,
  isEmpty,
  executeExp,
  isMobile,
  isEmail,
  isCard,
  isNumber,
  isInputStr,
  isIdcard,
  trim,
};

