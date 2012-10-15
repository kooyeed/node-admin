var #uname#Schema = new mongoose.Schema({
    #fields#
  , createAt:       { type: String }
  , updateAt:       { type: String, default: "" }
}, {collection: "mama_#name#"});

/*
#uname#Schema.path('username').validate(function (v) {
    return /^\w*$/.test(v);
}, 'username');
*/

#uname#Schema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var #uname#Model = exports = module.exports = mongoose.model('#uname#', #uname#Schema);
