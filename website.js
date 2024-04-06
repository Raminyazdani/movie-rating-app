const { exec } = require('child_process');
const path = require('path');

// Define server and client directory paths
const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

// Function to run a command in a directory
const runCommandInDirectory = (command, directory) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: directory }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running command '${command}' in directory '${directory}':`, error);
                reject(error);
            } else {
                console.log(stdout);
                console.error(stderr);
                resolve();
            }
        });
    });
};

// Run 'node app.js' in the server directory
runCommandInDirectory('node app.js', serverDir)
    .then(() => console.log('Server started successfully'))
    .catch(error => console.error('Error starting server:', error));

// Run 'npm start' in the client directory
runCommandInDirectory('npm start', clientDir)
    .then(() => console.log('Client started successfully'))
    .catch(error => console.error('Error starting client:', error));
