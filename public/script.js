const ws = new WebSocket('ws://localhost:3000');
const chat = document.getElementById('chat');
const input = document.getElementById('input');

let myClientId = null;

ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'welcome') {
        myClientId = data.clientId;
        console.log(`Your ID: ${myClientId}`);
        return;
    }

    const msgDiv = document.createElement('div');
    msgDiv.classList.add("message");

    const nameDiv = document.createElement('div');
    nameDiv.classList.add("name");
    nameDiv.textContent = `Client #${data.clientId}`;

    const textDiv = document.createElement('div');
    textDiv.textContent = data.text;

    msgDiv.appendChild(nameDiv);
    msgDiv.appendChild(textDiv);

    if (data.clientId === myClientId) {
        msgDiv.classList.add("mine");
    } else {
        msgDiv.classList.add("other");
    }

    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
});


input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value.trim()) {
        ws.send(JSON.stringify({ text: input.value.trim() }));
        input.value = '';
    }
});


