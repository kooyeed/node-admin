var util = require("util")
    , DictModel = require("./dict")
    , EntryModel = require("./entry")
    , UserModel = require("./user")
    , LogModel = require("./log");

var StatSchema = new mongoose.Schema({
    col:            { type: String, required: true }
  , count:          { type: String, required: true }
  , intro:          { type: String, required: true }  
  , createAt:       { type: String }
  , updateAt:       { type: String, default: "" }
}, {collection: "mama_stat"});

StatSchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var StatModel = exports = module.exports = mongoose.model('stat', StatSchema);

StatModel.statAll = function() {    
    var today = {
        createAt: {
            "$gte": utils.datetime.format("yyyy-MM-dd") + " 00:00:00",
            "$lte": utils.datetime.format("yyyy-MM-dd") + " 23:59:59"
        }
    };    
    var conds = [
        {model: DictModel,  cond: null,     col: "字典", intro: "全部"},
        {model: DictModel,  cond: today,    col: "字典", intro: "今日"},
        {model: EntryModel, cond: null,     col: "条目", intro: "全部"},
        {model: EntryModel, cond: today,    col: "条目", intro: "今日"},
        {model: UserModel,  cond: null,     col: "用户", intro: "全部"},
        {model: UserModel,  cond: today,    col: "用户", intro: "今日"}
    ];

    var opt = {
        upsert: true
    };    
    var cond = null;
    conds.forEach(function(item, index) {        
        item.model.count(item.cond, function(err, cnt) {
            if(err) throw err;      

            cond = {
                col: item.col,
                intro: item.intro
            }

            var stat = {};
            stat.col = item.col;
            stat.intro = item.intro;
            stat.count = cnt;
            StatModel.update(cond, stat, opt, function(err, doc) {
                if(err) throw err;                
                var msg = util.format("stat:[%s:%s:%s]", stat.col, stat.intro, stat.count);
                logger.info(msg);
            });//end save
        });//end count
    });//end foreach    
};