const consts = require( 'native-dns-packet' ).consts;

class DnsCache {
	constructor() {
		this.cache = {
			hosts: {},
			config: {
				defaultTTL: 5 * 60
			}
		};

		this.staticEntries = [];
	}

	updateCacheFromQuery( query, result ) {
		this.updateCacheForHostAndRecord( query.name, query.type, result );
	}

	updateCacheForHostAndRecord( host, type, result ) {
		if ( ! this.cache.hosts[ host ] ) {
			this.cache.hosts[ host ] = {
				records: {}
			};
		}

		this.cache.hosts[ host ].records[ type ] = result;
	}

	query( query ) {
		if ( this.cache.hosts[ query.name ] && this.cache.hosts[ query.name ].records[ query.type ] ) {
			return this.cache.hosts[ query.name ].records[ query.type ];
		}
		else {
			return null;
		}
	}

	addStaticEntry( entry ) {
		let parsedEntry = DnsCache.parseStaticEntryToAnswer( entry );

		this.updateCacheForHostAndRecord( parsedEntry.name, parsedEntry.type, [ parsedEntry ] );

		return true;
	}

	/**
	 * Remove all static entries for a host, so they can be updated later
	 *
	 * @param {string} host
	 */
	removeStaticEntry( host ) {
		if ( this.cache.hosts[ host ] ) {
			delete this.cache.hosts[ host ];
		}
	}

	static parseStaticEntryToAnswer( entry ) {
		return {
			name: entry.host,
			address: entry.destination,
			type: consts.nameToQtype( entry.type ),
			ttl: entry.ttl,
			class: 1
		};
	}
}

module.exports = DnsCache;
