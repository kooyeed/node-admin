var #uname#Model = require("../models/#name#")
    , validateUser = require('../libs/validateuser')
    , step = require("step");

module.exports = function(app) {
    app.get("/#uname#/create", validateUser, function(req, res) {            
        res.render("#name#/item", {
            item: new #uname#Model(),
            action: "create"
        });
    });
    app.post("/#uname#/create", validateUser, function(req, res) {        
        var model = new #uname#Model();        
        #fields#       
        
        model.validate(function(err) {     
            if(err) {
                return res.render("#name#/item", {
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
                res.redirect("/#name#/list");    
            });                    
        }); //end validate
    });

    app.get("/#uname#/modify/:id", validateUser, function(req, res) {
        #uname#Model.findById(req.params.id, function(err, doc) {
            if(err) throw err;
            res.render("#name#/item", {
                item: doc,
                action: "modify"
            });    
        });
    });

    app.post("/#uname#/modify", validateUser, function(req, res) {
        #uname#Model.findById(req.body._id, function(err, doc) {
            if(err) throw err;

            #fields#
            doc.validate(function(err) {
                if(err) {
                    res.render("#name#/item", {
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
                    res.redirect("/#name#/list");
                });    
            });//end validate
        });
    });

    app.get("/#uname#/remove/:id", validateUser, function(req, res) {
        var cond = {
            _id: req.params.id
        };
        #uname#Model.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/#name#/list");
        });
    });

    app.get("/#uname#/bremove/:ids", validateUser, function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        #uname#Model.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/#name#/list");
        });
    }); 

    app.get("/#uname#/list", function(req, res) {
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
        #uname#Model.count(cond, function(err, count) {
            if(err) throw err;

            #uname#Model.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("#name#/list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action
};




