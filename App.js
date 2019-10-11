const socketIO = require('socket.io')
const http = require('http')
const https = require('https')
const getStatic = require('./getStatic')
const Router = require('./Router')

class App extends Router {
	/**
	 * @param {{httpsOptions: https.ServerOptions, public: string}} options
	 */
	constructor(options = {}) {
		super()

		if (options.httpsOptions) {
			this._server = https.createServer(options.httpsOptions, (req, res) => {
				getStatic(options.public, req, res)
			})
		}
		else {
			this._server = http.createServer((req, res) => {
				getStatic(options.public, req, res)
			})
		}

		this.io = socketIO(this._server)
		this._onConnect = null
		this._onDisconnect = null

		this.io.on('connection', (socket) => {
			if (this._onConnect) {
				this._onConnect(socket)
			}

			socket.use((packet, next) => {
				const subroutes = packet[0].trim().split('/')
				this._run(subroutes, socket, packet)
				next()
			})

			socket.on('disconnect', (body) => {
				if (this._onDisconnect) {
					this._onDisconnect(socket, body)
				}
			})
		})
	}

	/**
	 * @param {string} path
	 * @param {...(ctx: { socket: SocketIO.Socket, path: string, body: any, next: () => void }) => void} middlewares
	 */
	on(path, ...middlewares) {
		switch (path) {
			case 'connect':
				this._onConnect = (socket) => {
					if (middlewares[0]) {
						middlewares[0]({ socket })
					}
				}
				break
			case 'disconnect':
				this._onDisconnect = (socket, body) => {
					if (middlewares[0]) {
						middlewares[0]({ socket, body })
					}
				}
				break
			default:
				super.on(path, ...middlewares)
		}
	}

	/**
	 * @param {number} port 
	 * @param {() => void} callback 
	 */
	listen(port, callback) {
		this._server.listen(port, callback)
	}

}

module.exports = App