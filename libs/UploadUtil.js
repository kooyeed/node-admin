//var formidable = require("formidable");
var util = require("util");
var im = require('imagemagick');
var fs = require("fs");
var path = require("path");
var nbs = require('./NewBase60');

UploadUtil = Objs("com.sinjell.yani.util.UploadUtil");
UploadUtil.short = function() {
    var s = Math.pow(2,32);
    var n = Math.floor(Math.random()*s);
    var shorturl = nbs.numtosxg(n);    

    return shorturl;
};
UploadUtil.uploadFile = function(req, res, callback) {    
    function resizeImage(req, res, options) {   
        //console.log(options);
        /*  
        {
            from: 'test'
            filename: file,
            fullname: target_path,
            ext: ext,
            baseUploadDir: baseUploadDir
        }        
        */

        //说明是来自与需要缩放的图片
        //根据需要，我们将把原图等比例缩放为：a x b大小
        var cfg = [];
        if( options.from == "traveline" ) {
            cfg = [
                {"w": 465, "h": 265},
                {"w": 196, "h":  77},
                {"w": 85 , "h":  61},
                {"w": 78 , "h":  60},
                {"w": 704, "h": 264},
                {"w": 121, "h":  55},
                {"w": 146, "h":  98},
                {"w": 265, "h": 252},
                {"w": 186, "h": 124},
                {"w": 264, "h": 189}
            ];
        } else if( options.from == "hotel") {
            cfg = [
                {"w": 186, "h": 124},
                {"w": 300, "h": 200},
                {"w": 60,  "h": 50 }
            ];
        }
        else {
            cfg = [
                {"w": 120, "h": 120}                
            ];
        }

        var arr = options.filename.split('.');
        var pre = arr[0];

        

        //var db = GlobalUtils.getDB();

        var len = cfg.length;
        var w = 0;
        var h = 0;
        var dstFileName = "";
        var dstPath = "";        
        for (var i = 0; i < len; i++) {
            w = cfg[i].w;
            h = cfg[i].h;
            dstFileName=  pre + "_" + w + "_" + h + "." + options.ext;
            dstPath  = options.baseUploadDir + "/" + dstFileName;
            //console.log("dstPath:",dstPath);
            im.resize({
                    srcPath: options.fullname,
                    dstPath: dstPath,
                    width: w,
                    height: h,
                    quality: 0.8
                }, 
                function(err, stdout, stderr) {
                    if (err)  throw err; 
                    console.log("resize ok.");
                }
            );//end resize
        }//end for
    }

    function upload(req, res, callback) {
        //上传配置
        var config = {
            uploadPath: __WEB_ROOT + "/../data/tmp/",          //保存路径
            fileType: [".gif",".png",".jpg",".jpeg",".bmp"],   //文件允许格式
            fileSize: 10000                                    //文件大小限制，单位KB
        };
        var state = "SUCCESS";

        var basepath  = config.uploadPath;
        if(!path.existsSync(basepath)) {
            fs.mkdirSync(basepath, 0777);
        }

        //格式验证
        var arr = req.files.userfile.name.split('.');
        var ext = arr[arr.length-1];
        ext = ext.toLowerCase();

        if(config.fileType.indexOf(ext) == false) {
            state = "不支持的图片类型！";
        }
        
        //大小验证
        var file_size = 1024 * config.fileSize;
        if(req.files.userfile.size > file_size) {
            state = "图片大小超出限制！";
        }

        //console.log("state:" + state);

        //保存图片
        var result = null;
        if(state == "SUCCESS") {      
            var file = req.files.userfile.name;
            // 获得文件的临时路径
            var tmp_path = req.files.userfile.path;
            // 指定文件上传后的目录 - 示例为"images"目录。 
            var baseUploadDir = __WEB_ROOT + '/../public/web/assets/backend/uploads/';
            //var target_path = baseUploadDir + req.files.userfile.name;
            file = UploadUtil.short() + "." + ext;
            var target_path = baseUploadDir + file;

            //console.log(target_path);
            // 移动文件
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;

                
                //crop image
                resizeImage(req, res, {
                    filename: file,
                    fullname: target_path,
                    ext: ext,
                    baseUploadDir: baseUploadDir,
                    state: state,
                    from: req.params.from
                });
                
                //console.log(file);
                callback(file);
            }); 
        }
        else {
            callback(state);
        }
    }
    
    upload(req, res, callback);
};



UploadUtil.uploadFile2 = function(req, res, callback) {    
    function upload(req, res, callback) {
        //上传配置
        var config = {
            uploadPath: __WEB_ROOT + "/../data/tmp/",          //保存路径
            fileType: [".gif",".png",".jpg",".jpeg",".bmp"],   //文件允许格式
            fileSize: 10000                                    //文件大小限制，单位KB
        };
        var state = "SUCCESS";

        var basepath  = config.uploadPath;
        if(!path.existsSync(basepath)) {
            fs.mkdirSync(basepath, 0777);
        }
        var title = decodeURI(req.body.pictitle);

        //格式验证        
        var arr = req.files.picdata.name.split('.');
        var ext = arr[arr.length-1];
        ext = ext.toLowerCase();

        if(config.fileType.indexOf(ext) == false) {
            state = "不支持的图片类型！";
        }
        
        //大小验证
        var file_size = 1024 * config.fileSize;
        if(req.files.picdata.size > file_size) {
            state = "图片大小超出限制！";
        }

        //console.log("state:" + state);

        //保存图片
        var result = null;
        if(state == "SUCCESS") {      
            var file = req.files.picdata.name;
            // 获得文件的临时路径
            var tmp_path = req.files.picdata.path;

            // 指定文件上传后的目录 - 示例为"images"目录。 
            var baseUploadDir = __WEB_ROOT + '/../public/web/assets/backend/uploads/';
            //var target_path = baseUploadDir + req.files.picdata.name;
            file = UploadUtil.short() + "." + ext;
            var target_path = baseUploadDir + file;

            //console.log(tmp_path);
            //console.log(target_path);
            // 移动文件
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;

                result = {
                    url: file,
                    title: title,
                    state: state
                };
                callback(result);
            }); 
        }
        else {
            result = {
                url: "",
                title: title,
                state: state
            };
            callback(result);
        }
    }
    
    upload(req, res, callback);
};
