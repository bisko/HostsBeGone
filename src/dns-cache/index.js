
class DnsCache {
	constructor() {
		this.cache = {
			hosts: {},
			config: {
				defaultTTL: 5 * 60
			}
		};
	}

	updateCacheFromQuery( query, result ) {
		this.updateCacheForHostAndRecord( query.name, query.type, result );
	}

	updateCacheForHostAndRecord( host, record, result ) {

		if ( ! this.cache.hosts[ host ] ) {
			this.cache.hosts[ host ] = {
				ttl: 60,
				records: {}
			};
		}

		this.cache.hosts[ host ].records[ record ] = result;
	}

	query( query ) {
		if ( this.cache.hosts[ query.name ] && this.cache.hosts[ query.name ].records[ query.type ] ) {
			return this.cache.hosts[ query.name ].records[ query.type ];
		}
		else {
			return null;
		}
	}

	purgeCache() {
		this.cache.hosts = {};

		// read persisted entries
	}
}


module.exports = DnsCache;