var PageModel = require("../models/page")
    , validateUser = require('../libs/validateuser')
    , step = require("step");

module.exports = function(app) {
    app.get("/page/create", validateUser, function(req, res) {            
        res.render("page/item", {
            item: new PageModel(),
            action: "create"
        });
    });
    app.post("/page/create", validateUser, function(req, res) {        
        var model = new PageModel();        
        
			model.title = req.body.title;

			model.url = req.body.url;

			model.content = req.body.content;
       
        
        model.validate(function(err) {     
            if(err) {
                return res.render("page/item", {
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
                res.redirect("/page/list");    
            });                    
        }); //end validate
    });

    app.get("/page/modify/:id", validateUser, function(req, res) {
        PageModel.findById(req.params.id, function(err, doc) {
            if(err) throw err;
            res.render("page/item", {
                item: doc,
                action: "modify"
            });    
        });
    });

    app.post("/page/modify", validateUser, function(req, res) {
        PageModel.findById(req.body._id, function(err, doc) {
            if(err) throw err;
            
			doc.title = req.body.title;
			doc.url = req.body.url;
			doc.content = req.body.content;

            doc.validate(function(err) {
                if(err) {
                    res.render("page/item", {
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
                    res.redirect("/page/list");
                });    
            });//end validate
        });
    });

    app.get("/page/remove/:id", validateUser, function(req, res) {
        var cond = {
            _id: req.params.id
        };
        PageModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/page/list");
        });
    });

    app.get("/page/bremove/:ids", validateUser, function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        PageModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/page/list");
        });
    }); 

    app.get("/page/list", function(req, res) {
        var cond = null;
        var keyword = "";
        if(typeof(req.query.keyword) != "undefined" && req.query.keyword) {
            keyword = req.query.keyword;
            cond = {
                $or: [                    
                    //{nickname : new RegExp(keyword, "gi")}
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
        PageModel.count(cond, function(err, count) {
            if(err) throw err;

            PageModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("page/list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action
};




