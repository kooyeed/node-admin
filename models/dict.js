var DictSchema = new mongoose.Schema({
    name:       { type: String, required: true, unique: true, trim: true }
  , code:       { type: String, required: true, trim: true}
  , intro:      { type: String, default: "", trim: true}
  , createAt:   { type: String }
  , updateAt:   { type: String, default: "" }
}, {collection: "mama_dict"});

DictSchema.path('name').validate(function (v) {
    return v.length > 1;
}, 'name');
 
DictSchema.path('code').validate(function (v) {
    return /^[\w-]*$/.test(v);
}, 'code'); 

DictSchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var DictModel = exports = module.exports = mongoose.model('Dict', DictSchema);
