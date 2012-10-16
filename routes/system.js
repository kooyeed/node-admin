var fs = require("fs")
    , util = require("util")
    , StatModel = require("../models/stat")
    , LogModel = require("../models/log")
    , utils = require("../libs/utils")    
    , step = require("step")
    , path = require('path')
    , procstreams = require("procstreams");

module.exports = function(app) {    
    app.get("/system/tools", function(req, res) {
        res.render("system/tools");
    });

    app.post("/system/tools/:action", function(req, res, next) {
        if(req.params.action == "module") {
            var name = req.body.name;
            var nickname = req.body.nickname;
            var fields = req.body.fields;

            if(!name || !nickname || !fields) {
                res.local("message", {
                    type: "Error",
                    message: "请认真输入需要的参数."
                })
                next();

                return false;
            }
            
            var viewDir = util.format("%s/../views/%s", __dirname, name);

            var modelTpl = util.format("%s/../data/templates/model.js", __dirname);
            var routeTpl = util.format("%s/../data/templates/route.js", __dirname);            
            var itemTpl = util.format("%s/../data/templates/item.html", __dirname);
            var listTpl = util.format("%s/../data/templates/list.html", __dirname);

            step(
                function a() {                                        
                    path.exists(viewDir, this);
                },
                function b(err) {                    
                    if(err)  {
                        res.local("message", {
                            type:"Exception",
                            message: "模块已经存在."
                        });
                        next();
                    }
                    else {
                        fs.mkdir(viewDir, this);    
                    }                    
                },
                function c(err) {
                    if(err)  {
                        res.local("message", {
                            type:"Exception",
                            message: "模块视图目录创建失败."
                        });
                        next();
                    }
                    else {
                        var group = this.group();
                        fs.readFile(modelTpl, group());
                        fs.readFile(routeTpl, group());
                        fs.readFile(itemTpl, group());
                        fs.readFile(listTpl, group());
                    }                    
                },
                function d(err, tpls) {
                    if(err)  {
                        res.local("message", {
                            type:"Exception",
                            message: "读取模版文件失败."
                        });
                        next();
                    }
                    else {
                        var uname = utils.ucfirst(name);

                        console.log(fields);
                        fields = eval(fields);
                        console.log(fields);
                        

                        var ands = "";
                        var modelItem = "%s:        { type: String, required: true}";
                        var modelFields = "";

                        var itemItem = '\t<div class="control-group">\n\t\t<label class="control-label" for="%s">%s</label><div class="controls"><input value="<\%- item.%s\%>" name="%s" id="%s" class="input-xlarge focused" type="text" placeholder="输入%s…"></div>\n\t</div>';
                        var itemFields = "";

                        var listHeader = "\t\t\t<th>%s</th>\n";
                        var listHeaders = "";

                        var listItem = "\t\t\t<td><%- item.%s%></td>\n";
                        var listItems = "";


                        var routeField = "\t\t\tmodel.%s = req.body.%s;\n";
                        var routeFields = "";


                        fields.forEach(function(field, index) {
                            var tmp = util.format(modelItem, field.name);
                            modelFields = util.format("%s\n%s%s", modelFields, ands, tmp);

                            tmp = util.format(itemItem, field.name, field.intro, field.name, field.name, field.intro);
                            itemFields = util.format("%s\n%s", itemFields, tmp);

                            tmp = util.format(listHeader, field.intro);
                            listHeaders = util.format("%s\n%s", listHeaders, tmp);

                            tmp = util.format(listItem, field.name);
                            listItems = util.format("%s\n%s", listItems, tmp);

                            tmp = util.format(routeField, field.name, field.name);
                            routeFields = util.format("%s\n%s", routeFields, tmp);

                            ands = "\t, ";
                        });

                        var modelTpl = "" + tpls[0];                                                
                        modelTpl = modelTpl.replace(/#name#/gi, name)   
                                           .replace(/#uname#/gi, uname)
                                           .replace(/#fields#/gi, modelFields)
                                           .replace(/#nickname#/gi, nickname);
                        var routeTpl = "" + tpls[1];
                        routeTpl = routeTpl.replace(/#name#/gi, name)
                                           .replace(/#uname#/gi, uname)
                                           .replace(/#fields#/gi, routeFields)                                           
                                           .replace(/#nickname#/gi, nickname);
                        var itemTpl = "" + tpls[2];
                        itemTpl = itemTpl.replace(/#name#/gi, name)  
                                         .replace(/#items#/gi, itemFields)                                   
                                         .replace(/#nickname#/gi, nickname);
                        var listTpl = "" + tpls[3];
                        listTpl = listTpl.replace(/#name#/gi, name)
                                         .replace(/#headers#/gi, listHeaders)  
                                         .replace(/#items#/gi, listItems)  
                                         .replace(/#nickname#/gi, nickname);

                        var group = this.group();
                        var modelT = util.format("%s/../models/%s.js", __dirname, name);
                        var routeT = util.format("%s/../routes/%s.js", __dirname, name);
                        var itemT = util.format("%s/../views/%s/item.html", __dirname, name);
                        var listT = util.format("%s/../views/%s/list.html", __dirname, name);

                        var group = this.group();
                        fs.writeFile(modelT, modelTpl, group());
                        fs.writeFile(routeT, routeTpl, group());
                        fs.writeFile(itemT, itemTpl, group());
                        fs.writeFile(listT, listTpl, group());
                    }                    
                },
                function e(err) {
                    if(err)  {
                        console.log(err);
                        res.local("message", {
                            type:"Exception",
                            message: "写入模版文件失败."
                        });                        
                    }
                    else {
                        res.local("message", {
                            type: "Success",
                            message: "已经全部成功生成."
                        });
                    }
                    next();
                }
            );
        }
        //res.render("system/tools");
    }, function(req, res) {
        res.render("system/tools");
    });

    app.get('/system/logs', function(req, res) {              
        var cmd = util.format("tail -n 100 %s" , utils.logfile);        
        var p = procstreams(cmd);        
        if( "undefined" !== typeof req.query.level) {            
            p = p.pipe("grep " + req.query.level.toUpperCase() );
        }
        p.pipe("nl").data(function(stdout, stderr) {
            if(stderr) throw stderr;
            res.render("system/logs", {c: stdout});
        });
    });

    app.get('/system/statall', function(req, res) {
        StatModel.statAll();

        res.write("OK");
        res.end();
    });

    app.get('/system/userlog', function(req, res) {
        var cond = null;
        var keyword = "";
        if(typeof(req.query.keyword) != "undefined" && req.query.keyword) {
            keyword = req.query.keyword;
            cond = {
                $or: [
                    {action : new RegExp(keyword, "gi")},
                    {username : new RegExp(keyword, "gi")}
                ]
            };
        } 

        var page = 1;
        if(typeof(req.query.page) != "undefined" && req.query.page) {
            page = +req.query.page;
        }

        var pagesize = 12;
        var opts = {
            skip: (page-1)*pagesize,
            limit: pagesize,
            sort: {_id: -1}
        };
        LogModel.count(cond, function(err, count) {
            if(err) throw err;

            LogModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("system/userlog", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count
    });

}; 