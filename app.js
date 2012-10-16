/**
 * Module dependencies.
 */

var express = require('express')
    , fs = require('fs')
    , util = require('util')
    , config = require('./config')
    , ejs = require('ejs')
    , log4js = require('log4js')
    , app = module.exports = express.createServer();    

//set view engine
app.set('views', __dirname + '/views');
app.register('html', ejs );
app.set('view engine', 'html');
//app.enabled('view cache');
//app.enabled('case sensitive routes');
//app.enabled('strict routing');

// middleware
app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(express.logger('dev'));
});

app.configure('production', function(){
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
    app.use(express.errorHandler());
});

app.configure(function(){
    app.use(express.bodyParser({uploadDir: __dirname + '/data/uploads'}));
    app.use(express.methodOverride());
    app.use(express.cookieParser('keyboard cat'));  
    app.use(express.session({ secret: 'keyboard cat' })); 
    app.use(app.router);  
    app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
});

// Locals
app.locals(config.globals);
app.locals({
    title: config.globals.web_name
});

/* for 3.x
app.locals.use(function(req, res) {
    res.locals.error = req.session.error || '';
    res.locals.message = req.session.message || '';    

    delete req.session.error;
    delete req.session.message;
});
*/

// set default layout, usually "layout"
app.set("view options", { layout: "layouts/admin" });

// set error handler
app.use(function(err, req, res, next) {
    console.error(err);
    res.render('500');
});

app.use(function(req, res) {
    res.render('404');
});

// load all routes
var routesDir = "./routes/";
fs.readdir(routesDir, function(err, files) {
    if (err) throw err;
    files.forEach(function(file) {
        if( /\w+\.js/.test(file) == true ) {            
            require(routesDir + file)(app);
        }
    });
});

// init database connection
var dbcfg = config.db.localhost;
var conn = util.format("mongodb://%s:%s@%s:%s/%s", 
                        dbcfg.auth.username, 
                        dbcfg.auth.password,
                        dbcfg.host,
                        dbcfg.port,
                        dbcfg.name);
mongoose = require("mongoose");
mongoose.connect(conn);

//load global util tool
utils = require('./libs/utils');

//init logger
utils.logfile = __dirname + '/data/logs/mama.log';
//log4js.addAppender(log4js.consoleAppender());
//log4js.addAppender(log4js.fileAppender(utils.logfile), 'mama');
logger = log4js.getLogger("mama");
logger.setLevel('DEBUG');

//init some global params
utils.readmeFile = __dirname + '/data/readme.txt';
utils.config = config;

//start web server
if (!module.parent) {
    app.listen(8888);
    logger.debug('Express started on port 8888');
}   



process.on('uncaughtException', function (err) {
    logger.error(err);
});