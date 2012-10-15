var LogSchema = new mongoose.Schema({
    username:       { type: String, required: true }
  , action:         { type: String, required: true }
  , path:           { type: String, required: true }
  , ip:             { type: String, required: true }
  , createAt:       { type: String }
  , updateAt:       { type: String, default: "" }
}, {collection: "mama_log"});

LogSchema.pre("save",function(next) {  
    //console.log(utils.datetime.now);
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var LogModel = exports = module.exports = mongoose.model('log', LogSchema);

LogModel.log = function(username, action, path, ip) {
    var log = new LogModel();
    log.username = username;
    log.action = action;
    log.path = path;
    log.ip = ip;    
    log.save();   
};
