var LogModel = require("../models/log")
    , StatModel = require("../models/stat")
    , AdminModel = require("../models/admin")
    , fs = require("fs")
    , request = require('request')
    , validateUser = require('../libs/validateuser')
    , step = require("step");

module.exports = function(app) {
    var _login = function(req, res) {   
        res.render("admin/login", {
            isLoginPage: false
        });
    };
    app.get("/admin/login", _login);
    app.get("/login", _login);

    app.post("/admin/login", function(req, res) {
        var username = req.body.username || "unset";
        var password = req.body.password || "";

        var cond = {
            username: username,
            password: password
        };
        AdminModel.findOne(cond, function(err, doc) {        
            var result = null;
            if(err || !doc) {
                result = utils.json_encode({result: false, message: ""});
                res.write(result);
                res.end();
                return false;
            }
            req.session.user = {      
                _id: doc._id,      
                username: doc.username,
                nickname: doc.nickname
            };

            request(utils.config.globals.web_site + '/system/statall');
            LogModel.log(username, 'login', 'admin/login', utils.ip(req) );
            
            result = utils.json_encode({result: true, message: ""});
            res.write(result);
            res.end();
        });        
    }); 

    app.get("/admin/home", validateUser, function(req, res) {
        var cond = null;
        var fields = {};
        var opt = {
            skip:0,
            sort: {_id: -1},
            limit: 10
        };
        var data = {};

        /** parallel */        
        //console.time('step');
        step(
            function first() {
                opt.sort = {count: -1};
                fields = { col: 1, intro: 1, count: 1, _id: 0 };
                StatModel.find(cond, fields, opt, this.parallel() );

                opt.sort = {_id: -1};
                fields = { username: 1, action: 1, ip: 1, path: 1, createAt: 1, _id: 0 };
                LogModel.find(cond, fields, opt, this.parallel() );

                fs.readFile(utils.readmeFile, this.parallel() );
            },
            function last(err, stats, logs, readme) {
                if(err) throw err;

                data.stats = stats;
                data.logs = logs;
                data.readme = readme;
                data.homemenu = utils.config.homemenu;

                //console.timeEnd('step');
                res.render("admin/home", data);
            }
        );
        
        

        /*
        console.time('common');
        opt.sort = {count: -1};
        fields = { col: 1, intro: 1, count: 1, _id: 0 };
        StatModel.find(cond, fields, opt, function(err ,stats) {
            if(err) throw err;

            opt.sort = {_id: -1};
            fields = { username: 1, action: 1, ip: 1, path: 1, createAt: 1, _id: 0 };
            LogModel.find(cond, fields, opt, function(err ,logs) {
                if(err) throw err;

                fs.readFile(utils.readmeFile, function(err ,readme) {
                    if(err) throw err;

                    var data = {};
                    data.stats = stats;
                    data.logs = logs;
                    data.readme = readme;
                    data.homemenu = utils.config.homemenu;

                    console.timeEnd('common');
                    res.render("admin/home", data);
                });
            });
        });
        */

        /*
        console.time('eventproxy');
        var EventProxy = require("eventproxy").EventProxy;

        var proxy = new EventProxy();
        var render = function (stats, logs, readme){
            var data = {};
            data.stats = stats;
            data.logs = logs;
            data.readme = readme;
            data.homemenu = utils.config.homemenu;

            console.timeEnd('eventproxy');
            return res.render("admin/home", data);
        };
        proxy.assign("stats", "logs", "readme", render);

        opt.sort = {count: -1};
        fields = { col: 1, intro: 1, count: 1, _id: 0 };
        StatModel.find(cond, fields, opt, function(err ,stats) {
            if(err) throw err;

            proxy.trigger("stats", stats);    
        }); 

        opt.sort = {_id: -1};
        fields = { username: 1, action: 1, ip: 1, path: 1, createAt: 1, _id: 0 };
        LogModel.find(cond, fields, opt, function(err ,logs) {
            if(err) throw err;

            proxy.trigger("logs", logs);    
        });

        fs.readFile(utils.readmeFile, function(err ,readme) {
            if(err) throw err;

            proxy.trigger("readme", readme);
        }); 
        */
    });

    app.get("/admin/profile", validateUser, function(req, res) {
        res.redirect("/admin/modify/" + req.session.user._id);
    });

    app.get("/admin/logout", validateUser, function(req, res) {
        req.session.destroy();
        //res.clearCookie(config.auth_cookie_name, { path: '/' });
        res.redirect(req.headers.referer || "/admin/login");
    });

    //-------------------------admin crud-------------------------------------*/
    app.get("/admin/create", validateUser, function(req, res) {            
        res.render("admin/item", {
            item: new AdminModel(),
            action: "create"
        });
    });
    app.post("/admin/create", validateUser, function(req, res) {        
        var model = new AdminModel();
        model.username = req.body.username;
        model.password = req.body.password;
        model.nickname = req.body.nickname;
        
        model.validate(function(err) {     
            if(err) {
                return res.render("admin/item", {
                    item: model,
                    action: "create",
                    message: {
                        type: "Error",
                        message: utils.getErrorMessage(err)
                    }
                });
            }                   
            model.save(function(err, doc) {
                if(err) throw err;
                res.redirect("/admin/list");    
            });                    
        }); //end validate
    });

    app.get("/admin/modify/:id", validateUser, function(req, res) {
        AdminModel.findById(req.params.id, function(err, doc) {
            if(err) throw err;
            res.render("admin/item", {
                item: doc,
                action: "modify"
            });    
        });
    });

    app.post("/admin/modify", validateUser, function(req, res) {
        AdminModel.findById(req.body._id, function(err, doc) {
            if(err) throw err;

            doc.username = req.body.username;
            doc.password = req.body.password;
            doc.nickname = req.body.nickname;
            doc.validate(function(err) {
                if(err) {
                    res.render("admin/item", {
                        item: doc,
                        action: "modify",
                        message: {
                            type: "Error",
                            message: utils.getErrorMessage(err)
                        }
                    });
                    return false;
                }
                
                doc.save(function(err, doc) {
                    if(err) throw err;                    
                    res.redirect("/admin/list");
                });    
            });//end validate
        });
    });

    app.get("/admin/remove/:id", validateUser, function(req, res) {
        var cond = {
            _id: req.params.id
        };
        AdminModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/admin/list");
        });
    });

    app.get("/admin/bremove/:ids", validateUser, function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        AdminModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/admin/list");
        });
    }); 

    app.get("/admin/list", function(req, res) {
        var cond = null;
        var keyword = "";
        if(typeof(req.query.keyword) != "undefined" && req.query.keyword) {
            keyword = req.query.keyword;
            cond = {
                $or: [
                    {name : new RegExp(keyword, "gi")},
                    {code : new RegExp(keyword, "gi")}
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
        AdminModel.count(cond, function(err, count) {
            if(err) throw err;

            AdminModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("admin/list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action
};