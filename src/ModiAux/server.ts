import net from 'net'
import fs from 'fs'

const port: number = 3000;

type message = {
  responseCode: number;
  command: string;
  parameters: string[];
}

// type messageResponse = {  
//   responseCode: number;
//   data: string;
// }

const server = net.createServer((connection) => {
  console.log('Client connected');
  let wholeData: string = '';
  connection.on('data', (data) => {
    wholeData += data.toString();
    if (data.toString().includes('\n')) {
      console.log('Starting to process the command..:')
      let message: message = JSON.parse(wholeData);
      switch (message.command) {
        case 'get':
          console.log('Command get received');
          console.log('Parameters: ' + message.parameters);
          fs.readFile(message.parameters[0], (err, data) => {
            if (err) {
              connection.write(JSON.stringify({ responseCode: -1, data: err.message }) + '\n');
            } else {
              console.log('File read successfully:' + data.toString());
              connection.write(JSON.stringify({ responseCode: 200, data: data.toString() }) + '\n');
            }
            connection.end();
          });
      }
    }
  });
})

server.listen(port, () => {
  console.log('Server listening on port ' + port);
});