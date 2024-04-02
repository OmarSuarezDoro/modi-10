import net from 'net';
import { MessageEventEmitterClient } from './ClientEventEmmiter.js';
import { writeFile } from 'fs';

// type messageResponse = {  
//   responseCode: number;
//   data: string;
// }
let socket = net.connect({port: 3000});
const client = new MessageEventEmitterClient(socket);
// send the message to the server once the connection is established
socket.on('connect', () => {
  socket.write(JSON.stringify({responseCode: 200, command: 'get', parameters: ['./helloworld.txt']}) + '\n');
});

client.on('message', (message) => {
  writeFile('./helloworld2.txt', message.data, (err) => {
    if (err) {
      console.log(err);
    }
  });
})