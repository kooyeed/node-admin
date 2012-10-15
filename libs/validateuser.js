var validateUser = exports = module.exports = function(req, res, next) {
    console.log(req.session.user);
    if("undefined" === typeof req.session.user) {
        return res.redirect("/admin/login");
    }

    next();
};