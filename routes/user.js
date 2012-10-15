var UserModel = require("../models/user")
    , validateUser = require('../libs/validateuser')
    , step = require("step");

module.exports = function(app) {
    app.get("/user/create", validateUser, function(req, res) {            
        res.render("user/item", {
            item: new UserModel(),
            action: "create"
        });
    });
    app.post("/user/create", validateUser, function(req, res) {        
        var model = new UserModel();
        model.username = req.body.username;
        model.password = req.body.password;
        model.nickname = req.body.nickname;
        model.email = req.body.email;
        model.birthday = req.body.birthday;
        model.sex = req.body.sex;
        
        model.validate(function(err) {     
            if(err) {
                return res.render("user/item", {
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
                res.redirect("/user/list");    
            });                    
        }); //end validate
    });

    app.get("/user/modify/:id", validateUser, function(req, res) {
        UserModel.findById(req.params.id, function(err, doc) {
            if(err) throw err;
            res.render("user/item", {
                item: doc,
                action: "modify"
            });    
        });
    });

    app.post("/user/modify", validateUser, function(req, res) {
        UserModel.findById(req.body._id, function(err, doc) {
            if(err) throw err;

            doc.username = req.body.username;
            doc.password = req.body.password;
            doc.nickname = req.body.nickname;
            doc.email = req.body.email;
            doc.birthday = req.body.birthday;
            doc.sex = req.body.sex;
            doc.validate(function(err) {
                if(err) {
                    res.render("user/item", {
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
                    res.redirect("/user/list");
                });    
            });//end validate
        });
    });

    app.get("/user/remove/:id", validateUser, function(req, res) {
        var cond = {
            _id: req.params.id
        };
        UserModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/user/list");
        });
    });

    app.get("/user/bremove/:ids", validateUser, function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        UserModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/user/list");
        });
    }); 

    app.get("/user/list", function(req, res) {
        var cond = null;
        var keyword = "";
        if(typeof(req.query.keyword) != "undefined" && req.query.keyword) {
            keyword = req.query.keyword;
            cond = {
                $or: [
                    {username : new RegExp(keyword, "gi")},
                    {nickname : new RegExp(keyword, "gi")}
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
        UserModel.count(cond, function(err, count) {
            if(err) throw err;

            UserModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("user/list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action
};