const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
	    credentials: true,
	    origin: ["http://localhost:8080"],
	    optionsSuccessStatus: 200
	},
	allowEIO3: true
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true,
  cookie: {  }
}));

app.use('/api/auth', require('./api/auth'));
app.use('/api/chat', require('./api/chat'));
app.use('/api/userStats', require('./api/userStats'));
app.use('/api/adventure', require('./api/adventure'));

var users = [];

io.sockets.on('connection', socket => {
	socket.on('send message', data => {
		socket.broadcast.emit('send message', { userId: data.userId, username: data.username, text: data.text, date: data.date });
	});

	socket.on('user join', data => {
		data.x = ~~(Math.random() * 975) + 25;
		data.y = ~~(Math.random() * 975) + 25;
		users.push(data);

		socket.emit('set user position', { enemies: users.filter(user => user._id !== data._id), player: data });
	});

	socket.on('set user position', data => {
		users = users.map(user => {
			if(user._id === data._id) {
				user.x = data.x;
				user.y = data.y;

				return user;
			} else {
				return user;
			}
		});

		socket.emit('set user position', { enemies: users.filter(user => user._id !== data._id), player: data });
	});

	socket.on('user leave', data => {
		users = users.filter(user => user._id !== data._id);
	});

	socket.on('disconnect', data => {
		users = users.filter(user => user._id !== data._id);
	});
});

async function startServer() {
	await mongoose.connect('mongodb+srv://Yunkan:qwerty12345@cluster0.k3zvr.mongodb.net/zhitie?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	});

	server.listen(5000, () => {
		console.log('Server has been started at port 5000...');
	});
}

startServer();