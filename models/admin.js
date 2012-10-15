var AdminSchema = new mongoose.Schema({
    username:       { type: String, required: true, unique: true, trim: true }
  , password:       { type: String, required: true, trim: true}
  , nickname:       { type: String, default: "", trim: true}
  , createAt:       { type: String }
  , updateAt:       { type: String, default: "" }
}, {collection: "mama_admin"});

AdminSchema.path('username').validate(function (v) {
    return /^\w*$/.test(v);
}, 'username');
 
AdminSchema.path('password').validate(function (v) {
    return v.length >= 6;
}, 'password'); 

AdminSchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var AdminModel = exports = module.exports = mongoose.model('Admin', AdminSchema);
