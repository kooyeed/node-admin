var util = require("util");

/** 系统全局工具类 */
var utils = exports = module.exports = function() {};

/** --------------------------string util ------------------------------------*/
utils.ucfirst = function(str) {
    if(!str) return str;
    
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/** --------------------------datetime util ----------------------------------*/
utils.datetime = {};
utils.datetime.now = new Date;
utils.datetime.nowtime = +new Date;
utils.datetime.format = function(format, date) {
    if("undefined" == typeof date) {
        date = new Date;
    }

    var o = { 
        "M+" : date.getMonth()+1, //month 
        "d+" : date.getDate(),    //day 
        "h+" : date.getHours(),   //hour 
        "m+" : date.getMinutes(), //minute 
        "s+" : date.getSeconds(), //second 
        "q+" : Math.floor((date.getMonth()+3)/3),  //quarter 
        "S" : date.getMilliseconds() //millisecond 
    } 
    if(/(y+)/.test(format) == true) {
        format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    
    for(var k in o) {
        if(new RegExp("("+ k +")").test(format) == true)  {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
        }
    }
    
    return format; 
};

utils.datetime.strtotime = function(format, str) {

};

/** --------------------------global util ------------------------------------*/

utils.getErrorMessage = function(error) {
    if(error.name != "ValidationError") {
        return error.message;
    }

    var errs = error.errors;
    var ands = "";
    var msgs = "";
    for(var field in errs) {
        if( errs.hasOwnProperty(field) ) {   
            msgs += ands + util.format("[%s]:%s.\n", field, errs[field].message);
            ands = ";";
        }
    }    
    return msgs;
};

utils.ip = function(req) {
    var ip_address = null;
    try {
        ip_address = req.headers['x-forwarded-for'];
    }
    catch ( error ) {
        ip_address = req.connection.remoteAddress;
    }

    return ip_address;
};

utils.json_encode = function(obj) {
    return JSON.stringify(obj);
}
utils.json_decode = function(str) {
    return JSON.parse(str);
}






