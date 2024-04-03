import net from 'net'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { stat } from 'fs';

const kPort: number = 3000;

type message = {
  command: string;
  parameters: string[];
}

const server = net.createServer({ allowHalfOpen: true }, (connection) => {
  console.log('Client connected');
  let wholeData: string = '';
  connection.on('data', (data) => {
    wholeData += data.toString();
    if (data.toString().includes('\n')) {
      console.log('Starting to process the command..:')
      let message: message = JSON.parse(wholeData);
      console.log(message);
      // check with stat of fs if the file exists
      stat(message.parameters[0], (err) => {
        if (err) {
          connection.write(JSON.stringify({ responseCode: -2, data: 'File not found' }));
          connection.end();
        } else {
          console.log('File' + message.parameters[0] + ' exists');
          let processCat: ChildProcessWithoutNullStreams = spawn('cat', [message.parameters[0]]);
          let wholeDataCat: string = '';
          processCat.stdout.on('data', (data) => {
            wholeDataCat += data.toString();
          });
          processCat.on('close', () => {
            let processWc: ChildProcessWithoutNullStreams = spawn('wc', message.parameters.slice(1));
            processWc.stdin.write(wholeDataCat);
            processWc.stdin.end();
            processWc.stdout.on('data', (data) => {
              console.log('Resultado: ' + data.toString());
              connection.write(JSON.stringify({ responseCode: 200, data: data.toString() }));
              connection.end();
            });
          });
        }
      });
    }
  });
})

server.listen(kPort, () => {
  console.log('Server listening on port ' + kPort);
});