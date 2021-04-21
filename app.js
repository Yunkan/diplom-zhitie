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

var rooms = [];

function userLeave(socket, id) {
	const currentRoom = rooms.find(room => room.users.find(user => user._id === id));
		if(currentRoom) {
			const currentUser = currentRoom.users.find(user => user._id === id);
			currentRoom.users = currentRoom.users.filter(user => user._id !== id);
			socket.leave(`rooms${rooms.indexOf(currentRoom)}`);

			socket.broadcast.to(`room${rooms.indexOf(currentRoom)}`).emit('set user position', {
				enemies: currentRoom.users.filter(user => user._id === id)
			});

			rooms = rooms.filter(room => room.users.length > 0);
		}
}

io.sockets.on('connection', socket => {
	socket.on('send message', data => {
		socket.broadcast.emit('send message', { userId: data.userId, username: data.username, text: data.text, date: data.date });
	});

	socket.on('user join', data => {
		if(rooms.length === 0) {
			rooms.push({
				users: [],
				stones: []
			});
		}

		let currentRoom = rooms.find(room => room.users.length < 5);

		if(currentRoom) {
			currentRoom.users.push(data);
		} else {
			currentRoom = {
				users: [data],
				stone: []
			}

			rooms.push(currentRoom);
		}

		socket.userId = data.info._id;
		socket.join(`room${rooms.indexOf(currentRoom)}`);

		socket.emit('set user position', { enemies: currentRoom.users.filter(user => user.info._id !== data.info._id) });
	});

	socket.on('set user position', data => {
		const currentRoom = rooms.find(room => room.users.find(user => user.info._id === data.info._id));

		if(currentRoom) {
			const currentUser = currentRoom.users.find(user => user.info._id === data.info._id);
			currentUser.x = data.x;
			currentUser.y = data.y;

			socket.broadcast.to(`room${rooms.indexOf(currentRoom)}`).emit('set user position', {
				enemies: currentRoom.users.filter(user => user.info._id === data.info._id)
			});
		}
	});

	socket.on('set stones position', data => {
		data.forEach(stone => {
			const currentRoom = rooms.find(room => room.users.find(user => user.info._id === stone.owner.info._id));

			if(currentRoom) {
				currentRoom.stones.push(stone);

				socket.broadcast.to(`room${rooms.indexOf(currentRoom)}`).emit('set stones position', {
					stones: currentRoom.stones
				});
			}
		});
	});

	socket.on('user leave', data => {
		userLeave(socket, data._id);
	});

	socket.on('disconnecting', data => {
		userLeave(socket, socket.userId);
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