# io-service
Socket.io based web framework.

# Installing
`npm install io-service`

# Hello World
Server side
```javascript
const { App } = require('io-service')
const app = new App()

app.on('greeting', (ctx) => {
	ctx.socket.emit('greeting', `Hello ${ctx.body.name}`)
})

app.listen(8080, () => {
	console.log('Server started')
})
```

Client side (Using Socket.io client library)
```javascript
const socket = io('http://localhost:8080')

socket.emit('greeting', 'John Doe')
socket.on('greeting', (data) => {
	console.log(data) //Hello John Doe!
})
```

# The `connect` and `disconnect` events
The `connect` event is called when a socket client is connected
```javascript
app.on('connect', (ctx) => {
	...
})
```

The `disconnect` event is called when a socket client is disconnected
```javascript
app.on('disconnect', (ctx) => { //ctx.body is the reason for disconnecting
	...
})
```

# Using middlewares
You can create middlewares creating events with the same path and calling the `next()` method to call the next middleware.
```javascript
app.on('greeting', (ctx) => {
	console.log('I am a middleware')
	ctx.next() //call next middleware	
})

app.on('greeting', (ctx) => {
	ctx.socket.emit('greeting', `Hello ${ctx.body.name}`)
})
```
Or loading a series of middleware functions at a mount point, with a mount path.
```javascript
app.on('greeting', (ctx) => {
	console.log('I am a middleware')
	ctx.next() //call next middleware	
}, (ctx) => {
	ctx.socket.emit('greeting', `Hello ${ctx.body.name}`)
})
```

# Unsing routers
A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

index.js
```javascript
const { App } = require('io-service')
const users = require('./users.js')
const app = new App()

app.on('users', users)
```

users.js
```javascript
const { Router } = require('io-service')
const router = new Router()

router.on('create', (ctx) => {
	...
})

router.on('update', (ctx) => {
	...
})

router.on('delete', (ctx) => {
	...
})

router.on('list', (ctx) => {
	...
})

module.exports = router
```

Client side
```javascript
socket.emit('users/create', ...)
socket.emit('users/update', ...)
socket.emit('users/delete', ...)
socket.emit('users/list', ...)
```

# Serving static files
```javascript
const app = new App({
	static: 'path/to/static/files'
})
```

# Serving over HTTPS
```javascript
const app = new App({
	httpsOptions: {
		key: fs.readFileSync('server.key'),
		cert: fs.readFileSync('server.cert')
	}
})
```

# The `ctx` Object
- **socket**: The connected socket
- **path**: The request path
- **body**: The request body
- **packet**: The request packet
- **next()**: Function to call the next middleware