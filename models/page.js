var PageSchema = new mongoose.Schema({    
  title:            { type: String, required: true}
, url:              { type: String, required: true}
, content:          { type: String, required: true}
, createAt:         { type: String }
, updateAt:         { type: String, default: "" }
}, {collection: "mama_page"});

/*
PageSchema.path('username').validate(function (v) {
    return /^\w*$/.test(v);
}, 'username');
*/

PageSchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var PageModel = exports = module.exports = mongoose.model('Page', PageSchema);
