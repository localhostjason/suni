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
    var url_site = 'http://192.168.1.3:2000/';
    var token = localStorage.getItem("token");

    var params = param ? JSON.stringify(param) : '';

    var header = no_token ? null : {'Authorization': token};
    $.ajax({
        type: method,
        url: url_site + url,
        data: params,
        headers: header,
        contentType: "application/json",
        dataType: 'json',
        success: callback,
        error: function f1(re) {
            console.log(re);
            var resp = JSON.parse(re.responseText);
            if (resp._error.code === 401) {
                //需要登录
                LayerAlert1("登录已过期，请登录！");
                setTimeout(function () {
                    window.location.href = "login.html"
                }, 1000);
            }
            else {
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
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
    } else {
        return true;
    }
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
    if (type == 1) {
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