const mime = require('mime')
const url = require('url')
const fs = require('fs')
const path = require('path')

module.exports = (public, req, res) => {
	if (public) {
		const index = url.parse(req.url).pathname
		const pathname = index == '/' ? '/index.html' : index
		res.writeHead(200, { 'Content-Type': mime.getType(pathname) })
		fs.readFile(path.join(public, pathname), (err, data) => {
			if (err) {
				res.writeHead(500)
				res.end(err.stack)
			}
			else {
				res.end(data)
			}
		})
	}
	else {
		res.writeHead(404)
		res.end('Not Found')
	}
}