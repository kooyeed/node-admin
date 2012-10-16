var ProductModel = require("../models/product")
    , validateUser = require('../libs/validateuser')
    , step = require("step");

module.exports = function(app) {
    app.get("/product/create", validateUser, function(req, res) {            
        res.render("product/item", {
            item: new ProductModel(),
            action: "create"
        });
    });
    app.post("/product/create", validateUser, function(req, res) {        
        var model = new ProductModel();        
        
			model.name = req.body.name;

			model.category = req.body.category;

			model.intro = req.body.intro;
       
        
        model.validate(function(err) {     
            if(err) {
                return res.render("product/item", {
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
                res.redirect("/product/list");    
            });                    
        }); //end validate
    });

    app.get("/product/modify/:id", validateUser, function(req, res) {
        ProductModel.findById(req.params.id, function(err, doc) {
            if(err) throw err;
            res.render("product/item", {
                item: doc,
                action: "modify"
            });    
        });
    });

    app.post("/product/modify", validateUser, function(req, res) {
        ProductModel.findById(req.body._id, function(err, doc) {
            if(err) throw err;

            
			doc.name = req.body.name;

			doc.category = req.body.category;

			doc.intro = req.body.intro;

            doc.validate(function(err) {
                if(err) {
                    res.render("product/item", {
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
                    res.redirect("/product/list");
                });    
            });//end validate
        });
    });

    app.get("/product/remove/:id", validateUser, function(req, res) {
        var cond = {
            _id: req.params.id
        };
        ProductModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/product/list");
        });
    });

    app.get("/product/bremove/:ids", validateUser, function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        ProductModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/product/list");
        });
    }); 

    app.get("/product/list", function(req, res) {
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
        ProductModel.count(cond, function(err, count) {
            if(err) throw err;

            ProductModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("product/list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action
};




