const webpack = require( 'webpack' );
const WebpackDevServer = require( 'webpack-dev-server' );
const config = require( './webpack.config' );

new WebpackDevServer( webpack( config ), {
	publicPath: config.output.publicPath,
	contentBase: config.output.path,
	hot: true,
	historyApiFallback: true
} ).listen( 15552, 'localhost', function( err ) {
	if ( err ) {
		return console.log( err );
	}

	console.log( 'Listening at http://localhost:15552/' );
} );
