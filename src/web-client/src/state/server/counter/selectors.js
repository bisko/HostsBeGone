export function getServerCounter( state ) {
	return state.server.counter.server_counter || 0;
}
