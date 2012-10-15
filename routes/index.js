var fs = require("fs")
    , crypto = require("crypto")
    , util = require("util")
    , procstreams = require("procstreams");

module.exports = function(app){
    app.get('/', function(req, res) {        
        res.render("index");
    });

    app.get('/upload', function(req, res) {   
        res.render("test/upload");
    });

    app.post('/upload', function(req, res) {        
        console.log(req.files);

        var file = req.files.filedata;

        var md5sum = crypto.createHash('md5');
        md5sum.update(new Date + file.name);
        var newfile = md5sum.digest('hex');

        var arr = file.name.split(".");
        var ext = arr[arr.length-1];
        newfile = newfile + "." + ext;

        
        var tmp_path = file.path;
        var target_path = __dirname + "/../public/images/uploads/" + newfile;
        fs.rename(tmp_path, target_path, function(err) {
            var result = newfile;
            if (err) {
                result = "";
            }
            res.write(result);
            res.end();    
        });
    });

    app.get("/exif", function(req, res) {
        var cmd = util.format("exiftool /home/tony/picture/IMG_0565.JPG");        
        var p = procstreams(cmd);                
        p.data(function(stdout, stderr) {
            if(stderr) throw stderr;
            var infos = stdout.split("\n");
            infos.forEach(function(line, index) {
                var arr = line.split(":");
                if(arr.length == 2) {
                    res.write(util.format("%s:[%s]\n", arr[0].trim().replace(/\s/g, ""), arr[1].trim()));    
                }
            });          
            res.end();
        });
    });
};