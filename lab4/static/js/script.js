window.onload = () => {
    const socket = io();
    let username = prompt('Please enter your name:', 'Joe');

    if (username == null || username == '') {
        username = 'User';
    }

    document.querySelector('.username').textContent = username;

    const form = document.getElementById('form'),
        input = document.getElementById('input'); 

    input.focus();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value) {
        socket.emit('msg', { "msg": input.value, "user": username });
        input.value = '';
        input.focus();
      }
    });

    socket.on('msg', createMessage);

    fetch('/messages').then(res => {
        res.json().then(msgs => {
            msgs.forEach(createMessage);
        });
    }).catch(err => {
        console.log('Failed to load messages!');
    });

    function createMessage(msg) {
        const item = document.createElement('li'),
            name = document.createElement('b'),
            message = document.createElement('span');

        name.textContent = msg.user + ': ';
        item.appendChild(name);
        message.textContent = msg.msg;
        item.appendChild(message);
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
}