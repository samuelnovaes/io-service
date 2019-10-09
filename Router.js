const each = require('./each')

class Router {

	constructor() {
		this._routes = {}
	}

	_run(subroutes, socket, packet) {
		const middlewares = this._routes[subroutes[0].trim()]

		if (middlewares) {
			each(middlewares, (middleware, next) => {
				if (middleware instanceof Router) {
					if (subroutes[1]) {
						middleware._run(subroutes.splice(1), socket, packet)
					}
				}
				else {
					middleware({ socket, path: packet[0], body: packet[1], next })
				}
			})
		}
	}

	/**
	 * @param {string} path
	 * @param {...(ctx: { socket: SocketIO.Socket, path: string, body: any, next: () => void }) => void} middlewares
	 */
	on(path, ...middlewares) {
		for (const middleware of middlewares) {
			if (this._routes[path]) {
				this._routes[path].push(middleware)
			}
			else {
				this._routes[path] = [middleware]
			}
		}
	}

}

module.exports = Router