/**
 * 用于代替 toFixed
 * -0.6425.toFixed(3) => -0.642
 * 修复 toFixed 的不准确性
 * @param arg
 * @returns
 */
export function toFixed(number, m) {
  if (typeof number !== "number") {
    throw new Error("number不是数字");
  }
  const isNegative = number < 0;
  const _number = Math.abs(number);
  let result = Math.round(Math.pow(10, m) * _number) / Math.pow(10, m);
  result = String(result);
  if (result.indexOf(".") == -1) {
    if (m != 0) {
      result += ".";
      result += new Array(m + 1).join("0");
    }
  } else {
    const arr = result.split(".");
    if (arr[1].length < m) {
      arr[1] += new Array(m - arr[1].length + 1).join("0");
    }
    result = arr.join(".");
  }
  return isNegative ? "-" + result : result;
}

// 核心代码
// 匹配出所有的数字 是个 int[] 1.223  [1,2,2,3]
function myToFixed(zeroStrNum) {
  const numArr = zeroStrNum.match(/\d/g) || [];
  // 从最后一位数字是否大于4算起
  if (parseInt(numArr[numArr.length - 1], 10) > 4) {
    // 如果最后一位大于4，则往前遍历+1
    for (let i = numArr.length - 2; i >= 0; i--) {
      numArr[i] = String(parseInt(numArr[i], 10) + 1);
      // 判断这位数字 +1 后会不会是 10
      if (numArr[i] === "10") {
        // 10的话处理一下变成 0，再次for循环，相当于给前面一个 +1
        numArr[i] = "0";
        // 是否是进位到最前面，zeroStrNum在开头补的0了
        //flag = i !== 1;
      } else {
        // 小于10的话，就打断循环，进位成功
        break;
      }
    }
  }
}

console.log(myToFixed(1.255))

/**
 * 
 * @param {*} num 数字
 * @param {*} scale 保留多少位小数
 * @returns 
 */
function _myToFixed(num, scale) {
  var s = num + "";

  // 不存保留多少位小数，则不保留
  if (!scale) scale = 0;

  // 数字如果没有小数，则加上小数点
  if (s.indexOf(".") == -1) s += ".";

  // 数字字符串后增加对应长度0字符串
  s += new Array(scale + 1).join("0");

  if (
    // ^(-|\\+)? 匹配符号开头
    // d+匹配.号前的数值
    // d{0," + (scale + 1) + "})? 匹配小数点后0-需要长度 + 1的数值
    // d*$ 匹配任意数字结尾
    new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (scale + 1) + "})?)\\d*$").test(s)
  ) {
    var s = "0" + RegExp.$2,// 匹配固定长度的数字
      pm = RegExp.$1,// 匹配符号
      a = RegExp.$3.length,//匹配小数点及固定长度的小数，数字
      b = true;
      console.log('RegExp', RegExp.$2, RegExp.$1, RegExp.$3)
      // 如果匹配的长度，和需要保留的长度 + 2 一致(因为a的长度包括了小数点,然后判断是否需要四舍五入，还需要取定长的后一位(正则表达式中已写))
      // 对数值进行进位判断处理
    if (a == scale + 2) {
      a = s.match(/\d/g);

      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;

          // 需要进位
          if (a[i] == 10) {
            a[i] = 0;

            // 如果不是 i == 1 的进位，那么返回数据的时候，需要将0去掉
            b = i != 1;
          // 否则直接跳出
          } else break;
        }
      }

      s = a
        .join("")
        .replace(new RegExp("(\\d+)(\\d{" + scale + "})\\d$"), "$1.$2");
    }
    console.log('s', s)
    if (b) s = s.substr(1);

    return (pm + s).replace(/\.$/, "");
  }

  return num + "";
};
console.log(_myToFixed(1.255, 2))