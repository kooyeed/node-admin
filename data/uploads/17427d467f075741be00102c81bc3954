var NewsSchema = new mongoose.Schema({
    
name:        { type: String, required: true}
	, intro:        { type: String, required: true}
  , createAt:       { type: String }
  , updateAt:       { type: String, default: "" }
}, {collection: "mama_news"});

/*
NewsSchema.path('username').validate(function (v) {
    return /^\w*$/.test(v);
}, 'username');
*/

NewsSchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var NewsModel = exports = module.exports = mongoose.model('News', NewsSchema);
