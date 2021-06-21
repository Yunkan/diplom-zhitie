const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const Game = require('./models/Game');

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

app.use('/api/auth', require('./api/auth'));
app.use('/api/chat', require('./api/chat'));
app.use('/api/userStats', require('./api/userStats'));
app.use('/api/adventure', require('./api/adventure'));
app.use('/api/games', require('./api/games'));

var rooms = [];

io.sockets.on('connection', socket => {
	socket.on('send message', data => {
		socket.broadcast.emit('send message', { userId: data.userId, username: data.username, text: data.text, date: data.date });
	});

	socket.on('refresh games', data => {
		socket.broadcast.emit('refresh games', data);
	});

	socket.on('user join', async data => {
		const game = await Game.findById(data.game._id);

		if(game) {
			const currentRoom = rooms.find(room => room.name + "" === game._id + "");
			
			if(currentRoom) {
				const currentUser = currentRoom.users.find(user => user._id === data.user._id);
				if(!currentUser) {
					if(currentRoom.users.length < 2) {
						currentRoom.users.push(data.user);
						currentRoom.gameStart = true;
						await Game.findOneAndUpdate({ _id: game._id }, { userAmount: currentRoom.users.length });
						socket.join(`room${game._id}`);
						io.sockets.to(`room${game._id}`).emit('refresh user', { users: currentRoom.users, game });

						if(currentRoom.users.length === 2) {
							io.sockets.emit('remove game', currentRoom);
						}
					}
				}
			} else {
				rooms.push({
					name: game._id,
					users: [data.user],
					gameType: game.gameType,
					game: {}
				});
				socket.join(`room${game._id}`);
				io.sockets.to(`room${game._id}`).emit('refresh user', { users: [data.user], game });
			}
		}
	});

	socket.on('user leave', async data => {
		const currentRoom = rooms.find(room => room.users.find(user => user._id === data._id));

		if(currentRoom) {
			if(currentRoom.gameStart && currentRoom.users.length === 2) {
				currentRoom.gameStart = false;
				io.sockets.to(`room${currentRoom.name}`).emit('technical defeat', { user: data });
			}

			currentRoom.users = currentRoom.users.filter(user => user._id !== data._id);
			socket.leave(`room${currentRoom.name}`);

			if(currentRoom.users.length <= 0) {
				rooms = rooms.filter(room => room.name !== currentRoom.name);
				await Game.deleteOne({ _id: currentRoom.name });

				io.sockets.emit('remove game', currentRoom);
			}
		}
	});

	socket.on('fistFight start', data => {
		const currentRoom = rooms.find(room => room.users.find(user => user._id === data._id));

		if(currentRoom) {
			const currentUser = currentRoom.users.find(user => user._id === data._id);
			if(!currentUser.breath) {
				currentUser.breath = 100;
				io.sockets.to(`room${currentRoom.name}`).emit('fistFight refresh', { users: currentRoom.users });
			}
		}
	});

	function fistFightCheckWin(room, user, enemy) {
		if(enemy.breath <= 0) {
			room.gameStart = false;
			io.sockets.to(`room${room.name}`).emit('fistFight end', { winner: user });
		}
	}

	function fistFightHit(currentUser, enemyUser, damage, selfDamage, target, currentRoom) {
		let translateTarget = '';
		switch(target) {
			case 'body':
				translateTarget = 'тело';
				break;
			case 'head':
				translateTarget = 'голову';
				break;
		}

		if(enemyUser.def != target) {
			enemyUser.breath -= damage;
			currentUser.breath -= selfDamage;
			currentRoom.game.info = `${currentUser.username} ударил в ${translateTarget} ${enemyUser.username}, нанося ${damage} едениц урона!`;
		} else {
			currentUser.breath -= selfDamage;
			currentRoom.game.info = `${enemyUser.username} заблокировал удар!`;
		}
		enemyUser.def = '';
		currentRoom.game.turn = enemyUser._id;

		fistFightCheckWin(currentRoom, currentUser, enemyUser);
		io.sockets.to(`room${currentRoom.name}`).emit('fistFight refresh', { users: currentRoom.users, game: currentRoom.game });
	}

	socket.on('fistFight hitInBody', data => {
		const currentRoom = rooms.find(room => room.users.find(user => user._id === data._id));

		if(currentRoom) {
			const currentUser = currentRoom.users.find(user => user._id === data._id);
			const enemyUser = currentRoom.users.find(user => user._id !== data._id);

			const damage = ~~(Math.random() * 10 + 5);
			const selfDamage = ~~(damage / 3);

			fistFightHit(currentUser, enemyUser, damage, selfDamage, 'body', currentRoom);
		}
	});

	socket.on('fistFight hitInHead', data => {
		const currentRoom = rooms.find(room => room.users.find(user => user._id === data._id));

		if(currentRoom) {
			const currentUser = currentRoom.users.find(user => user._id === data._id);
			const enemyUser = currentRoom.users.find(user => user._id !== data._id);

			const damage = ~~(Math.random() * 15 + 8);
			const selfDamage = ~~(damage / 3);

			fistFightHit(currentUser, enemyUser, damage, selfDamage, 'head', currentRoom);
		}
	});

	socket.on('fistFight defBodyTarget', data => {
		const currentRoom = rooms.find(room => room.users.find(user => user._id === data.user._id));

		if(currentRoom) {
			const currentUser = currentRoom.users.find(user => user._id === data.user._id);
			const enemyUser = currentRoom.users.find(user => user._id !== data.user._id);

			currentUser.def = data.target;
			currentRoom.game.turn = enemyUser._id;
			currentRoom.game.info = `${currentUser.username} защищается!`;

			io.sockets.to(`room${currentRoom.name}`).emit('fistFight refresh', { users: currentRoom.users, game: currentRoom.game });
		}
	});

	socket.on('connectFour setBrick', data => {
		const currentRoom = rooms.find(room => room.users.find(user => user._id === data.user._id));

		if(currentRoom) {
			const currentUser = currentRoom.users.find(user => user._id === data.user._id);
			const enemyUser = currentRoom.users.find(user => user._id !== data.user._id);

			currentRoom.game.table = data.game.table;
			currentRoom.game.turn = enemyUser._id;

			io.sockets.to(`room${currentRoom.name}`).emit('connectFour refresh', { game: currentRoom.game });
		}
	});

	socket.on('connectFour end', data => {
		const currentRoom = rooms.find(room => room.users.find(user => user._id === data.user._id));

		if(currentRoom) {
			currentRoom.gameStart = false;
		}
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