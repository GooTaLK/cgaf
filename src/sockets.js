const Chat = require('./models/chat');

module.exports = (io) => {
	const users = {};

	const updateUsernames = () => io.sockets.emit('usernames', users);

	io.on('connection', async (socket) => {
		console.log('Nuevo usuario conectado');

		const messages = await Chat.find({});
		socket.emit('old messages', messages);

		socket.on('new user', (data, cb) => {
			if (data in users) {
				cb(false);
			} else {
				cb(true);
				socket.nickname = data;
				users[socket.nickname] = socket.id;
				updateUsernames();
			}
		});

		socket.on('send message', async (message, cb) => {
			let msg = message.trim();

			if (msg.slice(0, 3) === '/w ') {
				msg = msg.slice(3);
				const index = msg.indexOf(' ');

				if (index !== -1) {
					const name = msg.slice(0, index);
					msg = msg.slice(index + 1);

					if (name in users) {
						socket.to(users[name]).emit('whisper', {
							message: msg,
							nickname: socket.nickname,
						});
						socket.emit('whisper', {
							message: msg,
							nickname: socket.nickname,
							to: name,
						});
					} else {
						cb('¡Error! Por favor ingrese un usuario valido.');
					}
				} else {
					cb('¡Error! Por favor ingrese su mensaje después del usuario.');
				}
			} else {
				const newMsg = Chat({
					nickname: socket.nickname,
					message: msg,
				});

				await newMsg.save();

				io.sockets.emit('new message', { message, nickname: socket.nickname });
			}
		});

		socket.on('disconnect', () => {
			if (!socket.nickname) return;

			delete users[socket.nickname];
			updateUsernames();
		});
	});
};
