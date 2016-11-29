const webpack = require( 'webpack' );
const path = require( 'path' );

const BUILD_DIR = path.resolve( __dirname, 'src/web-client/build' );
const APP_DIR = path.resolve( __dirname, 'src/web-client' );

const config = {
	entry: [
		'webpack-dev-server/client?http://localhost:15552', // WebpackDevServer host and port
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
			},
			{
				test: /\.scss$/,
				loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
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
