require.config({
	baseUrl: "",
	paths: {
		'routie': 'lib/routie/routie',
		'jquery': 'lib/jquery/jquery',
		'tmpl': 'lib/blueimp-tmpl/tmpl'
	},
	
	shim: {
		'assets/template/main/Main': {
			deps: ['routie', 'tmpl', 'jquery']
		}
	}
	
});

require(['assets/template/main/Main'], function(Main) {
 	return new Main();
});
