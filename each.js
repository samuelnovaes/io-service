const { EventEmitter } = require('events')

module.exports = (arr, cb) => {
	const emitter = new EventEmitter()
	emitter.on('run', (i) => {
		if (i < arr.length) {
			cb(arr[i], () => {
				emitter.emit('run', ++i)
			})
		}
	})
	emitter.emit('run', 0)
}