BASE_API = 'http://192.168.1.3:2000/';
_BASE_API = 'http://192.168.1.3:2000';

/**
 * ajax post提交
 * @param url  请求地址
 * @param param  需要传的数据
 * @param method 提交方法
 * @param callback
 * @param no_token  是否带token
 * @return
 */
function sendAjax(url, param, method, callback, no_token) {
    // var url_site = 'http://192.168.120.244:2000/';
    var url_site = BASE_API;
    var token = localStorage.getItem("token");

    var params = param ? JSON.stringify(param) : '';

    var header = no_token ? null : {'Authorization': 'Bearer ' + token};
    $.ajax({
        type: method,
        url: url_site + url,
        data: params,
        headers: header,
        contentType: "application/json",
        dataType: 'json',
        async: false, // 不使用异步
        success: callback,
        error: function f1(re) {
            console.log(re);
            var resp = {};
            try {
                resp = JSON.parse(re.responseText);
            } catch (e) {
                resp['_error'] = {
                    code: 401
                };
            }
            if (resp._issues) {
                LayerAlert1('错误：' + JSON.stringify(resp._issues));
                return
            }

            if (resp._error.code === 401) {
                //需要登录
                LayerAlert1("登录已过期，请登录！");
                setTimeout(function () {
                    if (localStorage.getItem('code')) {
                        window.location.href = "login.html?code=" + localStorage.getItem('code')
                    } else {
                        window.location.href = "login.html"
                    }

                }, 1000);
            } else {
                LayerAlert1(resp._error.message);
            }
        }
    })


}

function LayerAlert(content) {
    layer.open({
        content: content,
        btn: '确定'
    });
}

function LayerAlert1(content) {
    //提示
    layer.open({
        content: content,
        skin: 'msg',
        time: 2 //2秒后自动关闭
    });
}

/**
 *  验证手机号
 */
function checkPhone(phone) {
    return /^1[34578]\d{9}$/.test(phone);
}

/*
* 验证身份证号
* */
function isCardNo(card) {
// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) {
        return false;
    }
}

/*
* 验证姓名
* */
/**
 * @return {boolean}
 */
function IsChinese(relname) {
    var reg = /^([\u4e00-\u9fa5]){2,7}$/; //只能是中文，长度为2-7位
    if (!reg.test(relname)) {
        return false;
    }
}

/**
 * 显示密码
 */
$('.see_pass').on('click', function () {
    var type = $(this).attr('type');
    if (type === 1) {
        $(this).prev().attr('type', 'text');
        $(this).attr('type', 2)
    } else {
        $(this).prev().attr('type', 'password');
        $(this).attr('type', 1)
    }
})

function setTimeLoad(callback) {
    setTimeout(function () {
        callback();
    }, 1000)
}


//paraName 等找参数的名称
function getUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] === paraName) {
                return arr[1];
            }
        }
        return "";
    } else {
        return "";
    }
}


function filter_val(data, key, val, return_key) {
    if (!data.length) return false;
    var result = '';
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] === val || !data[i][key]) {
            result = data[i][return_key];
            break
        }
    }
    return result
}

function filter_val_list(data, key, val) {
    if (!data.length) return false;
    var result = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i][key] === val) {
            result.push(data[i])
        }
    }
    return result
}

function group_type(data, key, re_val) {
    if (!data.length) return false;

    var result = {};
    data.forEach(function (val, index) {
        var r = result[val[key]];
        if (!r) {
            result[val[key]] = r = []
        }
        if (index <= data.length - 2) {
            if (val[key] === data[index + 1][key]) {
                r.push(val[re_val]);
            }
        }
    });
    return result
}


//在Jquery里格式化Date日期时间数据
function timeStamp2String(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function pay_action(t) {
    /*
    获取支付方式
    * */
    var result;
    switch (t) {
        case 'alipay':
            result = '支付宝支付';
            break;
        case 'we_chart':
            result = '微信支付';
            break;
        case 'bank_card':
            result = '银行卡支付';
            break;
        default:
            result = '支付宝支付';
            break;
    }
    return result
}
