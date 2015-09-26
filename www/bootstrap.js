require.config({
	baseUrl: "",
	paths: {
		'routie': 'lib/routie/routie',
		'masonry':'lib/masonry-layout/masonry.pkgd',
		'tmpl': 'lib/blueimp-tmpl/tmpl'
	},
	
	shim: {
		'assets/livreouvert/main/Main': {
			deps: ['routie', 'tmpl', 'masonry']
		}
	}
	
});

require(['assets/livreouvert/main/Main'], function(Main) {
 	return new Main();
});
