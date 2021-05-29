import styles from '../css/main.css';

const d = document;

//Obteniendo elementos DOM de card
const $chatContainer = d.getElementById('chatContainer');
const $logginContainer = d.getElementById('logginContainer');
const $userListContainer = d.getElementById('userListContainer');

// Obteniendo elementos DOM del chat
const $messageForm = d.getElementById('message-form');
const $messageBox = d.getElementById('message');
const $chat = d.getElementById('chat');

// Obteniendo elementos DOM del loggin
const $nickForm = d.getElementById('nickForm');
const $nickError = d.getElementById('nickError');
const $nickName = d.getElementById('nickName');
const $users = d.getElementById('userNames');

// Variables constamtes o funciones
const displayMsg = ({ message, nickname, to = '' }, type = 'text') => {
	const name =
		type === 'whisper' && to !== ''
			? `Para > ${to}`
			: type === 'whisper' && to === ''
			? `De > ${nickname}`
			: nickname;

	$chat.insertAdjacentHTML(
		'beforeend',
		`<p class="chat__${type}">
			<b>${name}</b>: ${message}
		</p>`
	);
};

// Inicialización y eventos Websocket
const socket = io();

socket.on('usernames', (users) => {
	let html = '';

	Object.keys(users).forEach((user) => (html += `<li>${user}</li>`));
	$users.innerHTML = html;
});

socket.on('new message', displayMsg);

socket.on('whisper', (data) => displayMsg(data, 'whisper'));

socket.on('old messages', (data) =>
	data.forEach((el) => displayMsg(el, 'old-msg'))
);

// Eventos DOM
$messageForm.addEventListener('submit', (e) => {
	e.preventDefault();

	socket.emit('send message', $messageBox.value, (data) => {
		$chat.insertAdjacentHTML('beforeend', `<p class="chat__error">${data}</p>`);
	});

	$messageBox.value = '';
});

$nickForm.addEventListener('submit', (e) => {
	e.preventDefault();

	socket.emit('new user', $nickName.value, (data) => {
		if (data) {
			$logginContainer.classList.add('card--none');
			$chatContainer.classList.remove('card--none');
			$userListContainer.classList.remove('card--none');
		} else {
			$nickError.textContent = 'Usuario ingresado ya existente.';
			setTimeout(() => ($nickError.textContent = ''), 15000);
		}

		$nickName.value = '';
		$messageBox.focus();
	});
});

d.addEventListener('DOMContentLoaded', (e) => {
	$nickName.focus();
});
