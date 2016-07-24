const nconf = require( 'nconf' );

nconf.argv()
	.env()
	.file( { file: './config.json' } );

class ConfigManager {
	static get( key ) {
		return nconf.get( key );
	}

	static set( key, data ) {
		nconf.set( key, data );
		nconf.save( ( err ) => {
			if ( err ) {
				console.log( 'CONFIG ERR: ', err );
			}
		} );
	}
}

module.exports = ConfigManager;