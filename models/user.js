var UserSchema = new mongoose.Schema({
    username:       { type: String, required: true, unique: true, trim: true }
  , password:       { type: String, required: true, trim: true}
  , email:          { type: String, required: true}

  , nickname:       { type: String, default: "", trim: true}  
  , sex:            { type: String, enum:["F", "M", "U"]}
  , birthday:       { type: String, default: ""}
  , createAt:       { type: String }
  , updateAt:       { type: String, default: "" }
}, {collection: "mama_user"});

UserSchema.path('username').validate(function (v) {
    return /^\w*$/.test(v);
}, 'username');
 
UserSchema.path('password').validate(function (v) {
    return v.length >= 6;
}, 'password'); 

UserSchema.path('email').validate(function (v) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
}, 'email'); 

UserSchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var UserModel = exports = module.exports = mongoose.model('user', UserSchema);
