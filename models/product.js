var ProductSchema = new mongoose.Schema({
    
name:        { type: String, required: true}
	, category:        { type: String, required: true}
	, intro:        { type: String, required: true}
  , createAt:       { type: String }
  , updateAt:       { type: String, default: "" }
}, {collection: "mama_product"});

/*
ProductSchema.path('username').validate(function (v) {
    return /^\w*$/.test(v);
}, 'username');
*/

ProductSchema.pre("save",function(next) {
    var now = utils.datetime.format("yyyy-MM-dd hh:mm:ss");
    if(this.isNew) {
        this.createAt = now;
    }
    else {
        this.updateAt = now; 
    }
    
    next();
});

var ProductModel = exports = module.exports = mongoose.model('Product', ProductSchema);
