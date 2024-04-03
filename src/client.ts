import net from 'net';

/**
 * This type represents the command that the client sends to the server
 */
export type messageCommand = {
  command: string;
  parameters: string[]; // First the name of the file, then the options
}

/**
 * This type represents the message that the server sends to the client
 */
export type messageServer = {
  responseCode: number;
  data: string;
}


const kPort : number = 3000;
let socket = net.connect({port: kPort});
let chunks : string = ''; 

// On connection will parse the arguments and send them to the server into a JSON object
socket.on('connect', () => {
  console.log('Connected to server');
  let params : string[] = [process.argv[2]];
  if (process.argv[3] != undefined) {
    params.push(process.argv[3]);
  }
  socket.write(JSON.stringify({command: 'get', parameters: params }) + '\n');
})

socket.on('data', (data) => {
  chunks += data.toString();
})

socket.on('close', () => {
  let message : messageServer = JSON.parse(chunks);
  if (message.responseCode < 0) {
    console.log('An error has ocurred!');
    console.error('Error ' + message.responseCode + ':' + message.data); 
  } else {
    console.log('The data is: ');
    console.log(message.data);
  }
  console.log('Finishing connection!');
});