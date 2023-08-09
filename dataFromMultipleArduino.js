/**
 * dependencies of the project
 ** expressjs
 ** socket.io
 ** serialport
 *! autodetect is used for detecting ports automatically
 */
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { autoDetect } = require('@serialport/bindings-cpp');
const { SerialPort, ReadlineParser } = require('serialport');

/**
 * initialization and variable declarations
 */
const app = express();
const server = http.createServer(app);
const io = new Server(server);

let Binding = autoDetect(); // function fo detect all connected devices in this PC

Binding.list().then(ports => {
    let port_paths = [];        //an array to store device paths
    /**
     *! vendorID for arduino devices is 2341
     ** search for the arduino board in device lists
     ** if found add it to port_paths[] array
     */
    ports.forEach(function (port) {
        if (port.vendorId == "2341") {
            // console.log(port);
            port_paths.push(port.path);
        }
    });

    /**
     * check how many device is detected and start operations
     */
    if (port_paths.length > 0) {
        /**starting point of application */
        app.get("/", (req, res) => {
            res.sendFile('index.html', { root: '.' });
        });

        /**
         * for every detected device initialize a serial port to start communication
         */
        port_paths.forEach(function (path, index) {
            console.log('Opening ' + path);

            const port = new SerialPort({
                path: path,
                baudRate: 9600,
                dataBits: 8,
                parity: 'none',
                stopBits: 1,
                flowControl: false,
            });
            const parser = port.pipe(new ReadlineParser());     //parser for receiving incoming data from arduino

            /**
             * when data is available to parser; server calls the emit function
             * which sends the following information
             * * number of connected devices
             * * index of the device
             * * and JSON data
             * to the client
             */
            parser.on('data', function (data) {
                // console.log('received from ' + path + ': ' + data);
                io.emit("arduino_data", { 'number_of_devices': port_paths.length, 'index': index, 'device': path, 'data': JSON.parse(data) });
            });

            /**
             * !what to do when error occurs on serial port
             */
            port.on('error', function (e) {
                console.error(e.message);
                process.exit(0);
            });

            /**
             * !what to do when serial port opens
             */
            port.on('open', function () {
                console.log('Serial port ' + this.path + ' opened');
            });

            /**
             * ! what to do when serial port closes
             */
            port.on('close', function (err) {
                console.log('Serial port closed: ' + err);
                process.exit(0);
            });

            /**
             * after connection stablishment keep listening for commands to send it to the desired device
             * ! if the command is "all" send it to all device
             * ! otherwise send it to specific device
             */
            io.on('connection', (socket) => {
                socket.on('fetchData', function (data) {
                    if (data.command == "all" || data.command == index) {
                        port.write(data.command);
                    }
                    // console.log([data, index]);
                    // console.log(data.command == index ? 1 : -1);
                });
            });

        });

    } else {
        console.log("arduino not detected");
    }
});

server.listen(3000, () => {
    console.log("listening on *.3000");
});
console.log("Web Server Started go to `http://localhost:3000` in your  Browser.");