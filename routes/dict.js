var DictModel = require("../models/dict")
  , EntryModel = require("../models/entry")
  , LogModel = require("../models/log")
  , utils = require("../libs/utils");

module.exports = function(app) {    
    app.get("/dict/dictcreate", function(req, res) {    
        res.render("dict/dict_item", {
            item: new DictModel(),
            action: "dictcreate"
        });
    });
    app.post("/dict/dictcreate", function(req, res) {
        LogModel.log(req.session.user.username, 'create dict', "dict/dictcreate", utils.ip(req));

        var model = new DictModel();
        model.name = req.body.name;
        model.code = req.body.code;
        model.validate(function(err) {            
            if(err) {                  
                return res.render("dict/dict_item", {
                    item: model,
                    action: "dictcreate",
                    message: {
                        type: "Error",
                        message: utils.getErrorMessage(err)
                    }
                });
            }            
            model.save(function(err, doc) {
                if(err) throw err;
                res.redirect("/dict/dictlist");    
            });    
        });        
    });

    app.get("/dict/dictmodify/:id", function(req, res) {
        DictModel.findById(req.params.id, function(err, doc) {
            if(err) throw err;
            res.render("dict/dict_item", {
                item: doc,
                action: "dictmodify"
            });    
        });                
    });

    app.post("/dict/dictmodify", function(req, res) {
        LogModel.log(req.session.user.username, 'modify dict', "dict/dictmodify", utils.ip(req));

        DictModel.findById(req.body._id, function(err, doc) {
            if(err) throw err;

            doc.name = req.body.name;
            doc.code = req.body.code;
            doc.validate(function(err) {
                if(err) {
                    return res.render("dict/dict_item", {
                        item: doc,
                        action: "dictmodify",
                        message: {
                            type: "Error",
                            message: utils.getErrorMessage(err)
                        }
                    });
                }

                doc.save(function(err, doc) {
                    if(err) throw err;                    
                    res.redirect("/dict/dictlist");
                });    
            });
        });
    });

    app.get("/dict/dictremove/:id", function(req, res) {
        LogModel.log(req.session.user.username, 'remove dict:' + req.params.id, "dict/dictremove", utils.ip(req));
        var cond = {
            _id: req.params.id
        };
        DictModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/dict/dictlist");
        });
    });

    app.get("/dict/dictbremove/:ids", function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        DictModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/dict/dictlist");
        });
    }); 

    app.get("/dict/dictlist", function(req, res) {
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
        DictModel.count(cond, function(err, count) {
            if(err) throw err;

            DictModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("dict/dict_list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action

    //-------------------sep----------------------------------------------------
    app.get("/dict/entrycreate", function(req, res) {            
        DictModel.find(null, {name: 1}, function(err,docs) {
            res.render("dict/entry_item", {
                item: new EntryModel(),
                action: "entrycreate",
                dicts: docs
            });
        });
        
    });
    app.post("/dict/entrycreate", function(req, res) {        
        var model = new EntryModel();
        model.name = req.body.name;
        model.code = req.body.code;
        model.dict = {};
        model.dict._id = req.body.dict;                
        model.path = "0";        
        DictModel.findById(req.body.dict,{name: 1,_id: 0}, function(err, doc) {      
            if(err) throw err;
            model.dict.name = doc.name;
            model.validate(function(err) {     
                if(err) {             
                    DictModel.find(null, {name: 1}, function(err2, docs) {  
                        if(err2) throw err2;                     
                        res.render("dict/entry_item", {
                            item: model,
                            action: "entrycreate",
                            message: {
                                type: "Error",
                                message: utils.getErrorMessage(err)
                            },
                            dicts: docs
                        });
                    });
                    return false;
                }                   
                model.save(function(err, doc) {
                    if(err) throw err;
                    res.redirect("/dict/entrylist");    
                });                    
            }); //end validate
        });//end find dict
    });

    app.get("/dict/entrymodify/:id", function(req, res) {
        DictModel.find(null, {name: 1}, function(err, docs) { 
            if(err) throw err;
            EntryModel.findById(req.params.id, function(err, doc) {
                if(err) throw err;
                res.render("dict/entry_item", {
                    item: doc,
                    action: "entrymodify",
                    dicts: docs
                });    
            });                
        });
    });

    app.post("/dict/entrymodify", function(req, res) {
        EntryModel.findById(req.body._id, function(err, doc) {
            if(err) throw err;

            doc.name = req.body.name;
            doc.code = req.body.code;
            DictModel.findById(req.body.dict, {name: 1,_id: 0}, function(err, doc2) {
                if(err) throw err;
                doc.dict.name = doc2.name;
                doc.validate(function(err) {
                    if(err) {
                        DictModel.find(null, {name: 1}, function(err, docs) {
                            if(err) throw err;
                            res.render("dict/entry_item", {
                                item: doc,
                                action: "entrymodify",
                                message: {
                                    type: "Error",
                                    message: utils.getErrorMessage(err)
                                },
                                dicts: docs
                            });
                        });
                        return false;
                    }
                    
                    doc.save(function(err, doc) {
                        if(err) throw err;                    
                        res.redirect("/dict/entrylist");
                    });    
                });//end validate
            });//end find dict
        });//end find by id
    });

    app.get("/dict/entryremove/:id", function(req, res) {
        var cond = {
            _id: req.params.id
        };
        EntryModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/dict/entrylist");
        });
    });

    app.get("/dict/entrybremove/:ids", function(req, res) {
        var ids = req.params.ids.split(",");
        var ors = [];
        ids.forEach(function(id,index) {
            ors.push({_id: id});
        });
        var cond = {
            $or: ors
        };
        EntryModel.remove(cond, function(err, doc) {
            if(err) throw err;
            res.redirect("/dict/entrylist");
        });
    }); 

    app.get("/dict/entrylist", function(req, res) {
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
        EntryModel.count(cond, function(err, count) {
            if(err) throw err;

            EntryModel.find(cond,null, opts, function(err, docs) {
                if(err) throw err;
                res.render("dict/entry_list", {
                    items: docs,
                    keyword: keyword,
                    total: count,
                    page: page
                });
            });//end find 
        })//end count        
    });//end action
};