var five = require("johnny-five");
var board = new five.Board();

var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var io = sailsIOClient(socketIOClient);

io.sails.autoConnect = false;
io.sails.useCORSRouteToGetCookie = false;
io.sails.url = 'https://gestioncameraapi.herokuapp.com:443';

board.on("ready", function() {

    var socket = io.sails.connect('https://gestioncameraapi.herokuapp.com:443');

    /*var exec = require('child_process').exec;
    var cmd = 'ffmpeg -s 160x120 -f video4linux2 -i /dev/video0 -r 20 -f mpeg1video -ab 128k -r 20 http://192.168.43.239:8082/pass/160/120';
    */

    var servo = new five.Servo({
        pin: 6,
        range: [10, 170]
    });

    socket.on('connect', function(msg) {
        //handle socket event
        socket.get('/camera/index', function() {
            //call a get to subscribe to cameras
        });

        socket.on('device', function notificationReceivedFromServer(message) {
            if (message.data.id == 13) {
                servo.to(170 - (message.data.angle / 180.0 * 170.0), 2000);
            }
        });
    });

    /*exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
    });*/
});
