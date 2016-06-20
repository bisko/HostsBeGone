var webpack = require( 'webpack' );
var path = require( 'path' );

var BUILD_DIR = path.resolve( __dirname, 'src/web-client/build' );
var APP_DIR = path.resolve( __dirname, 'src/web-client' );

var config = {
	entry: [
		'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
		'webpack/hot/only-dev-server',
		'./src/web-client'
	],
	output: {
		path: APP_DIR,
		filename: BUILD_DIR + '/bundle.js',
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: [ 'react-hot', 'babel' ],
				include: path.join( __dirname, 'src' )
			}
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	resolve: {
		extensions: [ '', '.js', '.jsx' ]
	}
};

module.exports = config;