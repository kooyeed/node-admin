var NewsModel = require("../models/news")
    , validateUser = require('../libs/validateuser')
    , step = require("step");

module.exports = function(app) {
    app.get("/News/create", validateUser, function(req, res) {            
        res.render("news/item", {
            item: new NewsModel(),
            action: "create"
        });
    });
    app.post("/News/create", validateUser, function(req, res) {        
        var model = new NewsModel();        
        
			model.name = req.body.name;

			model.intro = req.body.intro;
       
        
        model.validate(function(err) {     
            if(err) {
                return res.render("news/item", {
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
                res.redirect("/news/list");    
            });                    
        }); //end validate
    });

    app.get("/News/modify/:id", validateUser, function(req, res) {
        NewsModel.findById(req.params.id, function(err, doc) {
            if(err) throw err;
            res.render("news/item", {
                item: doc,
                action: "modify"
            });    
        });
    });

    app.post("/News/modify", validateUser, function(req, res) {
        NewsModel.findById(req.body._id, function(err, doc) {
            if(err) throw err;

            
			model.name = req.body.name;

			model.intro = req.body.intro;

            doc.validate(function(err) {
                if(err) {
                    res.render("news/item", {
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
                    res.redirect("/news/list");
                });    
            });//end validate
        });
    });

    app.get("/News/remove/:id", validateUser, function(req, res) {
        var cond = {
            _id: req.params.id
        };
        NewsModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/news/list");
        });
    });

    app.get("/News/bremove/:ids", validateUser, function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        NewsModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/news/list");
        });
    }); 

    app.get("/News/list", function(req, res) {
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
        NewsModel.count(cond, function(err, count) {
            if(err) throw err;

            NewsModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("news/list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action
};




