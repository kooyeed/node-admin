var config = {
    globals: {
        web_name: "gearman服务控制台 v0.1.2",
        web_site: "http://www.ss.node",
        url_base: "",
        url_rs: "http://www.ss.node",
        icp: "ooxx"
    },
    homemenu: [
        {url: "/system/logs", size: "150x120", intro: "服务1", icon: "images/homebar/1.jpg"},
        {url: "/system/logs", size: "150x120", intro: "服务2", icon: "images/homebar/3.jpg"},
        {url: "/system/logs", size: "150x120", intro: "服务3", icon: "images/homebar/5.jpg"},
        {url: "/system/logs", size: "150x120", intro: "服务4", icon: "images/homebar/7.jpg"},
        {url: "/system/logs", size: "150x120", intro: "服务5", icon: "images/homebar/10.jpg"},        
    ],
	db: {
		localhost: {
			host: "localhost",
			port: 27017, //mongo.Connection.DEFAULT_PORT	
			name: "test",
			server_options: {				
				auto_reconnect: true,
				poolSize: 2				
			},
			db_options: {
				strict: false,
				native_parser: false				
			},
			auth: {
				username:'tony',
				password:'541888'
			}			
		},
		grandcloud: {
			host: "mongoc2.grandcloud.cn",
			port: 10005,	
			name: "sgx2",
			server_options: {				
				auto_reconnect: true,
				poolSize: 2				
			},
			db_options: {
				strict: false,
				native_parser: false				
			},
			auth: {
				username:'tony',
				password:'541888'
			}			
		}
	}
};
exports = module.exports = config; 
