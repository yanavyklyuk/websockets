const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

app.use(express.static('public'));

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let clientId = 0;

wss.on('connection', (ws) => {
    ws.id = ++clientId;
    console.log(`Client #${ws.id} added`);

    ws.send(JSON.stringify({ type: 'welcome', clientId: ws.id }));

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            const data = JSON.stringify({ clientId: ws.id, text: parsedMessage.text });

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        } catch (error) {
            console.error("Error JSON:", error);
        }
    });

    ws.on('close', () => {
        console.log(`Client #${ws.id} left the chat`);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'leave', clientId: ws.id }));
            }
        });
    });
});


server.listen(3000, () => {
    console.log('Server http://localhost:3000');
});
