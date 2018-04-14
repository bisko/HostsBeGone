import { consts } from 'native-dns-packet';

export default class DnsCache {
	cache = {
		hosts: {},
		config: {
			defaultTTL: 5 * 60
		}
	};

	staticEntries = [];

	flushCache() {
		this.cache.hosts = {};
	}

	getCacheSize() {
		return Object.keys( this.cache.hosts ).length;
	}

	getCacheList() {
		const result = [];
		Object.keys( this.cache.hosts ).forEach( ( host ) => {
			Object.keys( this.cache.hosts[ host ] ).forEach( ( entryType ) => {
				result.push( this.cache.hosts[ host ][ entryType ] );
			} );
		} );

		return result;
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

		const currentTime = new Date();
		this.cache.hosts[ host ].records[ type ] = result.map( ( entry ) => ( {
			...entry,
			last_update: currentTime.getTime()
		} ) );

	}

	query( query ) {
		if ( this.cache.hosts[ query.name ] && this.cache.hosts[ query.name ].records[ query.type ] ) {
			return this.cache.hosts[ query.name ].records[ query.type ];
		}

		return null;
	}

	addStaticEntry( entry ) {
		const parsedEntry = DnsCache.parseStaticEntryToAnswer( entry );

		this.updateCacheForHostAndRecord( parsedEntry.name, parsedEntry.type, [ {
			...parsedEntry,
			static_entry: true
		} ] );

		return true;
	}

	/**
	 * Remove all static entries for a host, so they can be updated later
	 *
	 * @param {string} host The host to remove the static entry for
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
			'class': 1,
		};
	}
}
