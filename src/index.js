const path = require('path');
const http = require('http');

const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const app = express();

// Dotenv
require('dotenv').config();

// Conexión a la BD
const dBuser = process.env.DB_USER;
const dBpassword = process.env.DB_PASSWORD;
const dBname = process.env.DB_NAME;

const uri = `mongodb+srv://${dBuser}:${dBpassword}@cluster00.bfu7f.mongodb.net/${dBname}?retryWrites=true&w=majority`;

mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('conectado a la base de datos cgaf'))
	.catch((err) => console.log(err));

// Configuración
app.set('port', process.env.PORT || 3000);

// Websocket
const httpServer = http.createServer(app);
const io = socketio(httpServer, {});

require('./sockets')(io);

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Empezando el servidor
httpServer.listen(app.get('port'), () => {
	console.log('Escuchando en el puerto: ' + app.get('port'));
});
