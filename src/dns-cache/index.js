
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
		this.updateCacheForHostAndRecord( query.host, query.record, result );
	}

	updateCacheForHostAndRecord( host, record, result ) {

		if ( ! this.cache.hosts[ host ] ) {
			this.cache.hosts[ host ] = {
				ttl: 500,
				records: {}
			};
		}

		this.cache.hosts[ host ].records[ record ] = result;
	}

	query( host, record ) {
		if ( this.cache.hosts[ host ] && this.cache.hosts[ host ].records[ record ] ) {
			return this.cache.hosts[ host ].records[ record ];
		}
		else {
			return null;
		}
	}

	purgeCache() {
		this.cache.hosts = {};

		// readd persisted entries
	}
}


module.exports = DnsCache;