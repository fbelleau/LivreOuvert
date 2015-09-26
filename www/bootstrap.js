require.config({
	baseUrl: "",
	paths: {
		'routie': 'lib/routie/routie',
		'jquery': 'lib/jquery/jquery',
		'tmpl': 'lib/blueimp-tmpl/tmpl'
	},
	
	shim: {
		'assets/livreouvert/main/Main': {
			deps: ['routie', 'tmpl', 'jquery']
		}
	}
	
});

require(['assets/livreouvert/main/Main'], function(Main) {
 	return new Main();
});
