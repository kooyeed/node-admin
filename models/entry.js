var EntrySchema = new mongoose.Schema({
    name:       { type: String, required: true, unique: true, trim: true }
  , code:       { type: String, required: true, trim: true}  
  , dict:       { 
        _id:        { type: String, required: true}  
      , name:       { type: String, required: true}
  }
  , parent:     { type: String, default: "0"}
  , orderBy:    { type: Number, default: 0}
  , path:       { type: String, default: "0"}
  , createAt:   { type: String }
  , updateAt:   { type: String, default: "" }
}, {collection: "mama_entry"});

EntrySchema.path('name').validate(function (v) {
    return v.length > 1;
}, 'name');
 
EntrySchema.path('code').validate(function (v) {
    return /^[\w-]*$/.test(v);
}, 'code'); 

EntrySchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var EntryModel = exports = module.exports = mongoose.model('Entry', EntrySchema);
